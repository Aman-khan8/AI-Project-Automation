import express from "express"
import dotenv from "dotenv"
import connectDB from "./DB/dbConnection.js";
import protect from "./middlewares/authMiddleware.js";
import errorHandler from "./middlewares/errorMiddleware.js";
import authRouter from "./routes/authRoute.js";
import taskRouter from "./routes/taskManagerRoute.js";
import cookieParser from "cookie-parser";
import cors from "cors"
dotenv.config();

const app=express();
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use(cookieParser());
app.use(express.json());


connectDB();

app.use("/api/auth",authRouter);
app.use("/api/tasks",protect,taskRouter);
app.use(errorHandler);
app.listen(process.env.PORT || 5000,()=>(console.log("Server is running on port 5000")));