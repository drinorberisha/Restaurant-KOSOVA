// inventoryController.js

const db = require('../models/db'); // Adjust path if necessary

exports.addInventoryItem = async (req, res) => {
    try {
        const { item_id, current_count, minimum_required } = req.body;
        const newInventoryItem = await db('Inventory').insert({ item_id, current_count, minimum_required });
        res.status(201).json({ id: newInventoryItem[0], item_id, current_count, minimum_required });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error adding inventory item' });
    }
};
exports.getInventoryItems = async (req, res) => {
    try {
        // Select specific columns including category and subcategory
        const items = await db.select(
                'Inventory.inventory_id',
                'Inventory.item_id',
                'Inventory.current_count',
                'Inventory.minimum_required',
                'MenuItems.item_name',
                'MenuItems.price',
                'MenuItems.category',
                'MenuItems.subcategory' 
            )
            .from('Inventory')
            .join('MenuItems', 'Inventory.item_id', '=', 'MenuItems.item_id');

        res.json(items);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching inventory items');
    }
};


exports.editInventoryItem = async (req, res) => {
    try {
        const { inventoryId } = req.params;
        const { updates } = req.body; // Destructuring to get the updates object

        // Check if there are any updates provided
        if (!updates || Object.keys(updates).length === 0) {
            return res.status(400).json({ message: 'No updates provided' });
        }

        // Perform the update operation
        await db('Inventory').where('inventory_id', inventoryId).update(updates);
        res.status(200).json({ message: 'Inventory item updated' });


    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating inventory item' });
    }
};

