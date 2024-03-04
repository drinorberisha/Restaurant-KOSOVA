// inventoryController.js

const db = require('../models/db'); // Adjust path if necessary

exports.addInventoryItem = async (req, res) => {
    try {
        const { item_id, current_count, minimum_required } = req.body;
        // Use .returning() to get the inserted id directly for PostgreSQL
        const [newInventoryItemId] = await db('Inventory')
            .insert({ item_id, current_count, minimum_required })
            .returning('inventory_id');
        res.status(201).json({ id: newInventoryItemId, item_id, current_count, minimum_required });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error adding inventory item' });
    }
};
exports.getInventoryItems = async (req, res) => {
    const query = `
        SELECT
            Inventory.inventory_id,
            Inventory.item_id,
            Inventory.current_count,
            Inventory.minimum_required,
            MenuItems.item_name,
            MenuItems.price,
            MenuItems.category,
            MenuItems.subcategory
        FROM Inventory
        JOIN MenuItems ON Inventory.item_id = MenuItems.item_id;
    `;

    try {
        const { rows } = await db.query(query);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching inventory items');
    }
};


exports.editInventoryItem = async (req, res) => {
    const { inventoryId } = req.params;
    const updates = req.body; // Assuming this is an object with column names as keys

    // Check if there are any updates provided
    if (!updates || Object.keys(updates).length === 0) {
        return res.status(400).json({ message: 'No updates provided' });
    }

    const setClause = Object.keys(updates)
        .map((key, index) => `"${key}" = $${index + 1}`)
        .join(', ');
    const values = Object.values(updates);

    const query = `
        UPDATE Inventory
        SET ${setClause}
        WHERE inventory_id = $${values.length + 1}
        RETURNING *;
    `;

    try {
        const { rows } = await db.query(query, [...values, inventoryId]);
        if (rows.length > 0) {
            res.status(200).json({ message: 'Inventory item updated', item: rows[0] });
        } else {
            res.status(404).json({ message: 'Inventory item not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating inventory item' });
    }
};


