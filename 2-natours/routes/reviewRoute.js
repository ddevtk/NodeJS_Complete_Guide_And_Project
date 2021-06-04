const express = require('express');
const authController = require('../controller/authController');

const reviewController = require('../controller/reviewController');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.protect,
    authController.restrictTo('user'),
    reviewController.createNewReview
  );

router.route('/:id').delete(reviewController.deleteReview);

module.exports = router;
