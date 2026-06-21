import express from "express"
import dotenv from "dotenv"
dotenv.config();
import connectDB from "./DB/dbConnection.js";
import protect from "./middlewares/authMiddleware.js";
import errorHandler from "./middlewares/errorMiddleware.js";
import authRouter from "./routes/authRoute.js";
import taskRouter from "./routes/taskManagerRoute.js";
import userRouter from "./routes/userRoute.js";
import cookieParser from "cookie-parser";
import aiRouter from "./routes/aiRoute.js";
import cors from "cors"




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
app.use("/api/user",protect,userRouter);
app.use("/api/ai",protect,aiRouter);
app.use(errorHandler);
app.listen(process.env.PORT || 5000,()=>(console.log("Server is running on port 5000")));