const express = require('express');
const router = express.Router();
const { signupController, loginController, logoutController, logoutAllController, refreshTokenController} = require('./auth.controller');
const authMiddleware = require('../../middlewares/auth.middleware');
const {authLimiter} = require('../../middlewares/rate-limit.middleware');
const authorizeRoles = require('../../middlewares/role.middleware');
router.post('/register', authLimiter, signupController);
router.post('/login', authLimiter, loginController);
router.post('/logout', authMiddleware, logoutController);
router.post('/logout-all', authMiddleware, logoutAllController);
router.post('/refresh-token', refreshTokenController);
// router.get(
//   '/protected',
//   authMiddleware,
//   (req, res) => {
//     res.json({
//       success: true,
//       message: 'Protected route accessed',
//       user: req.user
//     });
//   }
// );

// router.get(
//   '/admin-test',
//   authMiddleware,
//   authorizeRoles('ADMIN'),
//   (req, res) => {
//     res.json({
//       success: true,
//       message: 'Admin access granted'
//     });
//   }
// );


module.exports = router;