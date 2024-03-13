import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import xss from 'xss-clean'
import hpp from "hpp";

import globalErrorHandler from "./controllers/errorController.js";
import tourRouter from './routers/tourRouter.js';
import userRouter from "./routers/userRouter.js";
import AppError from "./utils/appError.js";
import reviewRouter from './routers/reviewRouter.js'

const app = express();

app.use(helmet());

const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: "Too many requests from this IP, please try again later"
})

app.use(limiter);
app.use(express.json({ limit: '10kb' }));

app.use(mongoSanitize());

app.use(xss());
app.use(hpp({
    whitelist: [
        'duration',
        'ratingsQuantity',
        'ratingsAverage',
        'maxGroupSize',
        'difficulty',
        'price'
    ]
}));

app.use(express.static('./public'));

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);


app.all('*', (req, res, next) => {
    // res.status(404).send({
    //     status: "not found",
    //     messsage: `can not find ${req.originalUrl}`
    // })

    // const err = new Error(`can not find ${req.originalUrl} on this server`)
    // err.status = 'fail';
    // err.statusCode = 500;
    // next(err);

    next(new AppError(`can not find ${req.originalUrl} on this server`, 400))

})
app.use(globalErrorHandler);

export default app;

// app.get('/api/v1/tours',getTours)
// app.get('/api/v1/tours/:id',getTour)
// app.post('/api/v1/tours',postTour)
// app.patch('/api/v1/tours/:id',updateTour);
// app.delete('/api/v1/tours/:id',deleteTour);
