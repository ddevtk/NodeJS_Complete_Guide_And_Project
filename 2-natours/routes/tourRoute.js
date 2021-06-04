const express = require('express');
const authController = require('../controller/authController');
const tourController = require('../controller/tourController');
const reviewRouter = require('../routes/reviewRoute');

const router = express.Router();

router.route('/tour-stats').get(tourController.getTourStats);
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTour);

router
  .route('/')
  .get(authController.protect, tourController.getAllTour)
  .post(tourController.createNewTour);
router
  .route('/:id')
  .get(tourController.getTour)
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour
  )
  .patch(tourController.updateTour);

// router
//   .route('/:tourId/review')
//   .post(
//     authController.protect,
//     authController.restrictTo('user'),
//     reviewController.createNewReview
//   );
router.use('/:tourId/reviews', reviewRouter);

module.exports = router;
