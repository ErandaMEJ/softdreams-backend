import Order from "../models/order.js";
import Product from "../models/Product.js";
import { isAdmin } from "./userController.js";

export async function createOrder(req, res) {

    //ORD000001

    if (req.user == null) {
        res.status(401).json({
            message: "Unauthorized"
        });
        return;
    }


    try {
        const latestOrder = await Order.findOne().sort({ date: -1 });

        let orderId = "ORD000001";

        if (latestOrder != null) {

            let latestOrderId = latestOrder.orderId; // "ORD000012"
            let latestOrderNumberString = latestOrderId.replace("ORD", ""); // "000012"
            let latestOrderNumber = parseInt(latestOrderNumberString); // 12

            let newOrderNumber = latestOrderNumber + 1; //13
            let newOrderNumberString = newOrderNumber.toString().padStart(6, "0") // "000013"
            orderId = "ORD" + newOrderNumberString; // "ORD000013"
        }


        const items = []
        let total = 0

        for (let i = 0; i < req.body.items.length; i++) {

            const product = await Product.findOne({ productID: req.body.items[i].productID })

            if (product == null) {
                return res.status(400).json({
                    message: `product with ID ${req.body.items[i].productID} not found`
                })
            }

            //check if product is available
            if (product.stock < req.body.items[i].quantity) {
                return res.status(400).json({
                    message: `Only ${product.stock} items available for product ${product.name}`
                })
            }

            items.push({
                productID: product.productID,
                name: product.name,
                price: product.price,
                quantity: req.body.items[i].quantity,
                image: product.images[0]
            })


            total += product.price * req.body.items[i].quantity
        }


        let name = req.body.name
        if (name == null) {
            name = req.user.firstName + " " + req.user.lastName
        }


        const newOrder = new Order({
            orderId: orderId,
            email: req.user.email,
            name: name,
            address: req.body.address,
            total: total,
            items: items,
            phone: req.body.phone,

        })


        await newOrder.save()

        // Update stock
        for (let i = 0; i < req.body.items.length; i++) {
            await Product.updateOne(
                { productID: req.body.items[i].productID },
                { $inc: { stock: -req.body.items[i].quantity } }
            )
        }

        return res.json({
            message: "Order Placed Successfully",
            orderId: orderId
        })


    } catch (error) {
        return res.status(500).json({
            message: "Error Placing Order",
            error: error.message
        })
    }
}

export async function getOrders(req, res) {
    try {
        if (req.user == null) {
            res.status(401).json({
                message: "Unauthorized"
            });
            return;
        }

        if (isAdmin(req)) {
            const orders = await Order.find().sort({ date: -1 })
            res.json(orders)
        } else {
            const orders = await Order.find({ email: req.user.email }).sort({ date: -1 })
            res.json(orders)
        }
    } catch (error) {
        res.status(500).json({
            message: "Error fetching orders",
            error: error.message
        })
    }
}

export async function updateOrderStatus(req, res) {
    if (!isAdmin(req)) {
        return res.status(403).json({
            message: "Only admins can update order status"
        });
    }
    try {
        const orderId = req.params.orderId
        const status = req.body.status
        const notes = req.body.notes

        await Order.updateOne(
            { orderId: orderId },
            { status: status, notes: notes }
        )

        res.json({
            message: "Order Status Updated Successfully"
        })

    } catch (error) {
        res.status(500).json({
            message: "Error Updating Order Status",
            error: error.message
        })
    }
}

export async function deleteOrder(req, res) {
    // Only admins can delete orders
    if (!isAdmin(req)) {
        return res.status(403).json({
            message: "Only admins can delete orders"
        });
    }

    try {
        const { orderId } = req.params;

        const deletedOrder = await Order.findOneAndDelete({ orderId });

        if (!deletedOrder) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        res.json({
            message: "Order deleted successfully",
            deletedOrder
        });
    } catch (error) {
        res.status(500).json({
            message: "Error deleting order",
            error: error.message
        });
    }
}
