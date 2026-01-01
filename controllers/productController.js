import Product from "../models/Product.js";
import { isAdmin } from "./userController.js";

// ⭐ Approved reviews and rating recalculation helper
function recalculateRating(product) {
  const approved = product.reviews.filter((r) => r.isApproved);

  if (approved.length === 0) {
    product.rating = 0;
    product.numReviews = 0;
  } else {
    product.numReviews = approved.length;
    product.rating =
      approved.reduce((sum, r) => sum + r.rating, 0) / approved.length;
  }
}

export function createProduct(req,res){
    
   if(!isAdmin(req)){
       res.status(403).json({
           message : "Forbidden"
       })
       return
   }

    const product = new Product(req.body)

    product.save().then(
        ()=>{
            res.json({
                message : "Product Created Successfully"
            })
        }
    ).catch(
        (error)=>{
            res.status(500).json({
                message : "Error Creating Product",
                error : error.message
            })
        }
    )
}

export async function getAllProducts(req,res){

    try{

        if(isAdmin(req)){

       // Product.find().then(
        //    (products)=>{
        //        res.json(products)
        //    }
        //).catch(
        //    (error)=>{
        //        res.status(500).json({
        //            message : "Error Fetching Products",
        //            error : error.message
        //        })
        //    }
        //)
        const products = await Product.find()
        
        res.json(products)

    }else{
        Product.find({isAvailable : true}).then(
            (products)=>{
                res.json(products)
            }
        ).catch(
            (error)=>{
                res.status(500).json({
                    message : "Error Fetching Products",
                    error : error.message
                });
            }
            );
        }

    } catch(error){
        res.status(500).json({
            message : "Error Fetching Products",
            error : error,
        });
    }
}  

export async function addReview(req,res){
    try{
        const productID = req.params.productID;
        const { name, rating, comment } = req.body;

        if (!name || !rating || !comment) {
            return res.status(400).json({ message: "All fields are required" });
        }
        //product search
        const product =  await Product.findOne({ productID });
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        const review = {
            name,
            rating : Number(rating),
            comment,
            isApproved : false
        };

        // review push
            product.reviews.push(review);

          
            await product.save();

            return res.status(201).json({
            message: "Review added successfully, pending approval",
            
            });
        } catch (error) {
            return res.status(500).json({
            message: "Error adding review",
            error: error.message,
            });
        }
        }
        export async function getReviewsAdmin(req,res){
            if (!isAdmin(req)) {
                return res.status(403).json({ message: "Only admin can view all reviews" });
            }
            try {
                const productID = req.params.productID;
                const product = await Product.findOne({ productID });

                if (!product) {
                    return res.status(404).json({ message: "Product not found" });
                }

                return res.json(product.reviews);
            } catch (error) {
                return res.status(500).json({
                    message: "Error fetching reviews",
                    error: error.message,
                });
            }
        }
        export async function approveReview(req,res){
            if (!isAdmin(req)) {
                return res.status(403).json({ message: "Only admin can approve reviews" });
            }
            try {
                const { productID, reviewID } = req.params;
                const product = await Product.findOne({ productID });

                if (!product) {
                    return res.status(404).json({ message: "Product not found" });
                }

                const review = product.reviews.id(reviewID);

                if (!review) {
                    return res.status(404).json({ message: "Review not found" });
                }

                review.isApproved = true;
                recalculateRating(product);

                await product.save();

                return res.json({
                    message: "Review approved successfully",
                    rating: product.rating,
                    numReviews: product.numReviews,
                });
            } catch (error) {
                return res.status(500).json({
                    message: "Error approving review",
                    error: error.message,
                });
            }
                };

                export async function deleteReview(req,res){
                    if (!isAdmin(req)) {
                        return res.status(403).json({ message: "Only admin can delete reviews" });
                    }
                    try {
                        const { productID, reviewID } = req.params;
                        const product = await Product.findOne({ productID });
        
                        if (!product) {
                            return res.status(404).json({ message: "Product not found" });
                        }
                        const review = product.reviews.id(reviewID);
        
                        if (!review) {
                            return res.status(404).json({ message: "Review not found" });
                        }

                        product.reviews.pull(reviewID);
                        recalculateRating(product);
        
                        await product.save();
        
                        return res.json({
                            message: "Review deleted successfully",
                            rating: product.rating,
                            numReviews: product.numReviews,
                        });
                    } catch (error) {
                        return res.status(500).json({
                            message: "Error deleting review",
                            error: error.message,
                        });
                    }
                }



export function deleteProduct(req,res){
    if(!isAdmin(req)){
        res.status(403).json({
            message : "Only Admin Can Delete Products"
        })
        return
    }

    const productID = req.params.productID

    Product.deleteOne({productID : productID}).then(
        ()=>{
            res.json({
                message : "Product Deleted Successfully"
            })
        }
    )
}

export function updateProduct(req,res){
    if(!isAdmin(req)){
        res.status(403).json({
            message : "Only Admin Can Update Products"
        })
        return;
    }

    const productID = req.params.productID

    Product.updateOne({productID : productID}, req.body).then(
        ()=>{
            res.json({
                message : "Product Updated Successfully"
            })
        }
    )
}

export function getProductByID(req,res){

    const productID =req.params.productID

    Product.findOne({productID : productID}).then(
        (product)=>{
            if(product == null){
                res.status(404).json({
                    message : "Product Not Found"
                })
            }
            else{
                if(product.isAvailable){
                     res.json(product)
                } else{
                    if(isAdmin(req)){
                        res.json(product)
                    }else{
                        res.status(404).json({
                            message : "Product Not Found"
                        })
                    }
                }
               
            }
        }
    ).catch(
        (error)=>{
            res.status(500).json({
                message : "Error Fetching Product",
                error : error.message
            })
        }
    )
}

export async function searchProducts(req,res){
	const query = req.params.query

	try {

		const products = await Product.find(
			{
				$or : [
					{ name : { $regex : query , $options : "i" } },
					{ altNames : { $elemMatch : { $regex : query , $options : "i" } } }
				],
				isAvailable : true
			}
		)

		return res.json(products)
	}catch(error){
		res.status(500).json({
			message : "Error searching products",
			error : error.message
		})
	}

}



// add try catch for async-await
