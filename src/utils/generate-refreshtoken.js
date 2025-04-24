import ApiResponse from "./api-response.js";

const generateRefreshTokens=(res,user)=>{
    const refreshToken=user.generateRefreshToken()
    res.cookie("refreshToken",refreshToken,{
        expires:new Date(Date.now()+7*24*60*60*1000),
        httpOnly:true
    })

    return refreshToken
}

export {generateRefreshTokens}