import User from "../models/userModel.js";
import AppError from "../utils/appError.js"
import catchAsync from "../utils/catchAsnyc.js"
import factory from "./handlerFactory.js";

const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(ele => {
        if (allowedFields.includes(ele)) newObj[ele] = obj[ele];
    })

    return newObj;
}

const getMe = (req, res, next) => {
    req.params.id = req.user.id;
    next();
}

const updateMe = catchAsync(async (req, res, next) => {
    if (req.body.password || req.body.confirmPassword) {
        return next(new AppError("This routes is not for password updates .please use /updatePassword"), 400);
    }

    const filteredBody = filterObj(req.body, 'name', 'email');
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, { new: true, runValidators: true });

    res.status(200).json({
        status: 'success',
        data: {
            user: updatedUser
        }
    })

})

const deleteMe = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, { active: false });
    res.status(204).json({
        status: 'success',
        data: null
    })
});

const postUser = (req, res) => {
    res.status(500).send({
        status: "not found",
        messsage: 'Invalid ID'
    })
}

const getUsers = factory.getAll(User);
const getUser = factory.getOne(User);
const updateUser = factory.updateOne(User);
const deleteUser = factory.deleteOne(User);
export default {
    getUsers,
    getUser,
    getMe,
    updateUser,
    postUser,
    deleteUser,
    updateMe,
    deleteMe,
}