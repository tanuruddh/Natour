import Review from "../models/reviewModel.js";
import catchAsync from "../utils/catchAsnyc.js";
import factory from "./handlerFactory.js";




const setTourUserId = (req, res, next) => {
    if (!req.body.tour) req.body.tour = req.params.tourId;
    if (!req.body.user) req.body.user = req.user.id;
    next();
}

const getAllReviews = factory.getAll(Review)
const createReview = factory.createOne(Review);
const deleteReview = factory.deleteOne(Review);
const updateReview = factory.updateOne(Review);
const getReview = factory.getOne(Review);

export default {
    getAllReviews,
    setTourUserId,
    createReview,
    deleteReview,
    updateReview,
    getReview,
}