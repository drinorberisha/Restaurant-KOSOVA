// userModel.js

const db = require('./db'); // Adjust the path if necessary

exports.getUserByPassword = async (password) => {
    return await db('users').where({ password }).first();
};
