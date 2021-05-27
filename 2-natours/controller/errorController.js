const appError = require('../utils/appError');

// Handle error DB
const errorDBHandler = (err) => {
  console.log('Error');
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

// Error with env = development
const errorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

// Error with env = production
const errorProduct = (err, res) => {
  // Operational Error
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
    // Programming Error
  } else {
    // 1) Log error to console
    console.error('ERROR 💥💥💥', err);

    // 2) Send message
    res.status(500).json({
      status: 'error',
      message: 'Some thing went wrong !!!',
    });
  }
};

// Error controller
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    errorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };

    if (err.name === 'CastError') {
      error = errorDBHandler(err);
    }
    if (err.code === 11000) {
      error = errorDuplicateHandler(err);
    }
    if (err.name === 'ValidationError') {
      error = errorValidationHandler(err);
    }

    errorProduct(error, res);
  }
};
