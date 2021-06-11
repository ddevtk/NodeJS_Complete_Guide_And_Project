const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const crypto = require('crypto');
const User = require('../model/userModel');
const appError = require('../utils/appError');
const catchAsyncFn = require('../utils/catchAsyncFn');
const bcrypt = require('bcryptjs');

const Email = require('../utils/email');

const getToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '90d',
  });
};

const sendToken = (res, statusCode, user) => {
  const token = getToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);


  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

module.exports.signup = catchAsyncFn(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    // passwordChangedAt: req.body.passwordChangedAt,
  });
  const url = `${req.protocol}://${req.get('host')}/me`;
  await new Email(newUser, url).sendWelcome();

  sendToken(res, 201, newUser);
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
    return next(new appError('Incorrect email or password 💥💥💥', 401));
  }

  sendToken(res, 200, user);
});

exports.protect = catchAsyncFn(async (req, res, next) => {
  let token;
  let headers = req.headers;

  // 1) Getting token and check of it is here
  if (headers.authorization && headers.authorization.startsWith('Bearer')) {
    token = headers.authorization.split(' ')[1];
  }
  if (req.cookies.jwt) {
    token = req.cookies.jwt;
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
  // Access to protected route
  req.user = currentUser;
  res.locals.user = currentUser;

  next();
});

// CHECK USER IS LOGGED IN
exports.isLoggedIn = async (req, res, next) => {
  try {
    if (req.cookies.jwt) {
      //  Verification token
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );

      //  Check if user still exists
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return next();
      }

      //  Check if user changed password after the token was issue
      if (currentUser.checkPasswordHasChanged(decoded.iat)) {
        return next();
      }

      // There is a logged in user
      res.locals.user = currentUser;
      return next();
    }
    next();
  } catch (error) {
    next();
  }
};

// " RESTRICT TO " FEATURE
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new appError('You do not have permission to perform this action ', 403)
      );
    }
    next();
  };
};

// FORGOT PASSWORD FEATURE
exports.forgotPassword = catchAsyncFn(async (req, res, next) => {
  // 1) Get user by POSTED email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new appError('There is no user with this email address ', 404));
  }

  // 2) Gen randomResetToken
  const resetToken = user.getPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3) Send randomResetToken to user 's email
  try {
    const resetURL = `${req.protocol}://127.0.0.1/api/v1/users/resetPassword/${resetToken}`;
    await new Email(user, resetURL).sendPasswordReset();
    res.status(200).json({
      status: 'success',
      message: 'Token send to email',
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new appError(
        'There was an error sending the email! Try again later.',
        500
      )
    );
  }
});

// RESET PASSWORD
exports.resetPassword = catchAsyncFn(async (req, res, next) => {
  // 1) Get user by token and check passwordReset is not expired
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  // 2) Check if user exists and update password
  if (!user) {
    return next(new appError('Token is invalid or has expired', 400));
  }
  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // Send token and get access to protected route
  sendToken(res, 200, user);
});

// UPDATE PASSWORD
exports.updatePassword = catchAsyncFn(async (req, res, next) => {
  // 1) Get user from collection
  const currentUser = await User.findById(req.user._id).select('+password');

  // 2) Check if POSTed password is correct
  if (!(await bcrypt.compare(req.body.currentPassword, currentUser.password))) {
    return next(new appError('Incorrect password. Please check again', 401));
  }
  // 3) Update password
  currentUser.password = req.body.newPassword;
  currentUser.confirmPassword = req.body.confirmPassword;
  await currentUser.save();

  // 4) Send jwt
  sendToken(res, 200, currentUser);
});

// LOG OUT
exports.logout = (req, res) => {
  res.cookie('jwt', 'logged out', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({
    status: 'success',
  });
};
