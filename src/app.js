import express from "express"
import healtRouter from "./routes/healthcheck.routes.js"
import userRouter from "./routes/user.routes.js"
import cookieParser from "cookie-parser"
import cors from "cors"




const app=express();

app.use(
    cors({
        origin:[process.env.DASHBOARD_URL],
        methods:["GET","POST","DELETE","PUT"],
        credentials:true
    })
)


app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use("/api/v1/healthcheck",healtRouter)
app.use("/api/v1/user",userRouter)




export default app;








