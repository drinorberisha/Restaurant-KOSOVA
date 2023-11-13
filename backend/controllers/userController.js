const db = require('../models/userModel');

exports.checkPassword = async (req, res) => {
    try {
        const { password } = req.body;

        const user = await db.getUserByPassword(password);

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
