const express = require('express');
const router = express.Router();

const authMiddleware = require('../../middlewares/auth.middleware');
const authorizeRoles = require('../../middlewares/role.middleware');

const {
  getAllUsers,
  updateUser,
  softDeleteUser,
  restoreUser
} = require('./admin.controller');


// ALL ADMIN ROUTES PROTECTED
router.get(
  '/users',
  authMiddleware,
  authorizeRoles('ADMIN'),
  getAllUsers
);

router.patch(
  '/users/:id',
  authMiddleware,
  authorizeRoles('ADMIN'),
  updateUser
);

router.delete(
  '/users/:id',
  authMiddleware,
  authorizeRoles('ADMIN'),
  softDeleteUser
);

router.patch(
  '/users/:id/restore',
  authMiddleware,
  authorizeRoles('ADMIN'),
  restoreUser
);

module.exports = router;
