const User = require('../model/userModel');
const appError = require('../utils/appError');
const catchAsyncFn = require('../utils/catchAsyncFn');
const handlerFactory = require('./handlerFactory');

// UPDATE USER'S DATA
exports.updateMe = catchAsyncFn(async (req, res, next) => {
  if (req.body.password || req.body.confirmPassword) {
    return next(
      new appError(
        'This route is not for password update. Please use /updatePassword.',
        400
      )
    );
  }
  const filterBodyHandler = (obj, ...allowedFields) => {
    console.log(allowedFields);
    let allowObj = {};
    Object.keys(obj).forEach((el) => {
      if (allowedFields.includes(el)) allowObj[el] = obj[el];
    });
    return allowObj;
  };
  const filterBodyObj = filterBodyHandler(req.body, 'name', 'email');
  const updateUser = await User.findByIdAndUpdate(req.user._id, filterBodyObj, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updateUser,
    },
  });
});

// DELETE USER
exports.deleteMe = catchAsyncFn(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

module.exports.getMe = (req, res, next) => {
  req.params.id = req.user._id;
  next();
};

module.exports.getAllUsers = handlerFactory.getAll(User);
module.exports.getUser = handlerFactory.getOne(User);
module.exports.updateUser = handlerFactory.updateOne(User);
module.exports.deleteUser = handlerFactory.deleteOne(User);
