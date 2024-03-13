import express from "express";
import reviewsController from "../controllers/reviewController.js";
import authController from "../controllers/authController.js";

const { getAllReviews, createReview } = reviewsController;

const router = express.Router();

router.route('/').get(getAllReviews).post(authController.protect, authController.restrictTo('user'), createReview);

export default router;