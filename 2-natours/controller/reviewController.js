const Review = require('../model/reviewModel');
const handlerFactory = require('./handlerFactory');

exports.checkTourId = (req, res, next) => {
  if (!req.body.tours) req.body.tour = req.params.tourId;
  if (!req.body.users) req.body.user = req.user._id;

  next();
};

exports.getAllReviews = handlerFactory.getAll(Review);
exports.getReview = handlerFactory.getOne(Review);
exports.createNewReview = handlerFactory.createOne(Review);
exports.updateReview = handlerFactory.updateOne(Review);
exports.deleteReview = handlerFactory.deleteOne(Review);
