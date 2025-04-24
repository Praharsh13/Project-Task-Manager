import ApiResponse from "./api-response.js"

const generateToken=(res,user,statuscode,message)=>{

    const token=user.generateAccessToken()
    res.status(statuscode).cookie("token",token,{
        expires:new Date(Date.now()+2*24*60*60*1000),
        httpOnly:true
    }).json(new ApiResponse(statuscode,{message:message},user))
}

export {generateToken}