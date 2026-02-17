import express from "express";
import { createOrder, getOrders, updateOrderStatus, deleteOrder } from "../controllers/orderController.js";

const orderRouter = express.Router();

orderRouter.post("/", createOrder);
orderRouter.get("/", getOrders);
orderRouter.put("/:orderId", updateOrderStatus);
orderRouter.delete("/:orderId", deleteOrder);

export default orderRouter;

