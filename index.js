import express from 'express'
import dotenv from 'dotenv'
dotenv.config()
import cors from "cors";


import contactRouter from "./routers/contactRouter.js"

const app = express();
const port = process.env.PORT

app.use(express.json());
app.use(cors())

app.use('/',contactRouter)

app.listen(port,()=>{
    console.log(`server running on port ${port}`)
})

