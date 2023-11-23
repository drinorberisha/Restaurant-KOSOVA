const db = require('../models/db'); // Adjust the path according to your project structure
exports.createOrder = async (req, res) => {
    try {
        const { tableId, totalPrice, itemsData = [] } = req.body;
        
        if (!Array.isArray(itemsData)) {
            throw new TypeError("itemsData must be an array");
        }

        const newOrder = await db('Orders').insert({
            table_id: tableId,
            total_price: totalPrice
        });

        const orderId = newOrder[0];

        await db('Tables').where('table_id', tableId).update({
            current_order_id: orderId
        });

        // Insert each item into OrderItemMenuItems with order_id and quantity
        for (const { itemId, quantity } of itemsData) {
            await db('OrderItemMenuItems').insert({
                order_id: orderId,
                item_id: itemId,
                quantity: quantity // Include quantity here
            });
        }

        res.status(201).json({ message: 'Order created successfully', orderId: orderId });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Error creating order' });
    }
};


exports.getUnpaidItems = async (req, res) => {
    try {
        const tableId = req.params.tableId;
        let itemsWithQuantities = [];

        // Get all unpaid orders for the specified table
        const unpaidOrders = await db('Orders').where({ table_id: tableId, paid: 0 }).select('order_id');

        for (let order of unpaidOrders) {
            // Get menu item IDs and quantities directly from OrderItemMenuItems for each unpaid order
            const menuItems = await db('OrderItemMenuItems')
                .select('item_id', 'quantity')
                .where('order_id', order.order_id);

            // Add the menu item IDs and quantities to the array
            itemsWithQuantities.push(...menuItems.map(mi => {
                return {
                    itemId: mi.item_id,
                    quantity: mi.quantity
                };
            }));
        }

        res.json(itemsWithQuantities);
    } catch (error) {
        console.error('Error fetching unpaid items:', error);
        res.status(500).send('Internal Server Error');
    }
};

