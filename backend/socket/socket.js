import { Server } from "socket.io";
import http from 'http';
import express from "express";
import { getValidHectoDigits } from "../utils/generateProblem.js";
import { Match } from "../models/matchModel.js";
import { User } from "../models/userModel.js";
import mongoose from "mongoose";

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
    console.log(`A user connected, ${socket.id}`);

    socket.on("join_matchmacking", async (userId) => {
      console.log(`User ${userId} joined matchmacking`);
      playerQueue.set(socket.id, userId);

      //tryto find a match when player2 is null
      let pendingMatch = await Match.findOne({
        status: "pending",
        player2: null,
      });

      if (pendingMatch) {
        pendingMatch.player2 = userId;
        pendingMatch.status = "started";
        await pendingMatch.save();

        const roomId = pendingMatch._id.toString();
        socket.join(roomId);

        // Get opponent details for each player
        const player1SocketId = [...playerQueue.entries()].find(
          ([, val]) => val === pendingMatch.player1
        )?.[0];
        const player1 = await User.findById(pendingMatch.player1);
        const player2 = await User.findById(pendingMatch.player2);

        if (player1SocketId) {
          io.to(player1SocketId).emit("match_found", {
            matchId: pendingMatch._id,
            opponent: {
              userName: player2.userName,
              rating: player2.rating,
            },
          });
        }

        socket.emit("match_found", {
          matchId: pendingMatch._id,
          opponent: {
            userName: player1.userName,
            rating: player1.rating,
          },
        });

        // Notify both players of match start
        io.to(roomId).emit("match_started", {
          matchId: pendingMatch._id,
          player1: pendingMatch.player1,
          player2: pendingMatch.player2,
          problem: pendingMatch.problem,
        });

        console.log(`Match ${pendingMatch._id} started`);
      } else {
        const newMatch = new Match({
          player1: userId,
          status: "pending",
          problem: await getValidHectoDigits(),
        });

        await newMatch.save();
        socket.join(newMatch._id.toString());
        socket.emit("waiting_for_opponent", {
          matchId: newMatch._id,
        });
        console.log(`Match ${newMatch._id} created`);
      }
    });

    socket.on("disconnect", () => {
      console.log("A user disconnected");
      playerQueue.delete(socket.id);
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
