import { Server } from "socket.io";
import { Match } from "./models/matchModel.js";
import { User } from "./models/userModel.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:3000"],
        methods: ["GET", "POST"]
    }
});

io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("submitanswer", async ({ matchId, userId, answer }) => {
        try {
            console.log(`User ${userId} submitted answer: ${answer}`);

            const match = await Match.findById(matchId);
            if (!match || match.status !== "started") {
                return socket.emit("error", "Match not found or already finished");
            }

            let isValid = false;
            try {
                const evalAnswer = answer.replace(/×|x/g, "*").replace(/÷/g, "/");
                if (eval(evalAnswer) === 100) {
                    isValid = true;
                }
            } catch (error) {
                console.error("Invalid expression:", error);
                return socket.emit("error", "Invalid expression format");
            }

            if (isValid) {
                if (!match.winner) {
                    match.winner = userId;
                    match.status = "finished";
                    match.endTime = new Date();
                    await match.save();

                    await User.findByIdAndUpdate(userId, { $inc: { "stats.gamesPlayed": 1, "stats.wins": 1 } });

                    const loserId = userId === match.player1 ? match.player2 : match.player1;
                    if (loserId) {
                        await User.findByIdAndUpdate(loserId, { $inc: { "stats.gamesPlayed": 1, "stats.losses": 1 } });
                    }

                    io.to(matchId).emit("matchFinished", { winner: userId });

                    return socket.emit("matchResult", { message: "You won the match!", match });
                } else {
                    return socket.emit("error", "Match already won by another player");
                }
            }

            return socket.emit("error", "Incorrect answer, try again");
        } catch (error) {
            console.error("Error in submitanswer:", error);
            return socket.emit("error", "Internal server error");
        }
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

export { app, io, server }