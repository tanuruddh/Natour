import catchAsync from "../utils/catchAsnyc.js";
import AppError from "../utils/appError.js";
import ApiFeatures from '../utils/apiFeatures.js';


const getAll = (Model) => catchAsync(async (req, res, next) => {
    // const excludeField = ['sort', 'page', 'limit', 'fields'];
    // const queryobj = { ...req.query };
    // excludeField.forEach((ele) => delete queryobj[ele]);

    // let queryStr = JSON.stringify(queryobj);
    // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    // let newQuery = JSON.parse(queryStr);

    // let query = Tour.find(newQuery);

    // if (req.query.sort) {
    //   const sortBy = req.query.sort.split(',').join(' ');
    //   query = query.sort(sortBy);
    // } else {
    //   query = query.sort('-createdAt');
    // }

    // if (req.query.fields) {
    //   const fields = req.query.fields.split(',').join(' ');
    //   query = query.select(fields);
    // } else {
    //   query = query.select('-__v');
    // }

    // const limit = req.query.limit * 1 || 100;
    // const page = req.query.page * 1 || 1;
    // const skip = (page - 1) * limit;
    // query = query.skip(skip).limit(limit);

    // if (req.query.page) {
    //   const numtours = await Tour.countDocuments();
    //   if (skip >= numtours) throw new Error('This page is not exist!!!');
    // }

    let filter = {}
    if (req.params.tourId) filter = { tour: req.params.tourId }
    const features = new ApiFeatures(Model.find(filter), req.query)
        .filter()
        .sort()
        .limiteFields()
        .paginate();
    const doc = await features.query;

    res.status(200).json({
        status: 'success',
        results: doc.length,
        data: {
            data: doc,
        },
    });
});


const deleteOne = (Model) =>
    catchAsync(async (req, res, next) => {
        console.log('efrcervw')
        const doc = await Model.findOneAndDelete(req.param.id);
        if (!doc) {
            return next(new AppError('No document found with that id', 404));
        }
        res.status(204).json({
            status: 'success',
            data: null,
        });
    });
const updateOne = Model => catchAsync(async (req, res, next) => {

    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    if (!doc) {
        return next(new AppError('No document found with that id', 404));
    }
    res.status(200).send({
        status: 'success',
        data: {
            data: doc
        },
    });
});

const createOne = Model => catchAsync(async (req, res, next) => {

    const newDoc = await Model.create(req.body);
    res.status(201).send({
        status: 'success',
        data: {
            newDoc,
        },
    });
});

const getOne = (Model, popOption) => catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOption) query = query.populate(popOption);
    const doc = await query;
    if (!doc) {
        return next(new AppError('No document found with that id', 404));
    }
    return res.status(200).json({
        status: 'successfull',
        data: {
            data: doc,
        },
    });
});

export default {
    deleteOne,
    updateOne,
    createOne,
    getOne,
    getAll
}