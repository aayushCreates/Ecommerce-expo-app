import { Router } from "express";
import { isUserLoggedIn } from "../middlewares/auth.middleware";
import { createReview, deleteReview } from "../controllers/review.controller";

const reviewRoutes = Router();

reviewRoutes.post("/", isUserLoggedIn, createReview);
reviewRoutes.delete("/:reviewId", isUserLoggedIn, deleteReview);

export default reviewRoutes;