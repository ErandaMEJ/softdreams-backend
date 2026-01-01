import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        rating: {
            type: Number,
            required: true,
        },
        comment: {
            type: String,
            required: true,
        },
        isApproved: {
            type: Boolean,
            default: false,
        },

    },
    { timestamps: true }
);

const productSchema = new mongoose.Schema(
    {
        productID : {
            type : String,
            required : true,
            unique : true
        },
        name : {
            type : String,
            required : true
        },
        altNames : {
            type : [String],
            default : []
        },
        description : {
            type : String,
            required : true
        },
        price : {
            type : Number,
            required : true
        },
        labelledPrice : {
            type : Number,
            required : true
        },
        images : {
            type : [String],
            required : true
        },
        category : {
            type : String,
            required : true        
        },        
        model : {
            type : String,
            required : true,
            default : "Standard"
        },
        brand : {
            type : String,
            required : true,
            default : "Generic"
        },
        stock : {
            type : Number,
            required : true,
            default : 0
        },
        isAvailable : {
            type : Boolean,
            required : true,
        },
        // ⭐ Reviews + rating fields
        reviews: [reviewSchema],
        rating: {
            type: Number,
            required: true,
            default: 0,
        },
        numReviews: {
            type: Number,
            required: true,
            default: 0,
        },
    },
    { timestamps: true }
)
const Product = mongoose.model("Product", productSchema)

export default Product;