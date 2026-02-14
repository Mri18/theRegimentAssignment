const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middlewares/auth.middleware');
const { getMyProfile, updateMyProfile, deleteMyAccount } = require('./user.controller');
const uploadAvatar = require('../../middlewares/upload.middleware');
router.get('/me', authMiddleware, getMyProfile);
router.patch('/me', authMiddleware, uploadAvatar.single('avatar'), updateMyProfile);
router.delete('/me', authMiddleware, deleteMyAccount);

module.exports = router;