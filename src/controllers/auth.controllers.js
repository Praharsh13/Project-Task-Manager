import { asyncHandler } from "../utils/async-handler.js";
import { User } from "../models/user.models.js";
import ApiErrors from "../utils/api-error.js";
import { sendEmail ,emailVerificationMailContent,forgotpasswordMailContent} from "../utils/mail.js";
import ApiResponse from "../utils/api-response.js";
import crypto from "crypto"
import { generateToken } from "../utils/generate-token.js";

//Register the user
const registerUser= asyncHandler(async (req,res,next)=>{
    const{email, password,username}=req.body
    console.log(email)

    //to check for file 
    let filepath=""
    if(req.file){
         filepath=req.file.path
    }
    //Check if email is alraedy exist
    if (await User.findOne({ email })) {
        throw new ApiErrors(400, "User already exists");
      }
      

    //save the user to database
    const user=await User.create({
        email,
        password,
        username,
        avatar:{
            localpath:filepath
        }    

    })

    if(!user){
        return new ApiErrors(400,"User not registered successfully")
    }
    //
    const {unhashedToken,hashedToken, tokenExpiry}= await user.generateTemporaryToken();
    user.emailVerificationToken=hashedToken
    user.emailVerificationExpiry=tokenExpiry
    await user.save()

    const emailVerificationLink=`process.env.BASE_URL/api/v1/user/verifyemail/${unhashedToken}`
    
    const mailoptions={
        email: user.email,
        subject:"Verify your email",
        mailgenContext:emailVerificationMailContent(user.username,emailVerificationLink)


    }

    sendEmail(mailoptions)
    res.status(200).json(new ApiResponse(200,{message:"User registered successfully"},user) )



})

//To verify the mail of user

const verifyEmail=asyncHandler(async(req,res,next)=>{
    const unhashedToken=req.params.id
    console.log(unhashedToken)
    const emailVerificationToken=crypto.createHash("sha256").update(unhashedToken).digest("hex")
    const user=await User.findOne({emailVerificationToken
                         
                                      })
    if(!user){
        res.status(400).json(new ApiErrors(400,{message:"Invalid token , user not found. Please login again"}))
    }
    if(user.emailVerificationExpiry< Date.now()){
        res.status(400).json(new ApiErrors(400,{message:"Token expired please send token again"}))
    }
    user.isEmailVerified=true
    user.emailVerificationToken=undefined
    user.emailVerificationExpiry=undefined
    res.status(200).json(new ApiResponse(200,{message:"User registered successfully"},user))
})

//Resend verification mail
//1. Generate token again
//2. send the mail again
//3. Update token to user again

const resendEmailVerification=asyncHandler(async(req,res,next)=>{
    const {email}=req.body
    if(!email){
        res.status(400).json(ApiErrors(400,{message:"Email is required"}))
    }
    const user=await User.findOne({email})
    if(!user){
        res.status(400).json(ApiErrors(400,{message:"User not found, Please check the mail or register with us"}))
    }

    if(user.isEmailVerified){
        res.status(400).json(ApiErrors(400,{message:`${user.username} is alraedy verified. Please login to continue`}))
    }

    const {unhashedToken,hashedToken,tokenExpiry}=user.generateTemporaryToken()
    const url=`http://localhost:8000/api/v1/user/verifymail/${unhashedToken}`
    user.emailVerificationToken=hashedToken
    user.emailVerificationExpiry=tokenExpiry
    await user.save()

    const mailoptions={
        email: user.email,
        subject:"Verify your email ",
        mailgenContext:emailVerificationMailContent(user.username,url)


    }
    sendEmail(mailoptions)

    res.status(200).json(ApiResponse(200,{message:"Verifivation mail sent again successgully"},user))

})

//Login of user

const login=asyncHandler(async(req,res,next)=>{
    const {email,password}=req.body
    const user=await User.findOne({email})
    if(!user){
        res.status(400).json(ApiErrors(400,{message:"User not exist , Please register"}))
    }
   const check= await user.isPasswordCorrect(password);
   if(check==false){
    res.status(400).json(ApiErrors(400,{message:"Incorrect password"}))
   }

   const refreshToken=user.generateRefreshToken()
   user.refreshToken=refreshToken
   await user.save()
   generateToken()


})

const logout=asyncHandler(async(req,res,next)=>{
    res.status(200).cookie("token","",{
        expires:new Date(Date.now),
        httpOnly:true
    }).json(new ApiResponse(200,{message:"logout successfully"}))
})


//Forgot password 
const forgotPassword=asyncHandler(async(req,res,next)=>{
    const {email}=req.body
    if(!email){
        res.status(400).json(new ApiErrors(400,{message:"Please provide the email"}))
    }
    const user=await User.findOne({email})
    if(!user){
        res.status(400).json(new ApiErrors(400,{message:"User not found , please register to our site"}))
    }

    const {unhashedToken,hashedToken,tokenExpiry}=user.generateTemporaryToken()
    const resetTokenUrl=`process.env.BASE_URL/api/v1/user/resetpassword/${unhashedToken}`
    user.forgotPasswordToken=hashedToken
    user.forgotPasswordExpiry=tokenExpiry
    await user.save()

    const mailoptions={
        email:user.email,
        subject:"Reset your password",
        mailgenContext:forgotpasswordMailContent(user.username,resetTokenUrl)
    }

    sendEmail(mailoptions)
    res.status(200).json(new ApiResponse(200,{message:"Verification mail sent successfully"},user))
    
})

//Reset password controller
const resetPassword=asyncHandler(async(req,res,next)=>{
    const {id}=req.params
    const hashtoken=crypto.createHash("sha256").update(id).digest("hex");
    const user= await User.findOne({forgotPasswordExpiry:hashtoken,
        forgotPasswordExpiry:{$gt:Date.now()}
    })
    if(!user){
        res.staus(400).json(new ApiErrors(400,{message:"Not able to find user"}))
    }

    if(req.body.password!=req.body.confirmPassword){
        res.status(400).json(new ApiErrors(400,{message:"Password dont match"}))
    }
    user.password=req.body.password
    user.forgotPasswordExpiry=undefined
    user.forgotPasswordToken=undefined
    user.save()
    res.status(200).json(new ApiResponse(200,{message:"Password updated successfully"},user))

})
//update password and user
const updateUser=asyncHandler(async(req,res,next)=>{
    if(req.body.password!=req.body.confirmPassword){
        res.status(400).json(ApiResponse(400),{message:"Password does not match"})
    }
    const newdetail={
        username:req.body.username,
        email:req.body.email,
        password:req.body.password
    }
    const newfile=""
    if(req.files){
        newfile=req.files.path

    }
    newdetail.avatar.localpath=newfile

    const user=await User.findByIdAndUpdate(req.user.id,newdetail,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    })
    res.status(200).json(200,{message:"User updated successfully"},user)
})
//get user
const getUser=asyncHandler(async(req,res,error)=>{
    const id=req.user.id
    const user=await User.findById({id})
    res.status(200).json(ApiResponse(200,{message:"User Details"},user))
})

const generateAccessToken=asyncHandler(async(req,res,next)=>{
    const user =req.user

    

})
export {
    registerUser,
    verifyEmail,
    resendEmailVerification,
    login,
    logout,forgotPassword,resetPassword,updateUser,getUser}