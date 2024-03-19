import mongoose from "mongoose";
import Tour from "./tourModel.js";
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
    // this.populate({
    //     path: 'tour',
    //     select: 'name summary price -guides'
    // }).populate({
    //     path: 'user',
    //     select: 'name photo'
    // });

    this.populate({
        path: 'user',
        select: 'name photo'
    });
    next();
})

reviewSchema.statics.calcAverageRatings = async function (tourId) {

    const stats = await this.aggregate([
        {
            $match: {
                tour: tourId
            }
        },
        {
            $group: {
                _id: '$tour',
                avgRating: { $avg: '$rating' },
                nRating: { $sum: 1 }
            }
        }
    ]);

    await Tour.findByIdAndUpdate(tourId, {
        ratingAverage: stats[0].avgRating,
        ratingQuantity: stats[0].nRating
    });
    console.log("this.clone()")

};

reviewSchema.post('save', function () {
    this.constructor.calcAverageRatings(this.tour)
})

// reviewSchema.pre(/^findOneAnd/, async function (next) {
//     const id = await this.getFilter();
//     console.log(id)

//     this.docId = this._conditions;
//     console.log('efrcervw')
//     console.log(this.docId);
//     this.r = await this.model.findById(id);

//     next();
// })

reviewSchema.pre('findOneAndDelete', async function (next) {
    // Capture the ID of the document to be deleted
    this.doc = await this.findOne().clone(); // Save the document to be deleted
    if (!this.doc) {
        // If no document found, move to the next middleware
        return next();
    }
    this.docId = this.doc._id; // Access the _id of the document
    console.log(this.docId)
    next();
});



reviewSchema.post(/^findOneAnd/, async function () {
    await this.r.constructor.calcAverageRatings(this.r.tour);
})


const Review = mongoose.model('Review', reviewSchema);

export default Review;