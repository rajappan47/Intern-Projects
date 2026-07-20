const express = require('express');
const User = require('../models/User');
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');

const router = express.Router();

// View all users (Admin Only)
router.get('/', verifyToken, authorizeRoles('Admin'), async (req, res) => {
  try {
    const users = await User.find({}, '-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users.' });
  }
});

// Update user role (Admin Only)
router.put('/:id/role', verifyToken, authorizeRoles('Admin'), async (req, res) => {
  try {
    const { role } = req.body;
    if (!['Reader', 'Member', 'Admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role provided.' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, select: '-password' }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.json({ message: 'Role updated successfully.', user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update role.' });
  }
});

module.exports = router;