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
exports.updateTableStatus = async (req, res) => {
    const { tableId, status } = req.body;

    try {
        console.log(`Updating status for tableId: ${tableId} to ${status}`);

        // Check for unpaid orders for the given table
        const unpaidOrders = await db('Orders')
            .where({ table_id: tableId, paid: 0 })
            .select();

        console.log(`Unpaid orders found:`, unpaidOrders);

        if (unpaidOrders.length > 0) {
            // Update the table status
            await db('Tables')
                .where({ table_id: tableId })
                .update({ status: status });

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
    try {
        // Fetch the results from the database
        const results = await db('Orders')
            .where('paid', 0)
            .groupBy('table_id')
            .select('table_id')
            .sum('total_price as total');
        console.log(results);
        // Now use reduce on the fetched results array
        const totals = results.reduce((acc, item) => {
            acc[item.table_id] = item.total;
            return acc;
        }, {});
        console.log(totals);

        res.json(totals);
    } catch (error) {
        console.error('Error calculating unpaid totals:', error);
        res.status(500).send('Error calculating unpaid totals');
    }
};



// You can add more functions as needed for other table-related operations
