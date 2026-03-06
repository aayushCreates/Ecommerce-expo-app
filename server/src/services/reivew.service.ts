import { Order } from "../models/order.model";
import { Product } from "../models/product.model";
import { Review } from "../models/review.model";

export class ReviewService {
  static async createReviewService(user: any, body: any) {
    const { productId, orderId, rating } = body;

    if (!rating || rating < 1 || rating > 5) {
      throw new Error("Rating must be between 1 and 5");
    }

    const order = await Order.findById(orderId);

    if (!order) {
      throw new Error("Order not found");
    }

    if (order.clerkId !== user.clerkId) {
      throw new Error("Not authorized to review this order");
    }

    if (order.status !== "delivered") {
      throw new Error("Can only review delivered orders");
    }

    const productInOrder = order.orderItems.find(
      (item: any) => item.product.toString() === productId.toString()
    );

    if (!productInOrder) {
      throw new Error("Product not found in this order");
    }

    const review = await Review.findOneAndUpdate(
      {
        productId,
        userId: user._id,
      },
      {
        rating,
        orderId,
        productId,
        userId: user._id,
      },
      { new: true, upsert: true, runValidators: true }
    );

    const reviews = await Review.find({ productId });

    const totalRating = reviews.reduce((sum, rev) => sum + rev.rating, 0);

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      {
        averageRating: totalRating / reviews.length,
        totalReviews: reviews.length,
      },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      await Review.findByIdAndDelete(review._id);
      throw new Error("Product not found");
    }

    return review;
  }

  static async deleteReviewService(user: any, reviewId: string) {
    const review = await Review.findById(reviewId);

    if (!review) {
      throw new Error("Review not found");
    }

    if (review.userId.toString() !== user._id.toString()) {
      throw new Error("Not authorized to delete this review");
    }

    const productId = review.productId;

    await Review.findByIdAndDelete(reviewId);

    const reviews = await Review.find({ productId });

    const totalRating = reviews.reduce((sum, rev) => sum + rev.rating, 0);

    await Product.findByIdAndUpdate(productId, {
      averageRating: reviews.length > 0 ? totalRating / reviews.length : 0,
      totalReviews: reviews.length,
    });

    return true;
  }
}