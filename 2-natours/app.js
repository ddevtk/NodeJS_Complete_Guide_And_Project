const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

const globalErrorHandler = require('./controller/errorController');
const tourRouter = require('./routes/tourRoute');
const userRouter = require('./routes/userRoute');
const appError = require('./utils/appError');

const app = express();

// MIDDLEWARE

// 1) Set security HTTP headers
app.use(helmet());

// 2) Development logging
if (process.env.NODE_ENV === 'development') {
  if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  }
}

// 2) Limit requests from same IP
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP. Please try again in an hour',
});
app.use('/api', limiter);

// 3) Body parser, reading data from body to req.body
app.use(express.json({ limit: '10kb' }));

// 4) Serving static files
app.use(express.static(`${__dirname}/public`));

// 5) Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  res.message = `created at ${new Date().getDay()}`;
  next();
});

//////////////////////
// ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  next(new appError(`Can not find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
