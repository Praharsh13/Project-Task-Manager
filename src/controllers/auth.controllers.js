import { asyncHandler } from "../utils/async-handler.js";
import { User } from "../models/user.models.js";
import ApiErrors from "../utils/api-error.js";
import { sendEmail ,emailVerificationMailContent,forgotpasswordMailContent} from "../utils/mail.js";
import ApiResponse from "../utils/api-response.js";

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
    const {unhashedToken,hashedToken, tokenExpiry}= await user.generateTemporaryToken;
    user.emailVerificationExpiry=hashedToken
    user.emailVerificationToken=tokenExpiry
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



export {registerUser}