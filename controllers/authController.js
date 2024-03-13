import crypto from 'crypto';
import { promisify } from 'util';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import catchAsync from '../utils/catchAsnyc.js';
import AppError from '../utils/appError.js';
import sendEmail from '../utils/email.js';

const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIREs_IN })
}

const createSendToken = (user, statusCode, res) => {

    const token = signToken(user._id);
    const cookieOptions = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIREs_IN * 24 * 60 * 60 * 1000),
        httpOnly: true
    }

    if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

    res.cookie('jwt', token, cookieOptions);
    user.password = undefined;

    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user
        }
    })
}

const signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        passwordChangedAt: Date.now(),
        role: req.body.role
    });

    createSendToken(newUser, 201, res);
});

const login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new AppError('Please provide email and password', 400));
    }
    const user = await User.findOne({ email }).select('+password');


    if (!user || !await user.correctPassword(password, user.password)) {
        return next(new AppError('Incorrect email or pasword', 401));
    }


    createSendToken(user, 200, res);

})

const protect = catchAsync(async (req, res, next) => {
    // 1) Getting token and check of its there
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return next(new AppError('Your are not logged in! ,please log in to get access ', 401));
    }

    // 2) Verification token

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 3)Check if user still exist
    const currentUser = await User.findById(decoded.id);

    if (!currentUser) {
        next(new AppError('The user belonging to this token does no longer exists.', 401));
    }

    // 4) Check if user recently changed password after the token was issued
    if (currentUser.changePasswordAfter(decoded.iat)) {
        console.log('ha');
        return next(new AppError('User recently changed password! , please login again.', 401));
    }
    req.user = currentUser;

    next();
})

const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new AppError('You do not have permission to perform this action', 403));
        }
        next();
    }
}

const forgotPassword = catchAsync(async (req, res, next) => {
    // 1) Get user based on POSTed email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new AppError('There is no user with this email address', 404));
    }
    // 2) Generate reset Token

    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // 3) send it to user email
    const resetURL = `${req.protocol}://${req.hostname}/api/v1/users/resetPassword/${resetToken}`;
    const message = ` Forgot your password? submit patch request with your new password and confirm password to: ${resetURL}.\n if not Please ignore`;

    try {
        await sendEmail({
            email: user.email,
            subject: 'Your password reset token (Valid only for 10 min)',
            message
        });

        res.status(200).json({
            status: 200,
            message: 'Token sent to your email'
        })

    } catch (error) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });
        return next(new AppError("There was an error sending the email, try again later!", 500));
    }

})

const resetPassword = catchAsync(async (req, res, next) => {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() }
    })

    if (!user) {
        return next(new AppError('Password reset token is invalid or has expired', 400));
    }
    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.passwordChangedAt = Date.now();
    await user.save();

    createSendToken(user, 200, res);

})


const updatePassword = async (req, res, next) => {

    const user = await User.findById(req.user.id).select('+password');

    if (!user.correctPassword(req.body.currentPassword, user.password)) {
        return next(new AppError('Current password is incorrect', 401));
    }

    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    user.passwordChangedAt = Date.now();

    await user.save();

    createSendToken(user, 200, res);

}

export default {
    signup,
    login,
    protect,
    restrictTo,
    forgotPassword,
    resetPassword,
    updatePassword
};