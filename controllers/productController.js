import Product from "../models/Product.js";
import { isAdmin } from "./userController.js";

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
        console.log(products)
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