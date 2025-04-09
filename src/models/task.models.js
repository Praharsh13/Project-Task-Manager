import mongoose, {Schema} from "mongoose"
import { AvailableTaskStatus,TaskStatusEnum } from "../utils/constant"

const taskSchema=new Schema({
  title:{
    type:String,
    required:true,
    trim:true
  },
  description:{
    type:String
  },
  project:{
    type:Schema.Types.ObjectId,
    ref:"Project",
    required:true
  },
  assignedTo:{
    type:Schema.Types.ObjectId,
    ref:"User",
    required:true
  },
  assingedBy:{
    type:Schema.Types.ObjectId,
    ref:"User",
    required:true

    
  },
  status:{
    type:String,
    enum:AvailableTaskStatus,
    default:TaskStatusEnum.Todo
  },
  attachment:{
    type:[
        {
            url:String,
            mimetype:String,
            size:Number
        }
    ],
    default:[]
  }


},{timestamps:true})


export const Task=mongoose.model("Task",taskSchema)