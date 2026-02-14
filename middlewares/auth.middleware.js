const jwt = require('jsonwebtoken');
const User = require('../modules/users/user.model');

const authMiddleware = async (req, res, next) => {
  try {
    const token =
      req.cookies.accessToken ||
      req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token missing'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId);

    if (!user || user.isDeleted) {
      return res.status(401).json({
        success: false,
        message: 'User not authorized'
      });
    }

    req.user = {
      id: user._id,
      role: user.role
    };

    next();

  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

module.exports = authMiddleware;
