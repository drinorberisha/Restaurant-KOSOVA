const db = require('../models/db'); // Adjust the path according to your project structure
exports.createOrder = async (req, res) => {
    try {
        const { tableId, totalPrice, itemsData = [], userId } = req.body;

        if (!Array.isArray(itemsData)) {
            throw new TypeError("itemsData must be an array");
        }

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        await db.query('BEGIN'); // Start transaction

        const currentOrderQuery = `
            SELECT * FROM Orders
            WHERE table_id = $1 AND paid = false
            LIMIT 1;
        `;
        const currentOrderResult = await db.query(currentOrderQuery, [tableId]);
        const currentOrder = currentOrderResult.rows[0];

        if (currentOrder && currentOrder.user_id !== userId) {
            return res.status(403).json({ message: 'Kjo tavoline eshte e zene!' });
        }

        const newOrderQuery = `
            INSERT INTO Orders (table_id, total_price, user_id)
            VALUES ($1, $2, $3)
            RETURNING order_id;
        `;
        const newOrderResult = await db.query(newOrderQuery, [tableId, totalPrice, userId]);
        const orderId = newOrderResult.rows[0].order_id;

        const updateTableQuery = `
            UPDATE Tables
            SET current_order_id = $1
            WHERE table_id = $2;
        `;
        await db.query(updateTableQuery, [orderId, tableId]);

        const insertItemsQuery = `
            INSERT INTO OrderItemMenuItems (order_id, item_id, quantity)
            VALUES ($1, $2, $3);
        `;
        for (const { itemId, quantity } of itemsData) {
            await db.query(insertItemsQuery, [orderId, itemId, quantity]);
        }

        await db.query('COMMIT'); // Commit transaction

        res.status(201).json({ message: 'Order created successfully', orderId });
    } catch (error) {
        await db.query('ROLLBACK'); // Rollback transaction on error
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Error creating order' });
    }
};


exports.markOrdersAsPaid = async (req, res) => {
    try {
        const { tableId } = req.params;
        const { userId } = req.body;

        const checkOrdersQuery = `
            SELECT * FROM Orders
            WHERE table_id = $1 AND paid = false AND user_id = $2;
        `;
        const ordersResult = await db.query(checkOrdersQuery, [tableId, userId]);
        if (ordersResult.rows.length === 0) {
            return res.status(403).json({ message: 'Nuk mund te kryeni pagesen tek kjo tavoline!' });
        }

        const markPaidQuery = `
            UPDATE Orders
            SET paid = true
            WHERE table_id = $1 AND paid = false;
        `;
        await db.query(markPaidQuery, [tableId]);

        const clearTableQuery = `
            UPDATE Tables
            SET current_order_id = NULL
            WHERE table_id = $1;
        `;
        await db.query(clearTableQuery, [tableId]);

        res.json({ message: 'Orders marked as paid successfully' });
    } catch (error) {
        console.error('Error marking orders as paid:', error);
        res.status(500).send('Internal Server Error');
    }
};



exports.getUnpaidItems = async (req, res) => {
    try {
        const { tableId } = req.params;
        let itemsWithQuantities = [];

        const unpaidOrdersQuery = `
            SELECT order_id FROM Orders
            WHERE table_id = $1 AND paid = false;
        `;
        const unpaidOrdersResult = await db.query(unpaidOrdersQuery, [tableId]);

        for (let order of unpaidOrdersResult.rows) {
            const menuItemsQuery = `
                SELECT item_id, quantity FROM OrderItemMenuItems
                WHERE order_id = $1;
            `;
            const menuItemsResult = await db.query(menuItemsQuery, [order.order_id]);
            itemsWithQuantities.push(...menuItemsResult.rows.map(mi => ({
                itemId: mi.item_id,
                quantity: mi.quantity
            })));
        }

        res.json(itemsWithQuantities);
    } catch (error) {
        console.error('Error fetching unpaid items:', error);
        res.status(500).send('Internal Server Error');
    }
};

