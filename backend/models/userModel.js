// userModel.js
const db = require('./db');

exports.getUserByPassword = async (password) => {
    const query = 'SELECT * FROM users WHERE password = $1 LIMIT 1';
    const values = [password];
    
    try {
        const { rows } = await db.query(query, values);
        return rows[0]; // Return the first user that matches the password
    } catch (err) {
        console.error('Error querying the database', err);
        throw err;
    }
};
