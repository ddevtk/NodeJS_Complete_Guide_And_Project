const catchAsyncFn = require('../utils/catchAsyncFn');
const Tour = require('../model/tourModel');

exports.getOverview = catchAsyncFn(async (req, res, next) => {
  const tours = await Tour.find();
  res.status(200).render('overview', {
    title: 'All tour',
    tours,
  });
});
exports.getTour = (req, res) => {
  res.status(200).render('tour', {
    title: 'The Forest Hiker',
  });
};
