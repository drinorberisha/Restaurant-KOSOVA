// controllers/tableController.js

const db = require('../models/db'); // Adjust the path as necessary


exports.getAllTableIds = async (req, res) => {
    const query = `SELECT table_id FROM Tables;`;

    try {
        const { rows } = await db.query(query);
        res.json(rows.map(table => table.table_id));
    } catch (error) {
        console.error('Error fetching table IDs:', error);
        res.status(500).send('Error fetching table IDs');
    }
};


exports.getAllTables = async (req, res) => {
    const query = `SELECT * FROM Tables;`;

    try {
        const { rows } = await db.query(query);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching tables:', error);
        res.status(500).send('Error fetching tables');
    }
};

exports.updateTableStatus = async (req, res) => {
    const { tableId, status } = req.body;
    const checkOrdersQuery = `SELECT * FROM Orders WHERE table_id = $1 AND paid = false;`;

    try {
        const unpaidOrdersResult = await db.query(checkOrdersQuery, [tableId]);

        if (unpaidOrdersResult.rows.length > 0) {
            const updateTableQuery = `UPDATE Tables SET status = $1 WHERE table_id = $2;`;
            await db.query(updateTableQuery, [status, tableId]);
            res.status(200).json({ message: "Table status updated successfully." });
        } else {
            res.status(400).json({ message: "No unpaid orders for this table or table is already busy." });
        }
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};


exports.calculateUnpaidTotals = async (req, res) => {
    const query = `
        SELECT table_id, SUM(total_price) AS total
        FROM Orders
        WHERE paid = false
        GROUP BY table_id;
    `;

    try {
        const { rows } = await db.query(query);
        const totals = rows.reduce((acc, item) => {
            acc[item.table_id] = item.total;
            return acc;
        }, {});

        res.json(totals);
    } catch (error) {
        console.error('Error calculating unpaid totals:', error);
        res.status(500).send('Error calculating unpaid totals');
    }
};



// You can add more functions as needed for other table-related operations
