// userModel.js

const db = require('./db'); 

exports.getUserByPassword = async (password) => {
    return await db('users').where({ password }).first();
};
