const adminService = require('./admin.service');


// GET PAGINATED USERS
const getAllUsers = async (req, res, next) => {
  try {
    const users = await adminService.getAllUsers(req.query);

    res.status(200).json({
      success: true,
      ...users
    });

  } catch (error) {
    next(error);
  }
};


// UPDATE USER
const updateUser = async (req, res, next) => {
  try {
    const user = await adminService.updateUser(
      req.params.id,
      req.body
    );

    res.status(200).json({
      success: true,
      user
    });

  } catch (error) {
    next(error);
  }
};


// SOFT DELETE USER
const softDeleteUser = async (req, res, next) => {
  try {
    await adminService.softDeleteUser(req.params.id);

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });

  } catch (error) {
    next(error);
  }
};


// RESTORE USER
const restoreUser = async (req, res, next) => {
  try {
    await adminService.restoreUser(req.params.id);

    res.status(200).json({
      success: true,
      message: 'User restored successfully'
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUsers,
  updateUser,
  softDeleteUser,
  restoreUser
};
