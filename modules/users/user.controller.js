const userService = require('./user.service');

const sanitizeUser = (user) => ({
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar
});

const getMyProfile = async (req, res, next) => {
    try {
        const user = await userService.getMyProfile(req.user.id);

        res.status(200).json({
            success: true,
            user: sanitizeUser(user)
        });

    } catch (error) {
        next(error);
    }
};

const updateMyProfile = async (req, res, next) => {
    try {
        const updateData = {
            ...req.body
        };

        if (req.file) {
            updateData.avatar =
                `/uploads/avatars/${req.file.filename}`;
        }
        const user = await userService.updateMyProfile(
            req.user.id,
            updateData
        );

        res.status(200).json({
            success: true,
            user: sanitizeUser(user),
        });

    } catch (error) {
        next(error);
    }
};

const deleteMyAccount = async (req, res, next) => {
    try {
        await userService.deleteMyAccount(req.user.id);

        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');

        res.status(200).json({
            success: true,
            message: 'Account deleted successfully'
        });

    } catch (error) {
        next(error);
    }
};

module.exports = {
    getMyProfile,
    updateMyProfile,
    deleteMyAccount
};
