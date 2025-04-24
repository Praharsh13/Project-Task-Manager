import mongoose from "mongoose"
import { asyncHandler } from "../utils/async-handler.js"
import ApiErrors from "../utils/api-error.js"
import { ProjectMember } from "../models/projectmember.models.js"
import { UserRoleEnum } from "../utils/constant.js"

/**
 * @description Middleware to check if user is admin or not
 * @param {string} projectId - id of project
 */



const isAdmintrue=async(req,res,next)=>{

    const {projectId} = req.params
    console.log(projectId)
    const id=req.user._id
    console.log(id)

    if(!mongoose.Types.ObjectId.isValid(projectId)){
        throw new ApiErrors(400, "Not a valid request")
    }
    const projectObjectId = new mongoose.Types.ObjectId(projectId);
    const member=await ProjectMember.findOne({
        project:projectObjectId,
        user:id
    }).lean()

    console.log(member)

    if(member && member.role==UserRoleEnum.Admin){
        return next()
    }
    else{
        throw new ApiErrors(400,"You dont have proper authorisation")
    }

}

export {isAdmintrue}