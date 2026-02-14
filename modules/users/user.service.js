const User = require('./user.model');


// GET PROFILE
const getMyProfile = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error('User not found');
  }

  return user;
};

const updateMyProfile = async (userId, updateData) => {

  const allowedUpdates = ['name', 'email', 'avatar'];
  const updates = {};

  allowedUpdates.forEach(field => {
    if (updateData[field] !== undefined) {
      updates[field] = updateData[field];
    }
  });

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    updates,
    {
      new: true,
      runValidators: true
    }
  );

  if (!updatedUser) {
    throw new Error('User not found');
  }

  return updatedUser;
};


const deleteMyAccount = async (userId) => {

  const user = await User.findById(userId);

  if (!user) {
    throw new Error('User not found');
  }

  user.isDeleted = true;
  user.deletedAt = new Date();
  user.refreshTokens = [];

  await user.save();
};

module.exports = {
  getMyProfile,
  updateMyProfile,
  deleteMyAccount
};