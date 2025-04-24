import {Router}from 'express'
import { addprojectMember, createProject, deleteProject, getAllmember, getProject, getProjectById, modifyRole, removeMember, updateProject } from '../controllers/project.controllers.js'
import { authUser } from '../middlewares/authmiddleware.js'
import { projectadd } from '../validators/index.js'
import { validate } from '../middlewares/validationError.js'
import { isAdmintrue } from '../middlewares/isAdmin.js'



const router=Router()

router.route("/addproject").post(projectadd(),validate,authUser,createProject)
router.route("/delete/:projectId").delete(authUser,isAdmintrue,deleteProject)
router.route("/update/:projectId").post(authUser,isAdmintrue,updateProject)
router.route("/getproject").get(authUser,getProject)
router.route("/getspecificproject/:projectId").get(getProjectById)
router.route("/addmember/:projectId").post(authUser,isAdmintrue,addprojectMember)
router.route("/deletemember/:projectId/:memberId").delete(authUser,isAdmintrue,removeMember)
router.route("/getallmember/:projectId").get(getAllmember)
router.route("/modifymemeberrole/:projectId/:memberId").post(authUser,modifyRole)



export default router;