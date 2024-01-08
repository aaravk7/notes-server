import express from "express";

import { addTask, deleteTask, getTasks, updateTask } from "../controllers/taskController";
import isLoggedIn from "../middlewares/isLoggedIn";

const taskRouter = express.Router();
taskRouter.use(isLoggedIn);

taskRouter.get("/", getTasks);
taskRouter.post("/add", addTask);
taskRouter.patch("/:_id", updateTask);
taskRouter.delete("/:_id", deleteTask);

export default taskRouter;
