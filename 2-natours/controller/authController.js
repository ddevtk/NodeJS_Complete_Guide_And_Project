const jwt = require('jsonwebtoken');
const app = require('../app');
const User = require('../model/userModel');
const appError = require('../utils/appError');
const catchAsyncFn = require('../utils/catchAsyncFn');
const bcrypt = require('bcryptjs');
const { token } = require('morgan');

const getToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

module.exports.signup = catchAsyncFn(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
  });

  const token = getToken(newUser._id);

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});
exports.login = catchAsyncFn(async (req, res, next) => {
  // Check if email and password exist
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new appError('Please provide email and password', 400));
  }
  // Check if email and password is correct
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(new appError('Incorrect email or password', 401));
  }

  const token = getToken(user._id);

  res.status(200).json({
    status: 'success',
    token,
  });
});
