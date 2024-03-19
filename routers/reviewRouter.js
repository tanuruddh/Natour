import express from "express";
import reviewsController from "../controllers/reviewController.js";
import authController from "../controllers/authController.js";

const { getAllReviews, setTourUserId, createReview, deleteReview, updateReview, getReview } = reviewsController;
const { protect, restrictTo } = authController;

const router = express.Router({ mergeParams: true });

router.use(protect);
router.route('/')
    .get(getAllReviews)
    .post(restrictTo('user'), setTourUserId, createReview);

router.route('/:id')
    .get(getReview)
    .patch(restrictTo('user', 'admin'), updateReview)
    .delete(restrictTo('user', 'admin'), deleteReview);

export default router;