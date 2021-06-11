const appError = require('../utils/appError');

// Handle invalid DB IDs
const errorDBHandler = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new appError(message, 400);
};

// Handle duplicate error DB
const errorDuplicateHandler = (err) => {
  // const value = err.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0];

  const message = `Duplicate field value: " ${err.keyValue.name} ". Please use another value !!!`;
  return new appError(message, 400);
};
// Handle validation error DB
const errorValidationHandler = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data: ${errors.join('. ')}`;
  return new appError(message, 400);
};

// Handle JWT error
const errorJWTHandler = () =>
  new appError('Invalid token. Please login again !', 401);

// Handle expired Token error
const tokenExpiredErrorHandler = () =>
  new appError('Your token is expired! Please login again !', 401);

// Error with env = development
const errorDev = (err, req, res) => {
  // API
  if (req.originalUrl.startsWith('/api'))
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });

  res.status(err.statusCode).render('error', {
    title: 'Some thing went wrong',
    mes: err.message,
  });
};

// Error with env = production
const errorProduct = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    if (err.isOperational) {
      // Operational Error
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
      // Programming Error
    }
    console.error('ERROR 💥💥💥', err);
    return res.status(500).json({
      status: 'error',
      message: 'Some thing went wrong !!!',
    });
  }
  if (err.isOperational) {
    return res.status(err.statusCode).render('error', {
      title: 'Some thing went wrong',
      mes: err.message,
    });
  }
  return res.status(500).render('error', {
    title: 'Some thing went wrong',
    mes: 'Please try again',
  });
};

// Error controller
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    errorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err, message: err.message };

    if (err.name === 'CastError') {
      error = errorDBHandler(err);
    }
    if (err.code === 11000) {
      error = errorDuplicateHandler(err);
    }
    if (err.name === 'ValidationError') {
      error = errorValidationHandler(err);
    }
    if (err.name === 'JsonWebTokenError') {
      error = errorJWTHandler();
    }

    if (err.name === 'TokenExpiredError') {
      error = tokenExpiredErrorHandler();
    }

    errorProduct(error, req, res);
  }
};
