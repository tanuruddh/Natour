import express from 'express';
import toursFnc from '../controllers/tourController.js';
import authController from '../controllers/authController.js';

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

router.route('/top-5-cheap').get(alaisTopTour, getTours);
router.route('/tour-stats').get(getToursStats);
router.route('/monthly-plan/:year').get(getMonthlyPlan);
router.route('/').get(protect, getTours).post(createTour);
router.route('/:id').get(getTour).patch(updateTour).delete(protect, restrictTo('admin', 'lead-guide'), deleteTour);

export default router;
