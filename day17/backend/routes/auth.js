const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// 1. User Registration API
router.post('/register', async (req, res) => {
  try {
    const { username, password, confirmpassword } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required.' });
    }

    if(password !== confirmpassword)
    {
      return res.status(400).json({message:' password does not match'})
    }


    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists.' });
    }

    // Bcrypt Password Hashing
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      password: hashedPassword,
      role: 'Reader', // Assigned Reader by default
    });

    res.status(201).json({ message: 'User registered successfully with Reader role.' });
  } catch (error) {
    res.status(500).json({ message: 'Error during user registration.' });
  }
});

// 2. Login API (Generates JWT with 1-hour expiry)
// Login API
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required.' });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid username or password.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid username or password.' });
    }

    // Check JWT Secret
    if (!process.env.JWT_SECRET) {
      console.error('FATAL ERROR: JWT_SECRET is not defined in .env file!');
      return res.status(500).json({ message: 'Server configuration error.' });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      token,
      user: { id: user._id, username: user.username, role: user.role },
    });
  } catch (error) {
    // THIS WILL PRINT THE EXACT CRASH REASON IN YOUR TERMINAL
    console.error('LOGIN ERROR DETAILS:', error);
    res.status(500).json({ message: 'Error during user login.', details: error.message });
  }
});

module.exports = router;