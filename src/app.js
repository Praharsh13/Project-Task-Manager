import express from "express"
import healtRouter from "./routes/healthcheck.routes"




const app=express();

app.use("/api/v1/healthcheck",healtRouter)




export default app;








