import { Task } from "../models/task.models.js";
import ApiErrors from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import { Project } from "../models/project.models.js";
import { ProjectMember } from "../models/projectmember.models.js";
import { AvailableTaskStatus } from "../utils/constant.js";
import ApiResponse from "../utils/api-response.js";



/**
 * @description Create the task for project
 * @params {string}  projectId
 * @body - title,body,files,assinged to 
 */

const createTask=asyncHandler(async(req,res,next)=>{
    const {projectId}=req.params
    console.log(projectId)
    const {title,description,assignedTo,status,url}=req.body
    // const user=req.user._id
    // const filepath=""
    // if(req.file ){
    //     filepath=req.file.path
    // }
    if(!mongoose.Types.ObjectId.isValid(projectId)){
        throw new ApiErrors(400,"Not avalid project id")
    }

    //find project
    const project=await Project.findOne({_id:projectId}).select("_id").lean()
    if(!project){
        throw new ApiErrors(400,"Project not found")
    }

    const creater=await ProjectMember.findOne(
        {project:projectId,
         user:user   
         })

    if(!creater){
        throw new ApiErrors(400,"Member is not exist in the project")
    }  
    
    const taskAssigned=await ProjectMember.findOne({
        project:projectId,
        user:assignedTo

    })

    if(!taskAssigned){
        throw new ApiErrors(400,"The member is not a project member")
    }

    if(status && !AvailableTaskStatus.includes(status)){
        throw new ApiErrors(400,"Please select the corret status")
    }


    const task=await Task.create({
        title,
        description,
        project:projectId,
        assingedBy:req.user._id,
        assignedTo:taskAssigned._id,
        status,
        attachment:[{url}]
    })

    const createdTask=await Task.findById(task._id)
    .populate({path:"assignedTo", select:"username email"})
    .populate({path:"assignedBy" , select:"username email"})
    .populate({path:"project" , select:"name"})


    res.status(201).json(new ApiResponse(201,{message:"Task is created"},createdTask))

})


/**
 * @description update the task
 * @params taskId - id of the task
 * @body - title, description,status, assignedTo
 * @route - PUT
 */

const updateTask= asyncHandler(async(req,res,next)=>{
    const {taskId}= req.params
    const {title,description,status,assignedTo,url}=req.body
    if(!mongoose.Types.ObjectId.isValid(taskId)){
        throw new ApiErrors(400,"Not a invalid task id")
    }

    if(status && !AvailableTaskStatus.includes(status.toLowerCase())){
        throw new ApiErrors(400,"please choose the correct status")
    }

    const task=await Task.findById({_id:taskId})
    if(!task){
        throw new ApiErrors(400,"please provide the correct task")
    }

    const member=await ProjectMember.findOne({user:assignedTo, project:task.project})
    if(!member){
        throw new ApiErrors(400, "this user is not the part of this project")
    }

    const newTaskDetailes={
        title,
        description,
        status,
        assignedTo,
        attachment:[{url}]
    }

    const newTask=await Task.findByIdAndUpdate(
        taskId,
        {$set:newTaskDetailes},
        {new:true, runValidators:true}
    )
    .populate({path:"assignedTo", select:"username email"})
    .populate({path:"assignedBy", select:"username email"})
    .populate({path:"project", select:"name"})
    .lean()

    res.status(201).json(new ApiResponse(201,{message:"Details updated succesfully"},newTask))


})

/**
 * @description delete the task
 * @params {string}- task id
 * @route delete
 */
const deleteTask= asyncHandler(async(req,res,next)=>{
    const {taskId}= req.params

    if(!mongoose.Types.ObjectId.isValid(taskId)){
        throw new ApiErrors(400,"No valid task Id is found")
    }

    const task= await Task.findByIdAndDelete({_id:taskId})

    if(mongoose.models.SubTask){
        await mongoose.models.SubTask.deleteMany({task:taskId})
    }


    res.status(200).json(new ApiResponse(200,{message:"Task and subtask deleted successfully"}, task))

})



export {
    createTask,
    updateTask,
    deleteTask
}