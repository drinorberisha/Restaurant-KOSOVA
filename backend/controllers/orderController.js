const db = require('../models/db'); // Adjust the path according to your project structure

exports.createOrder = async (req, res) => {
    try {
        const { tableId, totalPrice } = req.body;

        // Insert a new order into the Orders table
        const newOrder = await db('Orders').insert({
            table_id: tableId,
            total_price: totalPrice
        });

        // Update the current_order_id in the Tables table
        await db('Tables').where('table_id', tableId).update({
            current_order_id: newOrder[0]
        });

        res.status(201).json({ message: 'Order created successfully', orderId: newOrder[0] });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Error creating order' });
    }
};