const express = require('express');
const morgan = require('morgan');

const globalErrorHandler = require('./controller/errorController');
const tourRouter = require('./routes/tourRoute');
const userRouter = require('./routes/userRoute');
const appError = require('./utils/appError');

const app = express();

// MIDDLEWARE
if (process.env.NODE_ENV === 'development') {
  if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  }
}
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  res.message = `created at ${new Date().getDay()}`;
  next();
});

//////////////////////
// ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/user', userRouter);

app.all('*', (req, res, next) => {
  next(new appError(`Can not find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
