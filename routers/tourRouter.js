import express from 'express';
import toursFnc from '../controllers/tourController.js';
import authController from '../controllers/authController.js';
import reviewController from '../controllers/reviewController.js';
import reviewRouter from '../routers/reviewRouter.js';

const { protect, restrictTo } = authController;

const {
  getTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
  alaisTopTour,
  getToursStats,
  getMonthlyPlan,
} = toursFnc;
const router = express.Router();

// router.param('id',checkId);

router.use('/:tourId/reviews', reviewRouter);

router.route('/top-5-cheap').get(alaisTopTour, getTours);
router.route('/tour-stats').get(getToursStats);

router
  .route('/monthly-plan/:year')
  .get(
    protect,
    restrictTo('admin', 'lead-guide', 'guide'),
    getMonthlyPlan);

router.route('/')
  .get(getTours)
  .post(
    protect,
    restrictTo('admin', 'lead-guide'),
    createTour);

router.route('/:id')
  .get(getTour)
  .patch(
    protect,
    restrictTo('admin', 'lead-guide'),
    updateTour)
  .delete(
    protect,
    restrictTo('admin', 'lead-guide'),
    deleteTour);

// router.route('/:tourId/reviews')
//   .post(authController.protect,
//     authController.restrictTo('user'),
//     reviewController.createReview)

export default router;
