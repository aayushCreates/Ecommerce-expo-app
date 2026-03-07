import { Router } from "express";
import { isUserLoggedIn } from "../middlewares/auth.middleware";
import { createPaymentIntent, handleWebhook } from "../controllers/payment.controller";

const paymentRoutes = Router();

paymentRoutes.post("/create-intent", isUserLoggedIn, createPaymentIntent);

paymentRoutes.post("/webhook", handleWebhook); // No auth needed - Stripe validates via signature

export default paymentRoutes;
