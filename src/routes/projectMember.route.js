import { Router } from "express";
import { addProjectMember } from "../controllers/projectmember.controllers.js";

const router=Router()


router.route("/addprojectmember/:projectId").post(addProjectMember)

export default router