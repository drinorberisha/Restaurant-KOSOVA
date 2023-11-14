// database.js

const knex = require('knex');

const db = knex({
    client: 'sqlite3',
    connection: {
        filename: "../restaurant-Kosova.db"
    },
    useNullAsDefault: true
});

module.exports = db;
