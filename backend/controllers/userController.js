const dbuser = require('../models/userModel');
const db = require('../models/db'); // Adjust the path if necessary
const bcrypt = require('bcrypt');
const saltRounds = 10;


exports.checkPassword = async (req, res) => {
  try {
      const { password } = req.body;

      // Fetch all hashed passwords from the database (Not recommended for real applications)
      const query = `SELECT * FROM users;`;
      const { rows } = await db.query(query);

      // Attempt to find a user with a matching password
      let userMatch = null;
      for (let user of rows) {
          const match = await bcrypt.compare(password, user.password);
          if (match) {
              userMatch = user;
              break;
          }
      }

      if (!userMatch) {
          return res.status(400).json({ message: 'Incorrect password' });
      }

      const { password: _, ...userWithoutPassword } = userMatch; // Exclude password from user object
      return res.status(200).json(userWithoutPassword);
  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
  }
};


exports.getUsers = async (req, res) => {
  try {
      const query = `SELECT * FROM users;`;
      const { rows } = await db.query(query);
      res.json(rows);
  } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).send('Server error');
  }
};


exports.updateUser = async (req, res) => {
  try {
      const userId = req.params.userId;
      const updates = req.body;
      const fields = Object.keys(updates);
      const values = Object.values(updates);
      const setClause = fields.map((field, index) => `${field} = $${index + 1}`).join(', ');

      const query = `UPDATE users SET ${setClause} WHERE user_id = $${fields.length + 1};`;
      await db.query(query, [...values, userId]);

      res.status(200).json({ message: 'User updated successfully' });
  } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).send('Server error');
  }
};

exports.registerUser = async (req, res) => {
  try {
      const { first_name, last_name, username, password, role, status } = req.body;

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const query = `INSERT INTO users (first_name, last_name, username, password, role, status) VALUES ($1, $2, $3, $4, $5, $6);`;
      await db.query(query, [first_name, last_name, username, hashedPassword, role, status]);

      res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
      console.error('Error registering user:', error);
      res.status(500).send('Server error');
  }
};

exports.getUserByTableId = async (req, res) => {
  const { tableId } = req.params;
  try {
      const orderQuery = `SELECT user_id FROM Orders WHERE table_id = $1 AND paid = 0 LIMIT 1;`;
      const orderResult = await db.query(orderQuery, [tableId]);
      const order = orderResult.rows[0];

      if (!order || !order.user_id) {
          return res.status(404).json({ message: 'No active orders or user found for this table' });
      }

      const userQuery = `SELECT * FROM users WHERE user_id = $1;`;
      const userResult = await db.query(userQuery, [order.user_id]);
      const user = userResult.rows[0];

      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      res.json(user);
  } catch (error) {
      console.error('Error fetching user for table:', error);
      res.status(500).json({ message: 'Error fetching user for table' });
  }
};


