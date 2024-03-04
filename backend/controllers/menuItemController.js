// menuItemController.js

const db = require('../models/db'); // Adjust path if necessary

exports.addMenuItem = async (req, res) => {
    try {
        const { item_name, price, category, subcategory, current_count, minimum_required } = req.body.data;
        if (!item_name || price == null) {
            return res.status(400).json({ message: 'Item name and price are required' });
        }

        // Start a transaction
        await db.query('BEGIN');

        const insertMenuItemQuery = `
            INSERT INTO MenuItems (item_name, price, category, subcategory)
            VALUES ($1, $2, $3, $4)
            RETURNING item_id;
        `;
        const menuItemResult = await db.query(insertMenuItemQuery, [item_name, price, category, subcategory]);
        const newItemId = menuItemResult.rows[0].item_id;

        const insertInventoryQuery = `
            INSERT INTO Inventory (item_id, current_count, minimum_required)
            VALUES ($1, $2, $3);
        `;
        await db.query(insertInventoryQuery, [newItemId, current_count, minimum_required]);

        // Commit the transaction
        await db.query('COMMIT');

        res.status(201).json({ id: newItemId, item_name, price, category, subcategory });
    } catch (error) {
        await db.query('ROLLBACK');
        console.error(error);
        res.status(500).json({ message: 'Error adding menu item' });
    }
};



exports.deleteMenuItem = async (req, res) => {
    try {
        const { itemId } = req.params;
        const deleteQuery = `
            DELETE FROM MenuItems
            WHERE item_id = $1;
        `;
        await db.query(deleteQuery, [itemId]);
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
        const updateQuery = `
            UPDATE MenuItems
            SET item_name = $1, price = $2
            WHERE item_id = $3;
        `;
        await db.query(updateQuery, [item_name, price, itemId]);
        res.status(200).json({ message: 'Menu item updated' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating menu item' });
    }
};
