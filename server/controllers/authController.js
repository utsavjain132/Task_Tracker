const User = require('../models/User');
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/generateToken');

const registerUser = async (req, res) => {
  console.log('Register request received:', req.body.email);

  try {
    const { name, email, password } = req.body;

    console.log('Checking if user already exists...');
    const userExists = await User.findOne({ email });

    if (userExists) {
      console.log('Registration failed: User already exists');
      return res.status(400).json({ message: 'User already exists' });
    }

    console.log('Hashing password...');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    console.log('Creating user in database...');
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    if (user) {
      console.log('New user created:', user.email);

      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      console.log('User creation returned null — unexpected');
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Error in registerUser:', error.message);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

const loginUser = async (req, res) => {
  console.log('Login attempt:', req.body.email);

  try {
    const { email, password } = req.body;

    console.log('Fetching user from DB...');
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      console.log('Login failed: Email not found');
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    console.log('Comparing passwords...');
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      console.log('Login successful for:', user.email);
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      console.log('Password mismatch for:', email);
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Error in loginUser:', error.message);
    res.status(500).json({ message: 'Server error during login' });
  }
};

const getUserProfile = async (req, res) => {
  console.log('Fetching profile for user:', req.user?._id);

  try {
    const user = await User.findById(req.user._id);

    if (user) {
      console.log('Profile fetched for:', user.email);
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
      });
    } else {
      console.log('User not found for ID:', req.user._id);
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error in getUserProfile:', error.message);
    res.status(500).json({ message: 'Server error fetching profile' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
};
