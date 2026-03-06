import { Request, Response } from "express";
import { ReviewService } from "../services/reivew.service";

export async function createReview(req: Request, res: Response) {
  try {
    const user = req.user;

    const review = await ReviewService.createReviewService(user, req.body);

    res.status(201).json({
      success: true,
      message: "Review submitted successfully",
      review,
    });
  } catch (error) {
    console.error("Error in createReview controller:", error);

    const message =
      error instanceof Error ? error.message : "Internal server error";

    res.status(400).json({
      success: false,
      error: message,
    });
  }
}

export async function deleteReview(req: Request, res: Response) {
  try {
    const user = req.user;
    const { reviewId } = req.params as {
        reviewId: string
    };

    await ReviewService.deleteReviewService(user, reviewId);

    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    console.error("Error in deleteReview controller:", error);

    const message =
      error instanceof Error ? error.message : "Internal server error";

    res.status(400).json({
      success: false,
      error: message,
    });
  }
}