// socket.js
import { Server } from "socket.io";
import { getValidHectoDigits } from "../utils/generateProblem.js";
import { Match } from "../models/matchModel.js";
import { User } from "../models/userModel.js";

let io;
const playerQueue = new Map(); // key = socketId, value = user object
const socketToMatchMap = new Map(); // key = socketId, value = roomId

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

    socket.on("joinQueue", async (user) => {
      console.log(`${user.userName} joined the queue`);
      try {
        console.log(`${user.userName} joined the queue`);
        playerQueue.set(socket.id, { socket, user });

        if (playerQueue.size >= 2) {
          const entries = Array.from(playerQueue.entries());
          const [id1, player1] = entries[0];
          const [id2, player2] = entries[1];

          // Remove from queue
          playerQueue.delete(id1);
          playerQueue.delete(id2);

          const roomId = `room-${id1.slice(-4)}-${id2.slice(-4)}`;
          socketToMatchMap.set(id1, roomId);
          socketToMatchMap.set(id2, roomId);

          // Join the room
          player1.socket.join(roomId);
          player2.socket.join(roomId);

          // Generate problem and create the match in DB
          const problem = await getValidHectoDigits();
          const match = await Match.create({
            player1: player1.user._id,
            player2: player2.user._id,
            status: "started",
            startTime: new Date(),
            problem: problem,
          });
          let count = 3;
          const countdownInterval = setInterval(() => {
            if (count > 0) {
              io.to(roomId).emit("countdown", count); // Emit countdown updates
              count--;
            } else {
              clearInterval(countdownInterval); // Clear interval when countdown is done

              // Emit the 'matchStart' event instead of 'matchFound' to both players
              player1.socket.emit("matchStart", {
                roomId,
                opponent: player2.user,
                problem: problem,
                matchId: match._id,
              });
              player2.socket.emit("matchStart", {
                roomId,
                opponent: player1.user,
                problem: problem,
                matchId: match._id,
              });

              console.log(
                `🎮 Match started: ${player1.user.userName} vs ${player2.user.userName}`
              );
            }
          }, 1000); // 1-second interval
        }
      } catch (error) {
        console.error("Error during matchmaking:", error);
        socket.emit("error", {
          message: "There was an error starting the match. Please try again.",
        });
      }
    });

    socket.on("disconnect", () => {
      console.log(`❎ User disconnected: ${socket.id}`);

      // Remove from queue if pending
      if (playerQueue.has(socket.id)) {
        playerQueue.delete(socket.id);
        console.log(`❎ User ${socket.id} removed from queue`);
      }

      // If in match, handle cleanup
      const roomId = socketToMatchMap.get(socket.id);
      if (roomId) {
        socket.to(roomId).emit("opponent_disconnected");
        socketToMatchMap.delete(socket.id);

        // Also remove opponent mapping
        for (const [id, room] of socketToMatchMap.entries()) {
          if (room === roomId && id !== socket.id) {
            socketToMatchMap.delete(id);
            break;
          }
        }
      }
    });
  });
}

function getIo() {
  if (!io) throw new Error("Socket.io not initialized");
  return io;
}

export { initSocket, getIo };
