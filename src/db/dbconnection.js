import mongoose from "mongoose";


const dbConnect=async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URL)
        console.log("MongoDB connected")
    }
    catch(error){
        console.log("Error in connecting MongoDB",error)
        process.exit(1)
    }
}

export default dbConnect