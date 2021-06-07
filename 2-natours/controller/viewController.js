const catchAsyncFn = require('../utils/catchAsyncFn');
const Tour = require('../model/tourModel');

exports.getOverview = catchAsyncFn(async (req, res, next) => {
  const tours = await Tour.find();
  res.status(200).render('overview', {
    title: 'All tour',
    tours,
  });
});
exports.getTour = catchAsyncFn(async (req, res, next) => {
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review user rating',
  });
  res.status(200).render('tour', {
    title: 'The Forest Hiker',
    tour,
  });
});
