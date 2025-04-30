import { Router } from "express";

import { authUser } from "../middlewares/authmiddleware.js";
import { isAdmintrue } from "../middlewares/isAdmin.js";
import { createTask, deleteTask, updateTask } from "../controllers/task.controllers.js";


const router=Router()

router.route("/addtask/:projectId").post(authUser,isAdmintrue,createTask)
router.route("/updatetask/:taskId").put(authUser,isAdmintrue,updateTask)
router.route("/deletetask/:taskId").delete(authUser,isAdmintrue,deleteTask)

export default router