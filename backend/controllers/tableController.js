// controllers/tableController.js

const db = require('../models/db'); // Adjust the path as necessary


exports.getAllTableIds = async (req, res) => {
    try {
        const tables = await db.select('table_id').from('Tables');
        res.json(tables.map(table => table.table_id));
    } catch (error) {
        console.error('Error fetching table IDs:', error);
        res.status(500).send('Error fetching table IDs');
    }
};

exports.getAllTables = async (req, res) => {
    try {
        const tables = await db.select('*').from('Tables');
        res.json(tables);
    } catch (error) {
        console.error('Error fetching table IDs:', error);
        res.status(500).send('Error fetching table IDs');
    }
};

// You can add more functions as needed for other table-related operations
