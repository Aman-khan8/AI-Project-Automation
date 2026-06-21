import userController from "../controller/fetchUserDetailsController.js";
import express from "express";

const router=express.Router();

router.get("/detail",userController);

export default router;