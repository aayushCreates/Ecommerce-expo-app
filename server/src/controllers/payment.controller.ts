import { Request, Response, NextFunction } from "express";
import Stripe from "stripe";
import { PaymentServices } from "../services/payment.service";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

type SignatureType = string | Buffer | string[];

export const createPaymentIntent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { cartItems, shippingAddress } = req.body;
    const user = req.user;

    const clientSecret = await PaymentServices.createPaymentIntent(
      cartItems,
      shippingAddress,
      user
    );

    res.status(200).json({
      success: true,
      message: "Payment intent created successfully",
      data: clientSecret,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const handleWebhook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const signature = req.headers["stripe-signature"] as SignatureType;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: `Webhook Error: ${error.message}`,
    });
  }

  try {
    await PaymentServices.handleWebhook(event);
  } catch (error) {
    console.error("Webhook processing failed:", error);
  }

  res.json({ received: true });
};
