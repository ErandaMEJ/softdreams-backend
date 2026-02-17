import express from "express";
import { getSalesAnalytics, getRevenueStats } from "../controllers/analyticsController.js";

const analyticsRouter = express.Router();

analyticsRouter.get("/sales", getSalesAnalytics);
analyticsRouter.get("/revenue", getRevenueStats);

export default analyticsRouter;
