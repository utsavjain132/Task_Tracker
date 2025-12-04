const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // Check for Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Extract token
      token = req.headers.authorization.split(' ')[1];
      console.log('Auth middleware: token received');

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Auth middleware: token decoded, user id =', decoded.id);

      // Fetch user associated with token
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        console.log('Auth middleware: user not found in database');
        return res.status(401).json({ message: 'Not authorized, user does not exist' });
      }

      req.user = user;
      return next();
    } catch (error) {
      console.error('Auth middleware error:', error.message);
      return res.status(401).json({ message: 'Not authorized, token invalid or expired' });
    }
  }

  // No token found
  console.log('Auth middleware: no token provided');
  return res.status(401).json({ message: 'Not authorized, no token' });
};

module.exports = { protect };
