import AiClient from "../controller/AIChatController.js"
import express from "express";

const router=express.Router();


router.post("/chat",AiClient);

export default router;