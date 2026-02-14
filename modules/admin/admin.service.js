const User = require('../users/user.model');

const sanitizeUser = (user) => ({
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
            isDeleted: user.isDeleted
        });
const getAllUsers = async (query) => {

    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;

    const skip = (page - 1) * limit;

    const users = await User.find()
        .skip(skip)
        .limit(limit);

    const total = await User.countDocuments();

    return {
        data: users.map(sanitizeUser),
        meta: {
            total,
            page,
            totalPages: Math.ceil(total / limit)
        }
    };
};

const updateUser = async (userId, updates) => {

    const allowed = ['name', 'email', 'role', 'avatar'];
    const safeUpdates = {};

    allowed.forEach(field => {
        if (updates[field] !== undefined) {
            safeUpdates[field] = updates[field];
        }
    });

    const user = await User.findByIdAndUpdate(
        userId,
        safeUpdates,
        { new: true, runValidators: true }
    );

    if (!user) throw new Error('User not found');

    return sanitizeUser(user);
};

const softDeleteUser = async (userId) => {
    await User.findByIdAndUpdate(userId, {
        isDeleted: true,
        deletedAt: new Date(),
        refreshTokens: []
    });
};

const restoreUser = async (userId) => {
    await User.findByIdAndUpdate(userId, {
        isDeleted: false,
        deletedAt: null
    });
};

module.exports = {
    getAllUsers,
    updateUser,
    softDeleteUser,
    restoreUser
};