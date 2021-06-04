const Tour = require('../model/tourModel');
const APIFeatures = require('../utils/APIFeatures');
const appError = require('../utils/appError');
const catchAsyncFn = require('../utils/catchAsyncFn');
const handlerFactory = require('./handlerFactory');

//////////////////////
// ALIAS TOP TOUR
module.exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

//////////////////////
// CREATE NEW TOUR

/////////////////////
// GET ALL TOUR

/////////////////////
// GET TOUR

///////////////////
// GET TOUR STATS

module.exports.getTourStats = catchAsyncFn(async (req, res, next) => {
  const stats = await Tour.aggregate([
    { $match: { ratingsAverage: { $gte: 4.5 } } },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
});

//////////////////////
// GET MONTHLY PLAN
exports.getMonthlyPlan = catchAsyncFn(async (req, res, next) => {
  const year = +req.params.year;
  const plan = await Tour.aggregate([
    { $unwind: '$startDates' },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStats: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    { $addFields: { month: '$_id' } },
    { $project: { _id: 0 } },
    {
      $sort: { numTourStats: -1 },
    },
    { $limit: 6 },
  ]);

  res.status(200).json({
    status: 'success',
    results: plan.length,
    data: {
      plan,
    },
  });
});

module.exports.getAllTour = handlerFactory.getAll(Tour);
module.exports.getTour = handlerFactory.getOne(Tour, { path: 'reviews' });
module.exports.createNewTour = handlerFactory.createOne(Tour);
exports.updateTour = handlerFactory.updateOne(Tour);
exports.deleteTour = handlerFactory.deleteOne(Tour);
