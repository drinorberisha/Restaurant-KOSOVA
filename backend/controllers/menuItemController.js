// menuItemController.js

const db = require('../models/db'); // Adjust path if necessary

exports.addMenuItem = async (req, res) => {
    try {
        const { item_name, price } = req.body;
        const newItem = await db('MenuItems').insert({ item_name, price });
        res.status(201).json({ id: newItem[0], item_name, price });
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
