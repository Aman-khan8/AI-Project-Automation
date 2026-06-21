import addTask from "../controller/addTaskController.js";
import editTask from "../controller/editTaskController.js";
import deleteTask from "../controller/deleteTaskController.js";
import express from "express";
import fetch from "../controller/fetchTasksController.js";
const router=express.Router();

router.post("/addTask", addTask);
router.put("/editTask", editTask);
router.delete("/deleteTask", deleteTask);
router.get("/fetchTasks",fetch);

export default router;