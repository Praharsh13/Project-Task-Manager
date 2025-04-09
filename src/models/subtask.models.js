import mongoose, {Schema} from "mongoose"

const subtaskSchema=new Schema({
    title:{
        type:String,
        required:true,
        trim:true
    },
    createdBy:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    isCompleted:{
        type:Boolean,
        default:false
    },
    task:{
        type:Schema.Types.ObjectId,
        ref:"Task",
        required:true
    }
},{timestamps:true})

export const SubTask=mongoose.model("SubTask",subtaskSchema)