const mongoose = require('mongoose');

/**
 * User schema
 * Basic structure for authentication.
 * Nothing fancy here — just the essential fields needed
 * for registration and login.
 */

const userSchema = new mongoose.Schema(
  {

    name: {
      type: String,
      required: [true, 'Please add a name'],
      trim: true,
    },


    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email'
      ],
    },

    // Stored as a hashed value
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: 6,
      select: false,              // never return the password by accident
    },
  },
  {
    timestamps: true,             // adds createdAt and updatedAt
  }
);

module.exports = mongoose.model('User', userSchema);
