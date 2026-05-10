import express from "express"
import dotenv from "dotenv"
import connectDB from "./DB/dbConnection.js";
import protect from "./middlewares/authMiddleware.js";
import errorHandler from "./middlewares/errorMiddleware.js";
import authRouter from "./routes/authRoute.js"
import cors from "cors"
dotenv.config();

const app=express();
app.use(cors());
app.use(express.json());
app.use(errorHandler);

connectDB();
app.use("/api/user",protect);
app.use("/api/auth",authRouter);

app.listen(process.env.PORT || 5000,()=>(console.log("Server is running on port 5000")));