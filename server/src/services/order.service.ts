import { Product } from "../models/product.model";
import { Order } from "../models/order.model";
import { Review } from "../models/review.model";

export class OrderServices {
  static async createOrderService(user: any, body: any) {
    const { orderItems, shippingAddress, paymentResult, totalPrice } = body;

    if (!orderItems || orderItems.length === 0) {
      throw new Error("No order items");
    }

    // check product and stock
    for (const item of orderItems) {
      const product = await Product.findById(item.product._id);

      if (!product) {
        throw new Error(`Product ${item.name} not found`);
      }

      if (product.stock < item.quantity) {
        throw new Error(`Insufficient stock for ${product.name}`);
      }
    }

    const order = await Order.create({
      user: user._id,
      clerkId: user.clerkId,
      orderItems,
      shippingAddress,
      paymentResult,
      totalPrice,
    });

    // update stock
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.product._id, {
        $inc: { stock: -item.quantity },
      });
    }

    return order;
  }

  static async getUserOrdersService(clerkId: string) {
    const orders = await Order.find({ clerkId })
      .populate("orderItems.product")
      .sort({ createdAt: -1 });

    const orderIds = orders.map((order) => order._id);

    const reviews = await Review.find({
      orderId: { $in: orderIds },
    });

    const reviewedOrderIds = new Set(
      reviews.map((review) => review.orderId.toString())
    );

    const ordersWithReviewStatus = orders.map((order) => ({
      ...order.toObject(),
      hasReviewed: reviewedOrderIds.has(order._id.toString()),
    }));

    return ordersWithReviewStatus;
  }
}
