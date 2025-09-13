// models/User.js
import mongoose from "mongoose";

// schema
const userSchema = new mongoose.Schema(
    {
        email : {
            type : String,
            required : true,
            unique : true
        },
        firstName : {
            type : String,
            required : true
        },
        lastName : {
            type : String,
            requred : true
        },
        password : {
            type : String,
            requied : true
        },
        role :{
            type : String,
            default : "customer"
        },
        isBlocked :{
            type : Boolean,
            default : false
        },
        isEmailVerified :{
            type : Boolean,
            default : false
        },
        image :{
            type : String,
            requred : true,
            default : "/default.jpg"
        }
    }
)

// model
const User = mongoose.model("User", userSchema)

// export
export default User;