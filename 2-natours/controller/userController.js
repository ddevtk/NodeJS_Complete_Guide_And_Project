const User = require('../model/userModel');
const appError = require('../utils/appError');
const catchAsyncFn = require('../utils/catchAsyncFn');
const handlerFactory = require('./handlerFactory');

module.exports.getAllUsers = catchAsyncFn(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
});

module.exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this route is not yet defined',
  });
};
module.exports.createNewUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this route is not yet defined',
  });
};
module.exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this route is not yet defined',
  });
};
module.exports.deleteUser = handlerFactory.deleteOne(User);

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
