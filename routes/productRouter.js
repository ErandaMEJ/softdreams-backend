import express from "express"
import { addReview, approveReview, createProduct, deleteProduct, deleteReview, getAllProducts, getProductByID, getReviewsAdmin, searchProducts, updateProduct } from "../controllers/productController.js"


const productRouter = express.Router()

productRouter.get("/", getAllProducts)

productRouter.get("/trending", (req,res)=>{
    res.json(
        {message : "trending products endpoint"}
    )
})


productRouter.post("/", createProduct)

productRouter.get("/search/:query", searchProducts)

productRouter.get("/:productID", getProductByID)

productRouter.delete("/:productID", deleteProduct)

productRouter.put("/:productID", updateProduct)

productRouter.post("/:productID/reviews", addReview)

productRouter.get("/:productID/reviews/admin", getReviewsAdmin)

productRouter.patch("/:productID/reviews/:reviewID/approve", approveReview)

productRouter.delete("/:productID/reviews/:reviewID", deleteReview)

export default productRouter