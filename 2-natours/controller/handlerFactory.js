const appError = require('../utils/appError');
const catchAsyncFn = require('../utils/catchAsyncFn');
const APIFeatures = require('../utils/APIFeatures');

exports.deleteOne = (model) =>
  catchAsyncFn(async (req, res, next) => {
    const doc = await model.findByIdAndDelete(req.params.id);
    if (!doc)
      return next(new appError("Can't not find document with that ID ", 404));

    res.status(204).json({
      status: 'success',
      data: null,
    });
  });
exports.updateOne = (model) =>
  catchAsyncFn(async (req, res, next) => {
    const doc = await model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) return next(new appError('No document found with that ID', 404));

    res.status(200).json({
      status: 'success',
      data: { doc },
    });
  });

exports.createOne = (model) =>
  catchAsyncFn(async (req, res, next) => {
    const doc = await model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: { doc },
    });
  });

exports.getOne = (model, populateOptions) =>
  catchAsyncFn(async (req, res, next) => {
    let query = model.findById(req.params.id);
    if (populateOptions) query.populate(populateOptions);

    const doc = await query;

    if (!doc) return next(new appError('No document found with that ID', 404));

    res.status(200).json({
      status: 'success',
      data: {
        doc,
      },
    });
  });

module.exports.getAll = (model) =>
  catchAsyncFn(async (req, res, next) => {
    // To allow nested route (GET reviews on specify tour)
    let filterObj = {};
    if (req.params.tourId) filterObj = { tours: req.params.tourId };

    // Execute query
    const features = new APIFeatures(model.find(filterObj), req.query)
      .filter()
      .paginate()
      .limitedField()
      .sort();
    const doc = await features.query;

    // Send data response
    res.status(200).json({
      status: 'success',
      results: doc.length,
      data: {
        doc,
      },
    });
  });
