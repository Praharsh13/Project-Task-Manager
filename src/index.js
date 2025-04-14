import app from "./app.js";
import dotenv from "dotenv"
import dbConnect from "./db/dbconnection.js";



//Configure the .env file path
dotenv.config({
    path:"./.env"
})



const PORT=process.env.PORT || 8000

//DB connection with server
dbConnect()
.then(()=>{
    app.listen(PORT,()=>console.log(`Server is running on the port ${PORT}`))
})
.catch((error)=>{
    console.log("MongoDB connection error",error)
    process.exit(1)
})