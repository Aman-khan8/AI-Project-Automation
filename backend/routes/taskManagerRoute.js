import addTask from "../controller/addTaskController.js";
import editTask from "../controller/editTaskController.js";
import deleteTask from "../controller/addTaskController.js";
import express from "express";
const router=express.Router();

router.post("/addTask", addTask);
router.put("/editTask", editTask);
router.delete("/deleteTask", deleteTask);

export default router;