import { Server } from "socket.io";
import { getValidHectoDigits } from "../utils/generateProblem.js";
import { Match } from "../models/matchModel.js";
import { User } from "../models/userModel.js";

let io;
const playerQueue = new Map();

function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: ["http://localhost:3000"],
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log(`🔌 A user connected: ${socket.id}`);

    socket.on("join_matchmaking", async ({ userId }) => {
      console.log(`🎮 User joined matchmaking: ${userId}`);
      playerQueue.set(socket.id, userId);

      try {
        // Try to find a match
        let pendingMatch = await Match.findOne({
          status: "pending",
          player2: null,
        });

        if (pendingMatch) {
          // Found a pending match
          pendingMatch.player2 = userId;
          pendingMatch.status = "started";
          await pendingMatch.save();

          const roomId = pendingMatch._id.toString();
          socket.join(roomId);

          // Fetch both players
          const player1 = await User.findById(pendingMatch.player1);
          const player2 = await User.findById(pendingMatch.player2);

          // Get socket of player1
          const player1SocketId = [...playerQueue.entries()].find(
            ([, val]) => val === pendingMatch.player1
          )?.[0];

          if (player1SocketId) {
            const player1Socket = io.sockets.sockets.get(player1SocketId);
            if (player1Socket) {
              player1Socket.join(roomId);

              player1Socket.emit("matchFound", {
                matchId: pendingMatch._id,
                opponent: {
                  userName: player2.userName,
                  rating: player2.rating,
                  avatar: player2.userName[0].toUpperCase(),
                  avatarColor: "bg-purple-600",
                },
              });
            }
          }

          // Emit to player2 (current socket)
          socket.emit("matchFound", {
            matchId: pendingMatch._id,
            opponent: {
              userName: player1.userName,
              rating: player1.rating,
              avatar: player1.userName[0].toUpperCase(),
              avatarColor: "bg-purple-600",
            },
          });

          // Notify both players
          io.to(roomId).emit("matchStarted", {
            matchId: pendingMatch._id,
            player1: pendingMatch.player1,
            player2: pendingMatch.player2,
            problem: pendingMatch.problem,
          });

          console.log(`✅ Match ${pendingMatch._id} started in room ${roomId}`);
        } else {
          // No pending match found
          const problem = await getValidHectoDigits();
          const newMatch = new Match({
            player1: userId,
            status: "pending",
            problem,
          });

          await newMatch.save();
          const roomId = newMatch._id.toString();
          socket.join(roomId);

          socket.emit("waitingForOpponent", {
            matchId: newMatch._id,
          });

          console.log(`🆕 Match ${newMatch._id} created. Waiting for opponent...`);
        }

        // Log rooms
        console.log(
          "📦 Current rooms:",
          Array.from(io.sockets.adapter.rooms.keys())
        );
      } catch (err) {
        console.error("❌ Matchmaking error:", err);
        socket.emit("matchmakingError", {
          message: "Something went wrong during matchmaking. Try again!",
        });
      }
    });

    socket.on("disconnect", async () => {
      console.log(`❎ User disconnected: ${socket.id}`);
      const userId = playerQueue.get(socket.id);
      const matchId = socketToMatchMap.get(socket.id);
    
      playerQueue.delete(socket.id);
      socketToMatchMap.delete(socket.id);
    
      if (matchId) {
        try {
          const match = await Match.findById(matchId);
          if (match && match.status === "started") {
            match.status = "draw"; // or 'forfeit'
            match.winner = null;
            match.endTime = new Date();
            await match.save();
    
            io.to(matchId).emit("match_ended", {
              matchId,
              reason: "opponent_disconnected",
              result: "draw",
            });
    
            console.log(`⚖️ Match ${matchId} ended due to disconnect`);
          }
        } catch (err) {
          console.error("❌ Error handling disconnect match update:", err);
        }
      }
    });    
  });
}

function getIo() {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
}

export { initSocket, getIo };
