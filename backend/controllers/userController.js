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
