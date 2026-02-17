import express from "express"
import mongoose from "mongoose"
import userRouter from "./routes/userRouter.js"
import jwt from "jsonwebtoken"
import productRouter from "./routes/productRouter.js"
import cors from "cors"
import dotenv from "dotenv"
import orderRouter from "./routes/orderRouter.js"




dotenv.config()



const mongoURI = process.env.MONGO_URI


// database
mongoose.connect(mongoURI).then(
    () => {
        console.log("connect to mongoDB Cluster")
    }
)


const app = express()

app.use(cors())

// middleware
app.use(express.json())




app.use((req, res, next) => {

    const authorizationHeader = req.header("Authorization")

    if (authorizationHeader != null) {


        const token = authorizationHeader.replace("Bearer ", "")



        jwt.verify(token, process.env.JWT_SECRET,
            (error, content) => {

                if (content == null) {



                    res.status(401).json({
                        message: "invalid token"
                    })



                } else {

                    req.user = content

                    next()
                }
            }
        )


    } else {

        next()

    }



})

// Health Check Route
app.get('/ping', (req, res) => {
    res.send('Pong! Server is awake.');
});


// routes
app.use("/api/users", userRouter)
app.use("/api/products", productRouter)
app.use("/api/orders", orderRouter)

// server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});