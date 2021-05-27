// Error with env = development
const errorDev = (res, err) => {
  res.status(err.statusCode).json({
    error: err,
    stack: err.stack,
    status: err.status,
    message: err.message,
  });
};

// Error with env = product
const errorProduct = (res, err) => {
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
    errorDev(res, err);
  } else if (process.env.NODE_ENV === 'production') {
    errorProduct(res, err);
  }
};
