import express from "express"
import mongoose from "mongoose"

import userRouter from "./routes/userRouter.js"
import jwt from "jsonwebtoken"
import productRouter from "./routes/productRouter.js"

const mongoURI = "mongodb+srv://admin:1234@cluster0.we2run1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"


// database
mongoose.connect(mongoURI).then(
    ()=>{
        console.log("connect to mongoDB Cluster")
    }
)


const app = express()

// middleware
app.use(express.json())




app.use((req,res,next)=>{

    const authorizationHeader = req.header("Authorization")

    if(authorizationHeader != null){


        const token = authorizationHeader.replace("Bearer ", "")

        console.log(token)

        jwt.verify(token, "secretkey95@2025", 
            (error, content)=>{
                
                if(content ==null){

                    console.log("invalid token")

                    res.json({
                        message: "invalid token"
                    })

                    

                }else{
                   
                    req.user = content

                    next()
                }
            }
        )


    }else{
        
        next()

    }
    
    

})
    

// routes
app.use("/users",userRouter)
app.use("/products",productRouter)


// server
app.listen(5000 ,
    ()=>{
        console.log("server is running")
    }
 )