const User = require('../model/userModel');
const catchAsyncFn = require('../utils/catchAsyncFn');

module.exports.signup = catchAsyncFn(async (req, res, next) => {
  const newUser = await User.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      user: newUser,
    },
  });
});
