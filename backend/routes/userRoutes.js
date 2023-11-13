const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

router.post('/check-password', userController.checkPassword);

module.exports = router;
