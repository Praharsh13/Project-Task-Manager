import { User } from "../models/user.models.js";
import jwt from "jsonwebtoken"
import { asyncHandler } from "../utils/async-handler.js";
import ApiErrors from "../utils/api-error.js";


const authUser= asyncHandler(async(req,res,next)=>{

    const {token}=req.cookie

    if(!token){
        res.status(400).json(new ApiErrors(400,{message:"User is not authenticated"}))
    }


    const decoded= jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
    req.user= await User.findById(decoded.id)
    next()


})
export {authUser}