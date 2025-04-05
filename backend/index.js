import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/database.js';
import userRoutes from './routes/userRoutes.js';
import matchRoutes from './routes/matchRoutes.js';
import trainingRoutes from "./routes/tarinigRoutes.js";
const app = express();


dotenv.config();

const port = process.env.PORT || 5000;

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
};
app.use(cors(corsOptions));

//routes
app.use("/api/users", userRoutes);
app.use("/api/match", matchRoutes);
app.use("/api/training", trainingRoutes);

app.listen(port, () => {
    connectDB();
    console.log(`Server is running on port ${port}`);
});

