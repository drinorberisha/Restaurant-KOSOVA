// routes/tableRoutes.js

const express = require('express');
const tableController = require('../controllers/tableController');
const router = express.Router();

// POST request to create a new order
router.get('/tables/getAllTableIds', tableController.getAllTableIds);
router.get('/tables/getAllTables', tableController.getAllTables);
router.put('/tables/updateStatus',tableController.updateTableStatus);
// Assuming you are using Express.js
router.get('/tables/unpaidTotals', tableController.calculateUnpaidTotals);



// You can add more routes for other table-related operations

module.exports = router;
