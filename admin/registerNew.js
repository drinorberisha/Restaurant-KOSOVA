const sqlite3 = require('sqlite3').verbose();

export default function registerUser(firstName, lastName, username, password, role, callback) {
    // Create a database connection
    let db = new sqlite3.Database('./path_to_your_database.db', sqlite3.OPEN_READWRITE, (err) => {
        if (err) {
            console.error(err.message);
            callback(err);
            return;
        }
        console.log('Connected to the database.');
    });

    // Check if the username already exists
    let checkSql = `SELECT username FROM users WHERE username = ?`;
    db.get(checkSql, [username], (err, row) => {
        if (err) {
            callback(err);
            return;
        }

        if (row) {
            callback(new Error('Username already exists.'));
            return;
        }

        // If the username doesn't exist, insert the new user
        let insertSql = `INSERT INTO users (first_name, last_name, username, password, role) VALUES (?, ?, ?, ?, ?)`;
        db.run(insertSql, [firstName, lastName, username, password, role], (err) => {
            if (err) {
                callback(err);
                return;
            }
            console.log('New user registered.');
            callback(null, 'User registered successfully!');
        });
    });

    // Close the database connection
    db.close((err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Closed the database connection.');
    });
}

// Example usage
// registerUser('John', 'Doe', 'johndoe', 'samplePassword', 'waiter', (err, message) => {
//     if (err) {
//         console.error(err.message);
//     } else {
//         console.log(message);
//     }
// });
