const express = require('express');
const userController = require('../controllers/userController');
const checkUserRole = require('../middleware/checkUserRole');

const router = express.Router();

router.post('/check-password', userController.checkPassword);
router.get('/users', userController.getUsers);
router.put('/update/:userId',  userController.updateUser);
router.post('/register',userController.registerUser);

module.exports = router;
