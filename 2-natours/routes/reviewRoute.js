const express = require('express');
const authController = require('../controller/authController');

const reviewController = require('../controller/reviewController');

const router = express.Router({ mergeParams: true });

// PROTECT ROUTES IF USER NOT LOGGED IN
router.use(authController.protect);

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.restrictTo('user'),
    reviewController.checkTourId,
    reviewController.createNewReview
  );

router
  .route('/:id')
  .get(reviewController.getReview)
  .delete(
    authController.restrictTo('admin', 'user'),
    reviewController.deleteReview
  )
  .patch(
    authController.restrictTo('admin', 'user'),
    reviewController.updateReview
  );

module.exports = router;
