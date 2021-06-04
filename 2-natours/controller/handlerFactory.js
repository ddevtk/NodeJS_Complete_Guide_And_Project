const appError = require('../utils/appError');
const catchAsyncFn = require('../utils/catchAsyncFn');

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
