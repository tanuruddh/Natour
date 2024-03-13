import Review from "../models/reviewModel.js";
import catchAsync from "../utils/catchAsnyc.js";

const getAllReviews = catchAsync(async (req, res, next) => {
    const reviews = await Review.find();
    res.status(200).json({
        status: 'success',
        results: reviews.length,
        data: {
            reviews
        }
    })
})

const createReview = catchAsync(async (req, res, next) => {
    const newReview = await Review.create(req.body);
    res.status(201).json({
        status: 'success',
        data: {
            review: newReview
        }
    })
})

export default {
    getAllReviews,
    createReview
}