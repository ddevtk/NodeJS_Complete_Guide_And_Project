const express = require('express');
const authController = require('../controller/authController');
const bookingController = require('../controller/bookingController');
const router = express.Router();

router.get(
  '/checkout-session/:tourID',
  authController.protect,
  bookingController.getCheckout
);

module.exports = router;
