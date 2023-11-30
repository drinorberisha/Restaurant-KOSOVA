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

        // Check for existing order for the table
        const currentOrder = await db('Orders')
            .where({ table_id: tableId, paid: 0 })
            .first();

        if (currentOrder && currentOrder.user_id !== userId) {
            // If there's an existing order by a different user, reject the creation
            return res.status(403).json({ message: 'Kjo tavoline eshte e zene!' });
        }

        // Proceed to create a new order
        const newOrder = await db('Orders').insert({
            table_id: tableId,
            total_price: totalPrice,
            user_id: userId
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
                quantity: quantity
            });
        }

        res.status(201).json({ message: 'Order created successfully', orderId: orderId });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Error creating order' });
    }
};


exports.markOrdersAsPaid = async (req, res) => {
    try {
      const { tableId } = req.params;
      const { userId } = req.body;
  
      // First, check if the user is associated with the unpaid orders
      const orders = await db('Orders')
        .where({ table_id: tableId, paid: 0, user_id: userId });
  
      if (orders.length === 0) {
        return res.status(403).json({ message: 'Nuk mund te kryeni pagesen tek kjo tavoline!' });
      }
  
      // Proceed to mark orders as paid
      await db('Orders')
        .where({ table_id: tableId, paid: 0 })
        .update({ paid: 1 });
  
      await db('Tables').where('table_id', tableId).update({ current_order_id: null });
  
      res.json({ message: 'Orders marked as paid successfully' });
    } catch (error) {
      console.error('Error marking orders as paid:', error);
      res.status(500).send('Internal Server Error');
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

