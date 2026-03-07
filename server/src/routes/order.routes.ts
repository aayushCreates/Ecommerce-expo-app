import { Router } from "express";
import { isUserLoggedIn } from "../middlewares/auth.middleware";
import { createOrder, getUserOrders } from "../controllers/order.controller";

const orderRoutes = Router();

orderRoutes.post("/", isUserLoggedIn, createOrder);
orderRoutes.get("/", isUserLoggedIn, getUserOrders);

export default orderRoutes;