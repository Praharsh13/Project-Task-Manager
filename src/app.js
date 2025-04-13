import express from "express"
import healtRouter from "./routes/healthcheck.routes.js"




const app=express();

app.use("/api/v1/healthcheck",healtRouter)
app.use("/api/v1/user",)




export default app;








