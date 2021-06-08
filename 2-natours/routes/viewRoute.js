const express = require('express');
const router = express.Router();
const viewController = require('../controller/viewController');
const authController = require('../controller/authController');

router.use(authController.isLoggedIn);

router.get('/', viewController.getOverview);
router.get('/tour/:slug', viewController.getTour);
router.get('/login', viewController.getLoginForm);

module.exports = router;
