import mongoose from "mongoose";
// import User from "./userModel";
// import Tour from "./tourModel";


const reviewSchema = new mongoose.Schema(
    {
        review: {
            type: String,
            required: [true, 'A review must have a review']
        },
        rating: {
            type: Number,
            min: 1,
            max: 5,
            required: [true, 'A review must have a rating']
        },
        createdAt: {
            type: Date,
            default: Date.now(),
        },
        tour:
        {
            type: mongoose.Schema.ObjectId,
            ref: 'Tour',
            required: [true, 'A review must have a tour']
        },
        user:
        {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: [true, 'A review must have a user']
        }

    }, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
})

reviewSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'tour',
        select: 'name summary price -guides'
    }).populate({
        path: 'user',
        select: 'name photo'
    });
    next();
})

const Review = mongoose.model('Review', reviewSchema);

export default Review;