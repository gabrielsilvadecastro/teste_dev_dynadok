import { Router } from "express";
import { createTask, getTaskById, removeTask, listTasks} from "../controllers/tasksController";

const router = Router();

router.get("/", (req, res) => {
    res.send({"message":"API is Running"});
  });  

router.post("/tasks", createTask);

router.get("/tasks/:id", getTaskById);

router.delete("/tasks/:id", removeTask);

router.get("/tasks", listTasks);

export default router;
