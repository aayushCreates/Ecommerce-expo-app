import Stripe from "stripe";
import { Product } from "../models/product.model";
import { User, UserDocument } from "../models/user.model";
import { Order, ShippingAddressDocument } from "../models/order.model";
import { Types } from "mongoose";
import { CartItem } from "../models/cart.model";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export class PaymentServices {

  static async createPaymentIntent(cartItems: CartItem[], shippingAddress: ShippingAddressDocument, user: UserDocument) {

    if (!cartItems || cartItems.length === 0) {
      throw new Error("Cart is empty");
    }

    let subtotal = 0;
    const validatedItems = [];

    for (const item of cartItems) {
      const product = await Product.findById(item.product._id);

      if (!product) {
        throw new Error(`Product ${item.product._id} not found`);
      }

      if (product.stock < item.quantity) {
        throw new Error(`Insufficient stock for ${product.name}`);
      }

      subtotal += product.price * item.quantity;

      validatedItems.push({
        product: product._id.toString(),
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image: product.images[0],
      });
    }

    const shipping = 10;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;

    if (total <= 0) {
      throw new Error("Invalid order total");
    }

    let customer;

    if (user.stripeCustomerId) {
      customer = await stripe.customers.retrieve(user.stripeCustomerId);
    } else {
      customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: {
          clerkId: user.clerkId,
          userId: user._id.toString(),
        },
      });

      await User.findByIdAndUpdate(user._id, {
        stripeCustomerId: customer.id,
      });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(total * 100),
      currency: "usd",
      customer: customer.id,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        clerkId: user.clerkId,
        userId: user._id.toString(),
        orderItems: JSON.stringify(validatedItems),
        shippingAddress: JSON.stringify(shippingAddress),
        totalPrice: total.toFixed(2),
      },
    });

    return paymentIntent.client_secret;
  }

  static async handleWebhook(event: Stripe.Event) {

    if (event.type === "payment_intent.succeeded") {

      const paymentIntent = event.data.object as Stripe.PaymentIntent;

      const { userId, clerkId, orderItems, shippingAddress, totalPrice } =
        paymentIntent.metadata;

      const existingOrder = await Order.findOne({
        "paymentResult.id": paymentIntent.id,
      });

      if (existingOrder) {
        return;
      }

      const order = await Order.create({
        user: new Types.ObjectId(userId),
        clerkId: clerkId as string,
        orderItems: JSON.parse(orderItems as string),
        shippingAddress: JSON.parse(
          shippingAddress as string
        ) as ShippingAddressDocument,
        paymentResult: {
          id: paymentIntent.id,
          status: "succeeded",
        },
        totalPrice: parseFloat(totalPrice as string),
      });

      const items = JSON.parse(orderItems as string);

      for (const item of items) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: -item.quantity },
        });
      }

      return order;
    }
  }
}