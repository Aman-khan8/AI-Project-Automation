import express from "express"
import  loginUser  from "../controller/loginController.js";
import  signUp  from "../controller/signupController.js";
const router=express.Router();

router.post("/login", loginUser);
router.post("/signup", signUp);

export default router;