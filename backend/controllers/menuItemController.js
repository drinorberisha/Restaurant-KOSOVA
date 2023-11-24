// menuItemController.js

const db = require('../models/db'); // Adjust path if necessary

exports.addMenuItem = async (req, res) => {
    try {
        const { item_name, price, category, subcategory, current_count, minimum_required} = req.body.data;
        if (!item_name || price == null) {
            return res.status(400).json({ message: 'Item name, price, category, and subcategory are required' });
        }
        const newItem = await db('MenuItems').insert({ item_name, price, category, subcategory });
        const newItemId = newItem[0];

        // Add corresponding entry in Inventory table
        await db('Inventory').insert({
            item_id: newItemId,
            current_count: current_count,
            minimum_required: minimum_required
        });

        res.status(201).json({ id: newItemId, item_name, price, category, subcategory });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error adding menu item' });
    }
};



exports.deleteMenuItem = async (req, res) => {
    try {
        const { itemId } = req.params;
        await db('MenuItems').where('item_id', itemId).del();
        res.status(200).json({ message: 'Menu item deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting menu item' });
    }
};

exports.editMenuItem = async (req, res) => {
    try {
        const { itemId } = req.params;
        const { item_name, price } = req.body;
        await db('MenuItems').where('item_id', itemId).update({ item_name, price });
        res.status(200).json({ message: 'Menu item updated' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating menu item' });
    }
};
