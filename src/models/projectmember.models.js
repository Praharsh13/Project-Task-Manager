import mongoose,{Schema} from "mongoose"

import { AvailableUserRole,UserRoleEnum } from "../utils/constant"

const projectMemberSchema=new Schema({
    user:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    project:{
        type:Schema.Types.ObjectId,
        ref:"Project",
        required:true
    },
    role:{
        type:String,
        enum:AvailableUserRole,
        default:UserRoleEnum.Member
    }
},{timestamps:true})

export const ProjectMember=mongoose.model("ProjectMember",projectMemberSchema)