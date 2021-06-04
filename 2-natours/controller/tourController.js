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
module.exports.createNewTour = catchAsyncFn(async (req, res, next) => {
  const newTour = await Tour.create(req.body);

  // if (!tour) {
  //   return next(new appError('No tour found with that ID !!!', 404));
  // }

  res.status(201).json({
    status: 'success',
    data: {
      newTour,
    },
  });
});

/////////////////////
// GET ALL TOUR
module.exports.getAllTour = catchAsyncFn(async (req, res, next) => {
  // Execute query
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .paginate()
    .limitedField()
    .sort();
  const tours = await features.query;

  // Send data response
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
});

/////////////////////
// GET TOUR
module.exports.getTour = catchAsyncFn(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id).populate('reviews');

  if (!tour) {
    return next(new appError('No tour found with that ID !!!', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

/////////////////////
// UPDATE TOUR
module.exports.updateTour = catchAsyncFn(async (req, res, next) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!tour) {
    return next(new appError('No tour found with that ID !!!', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

/////////////////////
// DELETE TOUR
exports.deleteTour = handlerFactory.deleteOne(Tour);

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
