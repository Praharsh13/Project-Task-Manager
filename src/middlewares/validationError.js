import { validationResult } from "express-validator";
import ApiErrors from "../utils/api-error.js";


export const validate=(req,res,next)=>{
    const errors=validationResult(req)

    if(errors.isEmpty()){
        return next()
    }

    const extractedError=[]

    errors.array().map((err)=>{
        extractedError.push({
            [err.path]:err.msg
        })
    })

    res.status(400).json(new ApiErrors(422,"Received data is not valid",extractedError))
}
