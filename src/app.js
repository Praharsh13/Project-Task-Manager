import express from "express"
import healtRouter from "./routes/healthcheck.routes.js"
import userRouter from "./routes/user.routes.js"
import projectRouter from "./routes/project.routes.js"
import projectmemberRouter from "./routes/projectMember.route.js"
import taskRouter from "./routes/task.routes.js"
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
app.use("/api/v1/project",projectRouter)
app.use("/api/v1/projectmember",projectmemberRouter)
app.use("/api/v1/task",taskRouter)




export default app;








