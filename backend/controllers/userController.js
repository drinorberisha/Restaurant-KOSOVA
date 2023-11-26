const dbuser = require('../models/userModel');
const db = require('../models/db'); // Adjust the path if necessary


exports.checkPassword = async (req, res) => {
    try {
        const { password } = req.body;

        const user = await dbuser.getUserByPassword(password);

        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        if (user.password !== password) { 
            return res.status(400).json({ message: 'Incorrect password' });
        }
        const { password: _, ...userWithoutPassword } = user;
        return res.status(200).json(userWithoutPassword);
    } catch (error) {
        console.error(error); // This will log the error to the console
        return res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getUsers = async (req, res) => {
    try {
        const users = await db.select('*').from('users');
        res.json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).send('Server error');
    }
  };


  exports.updateUser = async (req, res) => {
    try {
      const userId = req.params.userId;
      const updates = req.body;
  
      // Perform validation on updates if necessary
  
      await db('users') 
        .where({ user_id: userId })
        .update(updates);
  
      res.status(200).json({ message: 'User updated successfully' });
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).send('Server error');
    }
  };
  exports.registerUser = async (req, res) => {
    try {
      const { first_name, last_name, username, password, role, status } = req.body;
  
      // Perform necessary validations (e.g., check if username already exists)
  
  
      await db('users').insert({
        first_name,
        last_name,
        username,
        password,
        role,
        status
      });
  
      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      console.error('Error registering user:', error);
      res.status(500).send('Server error');
    }
  };

  exports.getUserByTableId = async (req, res) => {
    const { tableId } = req.params;
    try {
      // First, get the user_id associated with the active order for this table
      const order = await db('Orders')
          .select('user_id')
          .where({ table_id: tableId, paid: 0 })
          .first();

      if (!order || !order.user_id) {
          return res.status(404).json({ message: 'No active orders or user found for this table' });
      }

      // Then, fetch the entire user object using the user_id
      const user = await db('users')
          .where({ user_id: order.user_id })
          .first();

      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      res.json(user);
  } catch (error) {
      console.error('Error fetching user for table:', error);
      res.status(500).json({ message: 'Error fetching user for table' });
  }
};


