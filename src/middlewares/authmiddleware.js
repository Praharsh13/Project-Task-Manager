import { User } from "../models/user.models.js";
import jwt from "jsonwebtoken"
import { asyncHandler } from "../utils/async-handler.js";
import ApiErrors from "../utils/api-error.js";


const authUser= async(req,res,next)=>{

    const {token}=req.cookies

    if(!token){
         return res.status(400).json(new ApiErrors(400,{message:"User is not authenticated"}))

    }


    const decoded= jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
    console.log(`decoded is${decoded._id}`)
    req.user= await User.findById(decoded._id)
    next();


}
export {authUser}