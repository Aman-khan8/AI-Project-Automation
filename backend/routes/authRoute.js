import express from "express"
import  loginUser  from "../controller/loginController.js";
import  signUp  from "../controller/signupController.js";
import logout from "../controller/logoutController.js";
const router=express.Router();

router.post("/login", loginUser);
router.post("/signup", signUp);
router.post("/logout",logout);

export default router;