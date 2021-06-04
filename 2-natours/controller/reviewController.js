const Review = require('../model/reviewModel');
const catchAsyncFn = require('../utils/catchAsyncFn');

exports.getAllReviews = catchAsyncFn(async (req, res, next) => {
  let filterObj = {};
  if (req.params.tourId) filterObj = { tours: req.params.tourId };
  const reviews = await Review.find(filterObj);

  res.status(200).json({
    status: 'success',
    result: reviews.length,
    data: {
      reviews,
    },
  });
});

exports.createNewReview = catchAsyncFn(async (req, res, next) => {
  if (!req.body.tour) req.body.tours = req.params.tourId;
  if (!req.body.user) req.body.users = req.user._id;

  const newReview = await Review.create(req.body);

  res.status(200).json({
    status: 'success',
    data: {
      review: newReview,
    },
  });
});
