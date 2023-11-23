const express = require('express');
const { body, validationResult } = require('express-validator');
const ordersController = require('../controllers/orderController');

const router = express.Router();

router.post('/orders/create', ordersController.createOrder);
router.get('/unpaidItems/:tableId', ordersController.getUnpaidItems);

module.exports = router;
