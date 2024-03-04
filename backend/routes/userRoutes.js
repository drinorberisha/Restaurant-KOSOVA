const express = require('express');
const userController = require('../controllers/userController');
const checkUserRole = require('../middleware/checkUserRole');

const router = express.Router();

router.get('/users', userController.getUsers);
router.put('/update/:userId',  userController.updateUser);
router.post('/register',userController.registerUser);
router.get('/users/:tableId/user', userController.getUserByTableId);


module.exports = router;
