const express = require('express');
const { body, validationResult } = require('express-validator');
const checkUserRole = require('../middleware/checkUserRole');
const inventoryController = require('../controllers/inventoryController');
const menuItemController = require('../controllers/menuItemController');

const router = express.Router();

// Menu item routes
router.post('/menuitems/add', 
  [body('item_name').notEmpty().withMessage('Item name is required'), 
   body('price').isFloat({ gt: 0 }).withMessage('Price must be a positive number')],
   checkUserRole(['admin', 'manager']),
  menuItemController.addMenuItem);

router.delete('/menuitems/delete/:itemId', menuItemController.deleteMenuItem);


router.put('/menuitems/edit/:itemId', menuItemController.editMenuItem);

// Inventory routes
router.post('/inventory/add', inventoryController.addInventoryItem);
router.put('/inventory/edit/:inventoryId', inventoryController.editInventoryItem);

module.exports = router;
