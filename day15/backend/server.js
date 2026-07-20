require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const User = require('./models/User');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const bookRoutes = require('./routes/books');

const app = express();
app.use(express.json());
app.use(cors());

// Seed Default Admin Account (admin / admin@123)
const seedAdmin = async () => {
  try {
    const adminExists = await User.findOne({ username: 'admin' });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin@123', 10);
      await User.create({
        username: 'admin',
        password: hashedPassword,
        role: 'Admin',
      });
      console.log('Seeded Admin account: admin / admin@123');
    }
  } catch (error) {
    console.error('Error seeding admin:', error.message);
  }
};

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    seedAdmin();
  })
  .catch((err) => console.error('Database connection error:', err));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/books', bookRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));