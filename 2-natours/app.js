const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoute');
const userRouter = require('./routes/userRoute');

const app = express();

// MIDDLEWARE
app.use(express.json());
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  res.message = `created at ${new Date().getDay()}`;
  next();
});

//////////////////////
// ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/user', userRouter);

module.exports = app;
