const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const app = require('../app');
const User = require('../model/userModel');
const appError = require('../utils/appError');
const catchAsyncFn = require('../utils/catchAsyncFn');
const bcrypt = require('bcryptjs');
const { token } = require('morgan');

const getToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '90d',
  });
};

module.exports.signup = catchAsyncFn(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    passwordChangedAt: req.body.passwordChangedAt,
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

exports.protect = catchAsyncFn(async (req, res, next) => {
  let token;
  let headers = req.headers;

  // 1) Getting token and check of it is here
  if (headers.authorization && headers.authorization.startsWith('Bearer')) {
    token = headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new appError('You are not logged in! Please to login to get access', 401)
    );
  }

  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new appError('The token belonging to this user no longer exists', 401)
    );
  }

  // 4) Check if user changed password after the token was issue
  if (currentUser.checkPasswordHasChanged(decoded.iat)) {
    return next(
      new appError('User recently has been changed. Please login again', 401)
    );
  }
  // ACCESS TO PROTECTED ROUTE
  req.user = currentUser;

  next();
});

// RESTRICT TO
exports.restrictTo =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new appError('You do not have permission to perform this action ', 403)
      );
    }
    next();
  };
