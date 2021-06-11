const express = require('express');

const authController = require('../controller/authController');
const bookingController = require('../controller/bookingController');

const router = express.Router();

router.use(authController.protect);

router.get(
  '/checkout-session/:tourID',
  authController.protect,
  bookingController.getCheckout
);
router.use(authController.restrictTo('admin', 'lead-guide'));

router
  .route('/')
  .get(bookingController.getAllBookings)
  .post(bookingController.createBooking);

router
  .route('/:id')
  .patch(bookingController.updateBooking)
  .delete(bookingController.deleteBooking)
  .get(bookingController.getBooking);

module.exports = router;
