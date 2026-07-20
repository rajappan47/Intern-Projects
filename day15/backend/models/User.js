const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['Reader', 'Member', 'Admin'],
      default: 'Reader',
    },
    refreshToken: {
      type: String, // Persisted to enable refresh token rotation & logout revocation
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);