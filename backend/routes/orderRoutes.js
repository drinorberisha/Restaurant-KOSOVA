const express = require('express');
const { body, validationResult } = require('express-validator');
const ordersController = require('../controllers/orderController');

const router = express.Router();

router.post('/orders/create', ordersController.createOrder);

module.exports = router;
