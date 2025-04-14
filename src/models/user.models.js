import mongoose ,{Schema} from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import crypto from "crypto"


const userSchema=new Schema({
    avatar:{
        type:{
            url:String,
            localpath:String
        },
        default:{
            url:`https://placehold.co/600x400`,
            localpath:""
        }
    },
    username:{
        type:String,
        required:true,
        lowercase:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true
    },
   
    password:{
        type:String,
        required:[true,"password is required"]
    },
    isEmailVerified:{
        type:Boolean,
        default:false
    },
    forgotPasswordToken:{
        type:String
    },
    forgotPasswordExpiry:{
        type:Date
    },
    refreshRoken:{
        type:String
    } ,
    emailVerificationToken:{
        type:String
    }  ,
    emailVerificationExpiry:{
        type:Date
    }


},{timestamps:true})

//to hash before save the password
userSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        return next()
    }else{
        this.password=await bcrypt.hash(this.password,10);
        next()
    }
})

//making function in schema to check the password

userSchema.methods.isPasswordCorrect=async function(password){
  return bcrypt.compare(password,this.password)
}

//Generate access token

userSchema.methods.generateAccessToken= function(){
    return jwt.sign({
        _id:this._id,
        email:this.email,
        username:this.username
    },
    process.env.ACCESS_TOKEN_SECRET,
    {expiresIn:process.env.ACCESS_TOKEN_EXP}
    )
}

userSchema.methods.generateRefreshToken= function(){
    return jwt.sign({
        _id:this._id,
       
    },
    process.env.REFRESH_TOKEN_SECRET,
    {expiresIn:process.env.REFRESH_TOKEN_EXP}
    )
}

userSchema.methods.generateTemporaryToken=function(){
    const unhashedToken=crypto.randomBytes(20).toString("hex")
    const hashedToken=crypto.createHash("sha256").update(unhashedToken).digest("hex")
    const tokenExpiry=Date.now()+(20*60*1000)
    return {unhashedToken,hashedToken,tokenExpiry}
}



export const User=mongoose.model("User",userSchema)