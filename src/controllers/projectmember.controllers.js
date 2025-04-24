import { asyncHandler } from "../utils/async-handler.js";
import { ProjectMember } from "../models/projectmember.models.js";
import { User } from "../models/user.models.js";
import { Project } from "../models/project.models.js";
import ApiErrors from "../utils/api-error.js";
import { UserRoleEnum } from "../utils/constant.js";
import ApiResponse from "../utils/api-response.js";
/**
 * @description Add project member 
 * @body Add email and role - both string
 * @param ProjectId- {string}
 */

const addProjectMember=asyncHandler(async(req,res,next)=>{
    const {email,role}=req.body
    const{projectId}=req.params

   

    const user=await User.findOne({email})

    const project=await Project.findById(projectId)
    console.log(  project)

    if(!user || !project){
        throw new ApiErrors(400,"Either user or project is not available")
    }

    const projectMember= await ProjectMember.create({
        user,
        project,
        role:role || UserRoleEnum.Member
    })

    res.status(200).json(new ApiResponse(200,{message:"member created successfully"},projectMember))
})

export {addProjectMember}