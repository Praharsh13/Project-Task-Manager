import { asyncHandler } from "../utils/async-handler.js";
import { Project } from "../models/project.models.js";
import ApiResponse from "../utils/api-response.js";
import ApiErrors from "../utils/api-error.js";
import { ProjectMember } from "../models/projectmember.models.js";
import { AvailableUserRole, UserRoleEnum } from "../utils/constant.js";
import mongoose from "mongoose";
import { User } from "../models/user.models.js";




//Controller for creating project
const createProject= asyncHandler(async(req,res,next)=>{
    const {name,description}=req.body
    const repeatname=await Project.findOne({name})
    if(repeatname){
        throw new ApiErrors(400,"name already exist in database")
    }

    const createdBy=req.user._id
    const project= await Project.create({
        name,
        description,
        createdBy
    })

    //Check if that is a member of project therwise add
    
    
       const newMember=await ProjectMember.create({
            project:project._id,
            user:req.user._id,
            role:UserRoleEnum.Admin
        })
    

    res.status(201).json(new ApiResponse(201,{message:"Project created succesfully"},project))


})


/**
 * @description Delete the particular project
 * @param projectID - {string}- id of the project
 * @access - private only admin
 */

const deleteProject=asyncHandler(async (req,res,next)=>{
    const {projectId}=req.params
    if(!mongoose.Types.ObjectId.isValid(projectId)){
        throw new ApiErrors(400,"ProjectId is not valid")
    }
    
    const project= await Project.findByIdAndDelete(projectId)
    res.status(200).json(new ApiResponse(200,{message:"Project deleted successsfully"}),project)
})


/**
 * @description Update the project
 * @param {string} projectId - id of the project
 * @body {string} name, description- request body
 * @access Private only - Admin
 */
const updateProject=asyncHandler(async(req,res,next)=>{
    const newDetail={
        name:req.body.name,
        description:req.body.description
    }

    const {projectId}=req.params
    if(!mongoose.Types.ObjectId.isValid(projectId)){
        throw new ApiErrors(400,"Invalid project Id")
    }

    const project=await Project.findByIdAndUpdate(projectId,newDetail,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    })

    if(!project){
        throw new ApiErrors(400, "Not able to find the project")
    }

    res.status(200).json(new ApiResponse(200,{message:"Project detail is updated"},project))

})

/**
 * @description get all the projects where user is created or member
 * @access private
 * @route Get
 */

const getProject=asyncHandler(async(req,res,next)=>{
    const userofProject=await ProjectMember.find({user:req.user._id}).select("project")
    const memberprojectId= userofProject.map(member=>member.project)
    const project=await Project.find({
        $or:[
            {createdBy:req.user._id},
            {_id:{$in:memberprojectId}}
        ]
    })
    if(!project){
        res.status(200).json(new ApiResponse(200,{message:"No project found here"}))

    }
    res.status(200).json(new ApiResponse(200,{message:"All projects are here"},project))

})

/**
 * @description get single project by id 
 * @param -{string} - projectid
 * @route get
 */

const getProjectById=asyncHandler(async (req,res,next)=>{
    const {projectId}=req.params
    if(!mongoose.Types.ObjectId.isValid(projectId)){
        throw ApiErrors(400, "not a valid projectid")
    }

    const project=await Project.findOne({_id:projectId}).populate("createdBy" , "username email")
    console.log(project, projectId)

    res.status(200).json(new ApiResponse(200,{Message:"Project Detail"},project))
})

/**
 * @description add project member to the project
 * @body get email of the member
 * @param -{string}-projectId- id of the project
 * @access private only admin can
 */
const addprojectMember=asyncHandler(async(req,res,next)=>{
    const {projectId}=req.params
    const {email,role}=req.body

    if(!mongoose.Types.ObjectId.isValid(projectId)){
        throw new ApiErrors(400,"Invalid projectId")
    }

    if(!email){
        throw new ApiErrors(400,"Email is required")
    }

    const user=await User.findOne({email}).select("_id")
    if(!user){
        throw new ApiErrors(400,"Email is not valid")
    }
    const memberrole=role?role.toLowerCase():UserRoleEnum.Member
    if(role && !AvailableUserRole.includes(memberrole)){
        throw new ApiErrors(400, `Invalid role , select role from ${AvailableUserRole.join(",")}`)
    }

    const project= await Project.findOne({_id:projectId})
    if(!project){
        throw new ApiErrors(400, "Project not found")
    }
    const existingprojectMember=await ProjectMember.findOne({
        project:projectId,
        user:user._id
    }).select("role").lean()

    if(existingprojectMember){
        throw new ApiErrors(400,`Project member is already exist with role ${existingprojectMember.role}`)
    }

    const newMember=await ProjectMember.create({
        project:projectId,
        user:user._id,
        role:memberrole
    })

    await newMember.populate([{path:"user", select:"fullname email"},
    {path:"project",select:"name"}])

    res.status(201).json(new ApiResponse(201,{message:"Member added successfully"},newMember))
})

/**
 * @desription Delete member from the project 
 * @param {string} - projectId - id of the project
 * @param {string} - memberid
 */

const removeMember=asyncHandler(async(req,res,next)=>{
    const {projectId, memberId}=req.params
    if(!mongoose.Types.ObjectId.isValid(projectId)|| !mongoose.Types.ObjectId.isValid(memberId)){
        throw new ApiErrors(400, "Invalid project id or member id")


    }

    const member=await ProjectMember.findOne({
        project:projectId,
        _id:memberId
    })

    if(!member){
        new ApiErrors(400,"Project member is not found")
    }
    console.log(member.role)

    if(member.role==admin){
        new ApiErrors(400,'${member.user.username} is Admin, cannot be removed')
    }
    await member.deleteOne()

    res.status(201).json(new ApiResponse(201,{message:"Member deleted"},member))
})

/**
 * @description Get all member of the project
 */

const getAllmember=asyncHandler(async(req,res,next)=>{
    const {projectId}= req.params

    const members= await ProjectMember.find({
        project:projectId

    }).populate([
    {path:"user",select:"fullname email"}])

    if(!members){
        res.status(200).json(new ApiResponse(200,{message:"No member exist"}))

    }

    res.status(200).json(new ApiResponse(200,{message:"All members"},members))


})

/**
 * @description Modify role 
 * @param {string}- projectId - id of the project
 * @param {string} - memberId - id of the memner
 */

const modifyRole=asyncHandler(async(req,res,next)=>{
    const {projectId,memberId}=req.params
    if(!mongoose.Types.ObjectId.isValid(projectId)|| !mongoose.Types.ObjectId.isValid(memberId)){
        throw new ApiErrors(400, "ProjectId or memberid is invalid")
    }
    const{role}=req.body

    const roleofmember=await ProjectMember.findOne({
        _id:memberId,
        project:projectId

    })

    if(!roleofmember){
        throw new ApiErrors(400, "member nit found")
    }

    if(!role || !AvailableUserRole.includes(role)){
        throw new ApiErrors(400,"Please specify role and the correct role")
    }

    roleofmember.role=role.toLowerCase()

    await roleofmember.save()

    res.status(201).json(new ApiResponse(201,{message:"Role updated successfully"},roleofmember))


})



export {
    createProject,
    deleteProject,
    updateProject,
    getProject,
    getProjectById,
    addprojectMember,
    removeMember,
    getAllmember,
    modifyRole
}