const User = require('../users/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const emailQueue = require('../../queue/email.queue');

const signup = async(data) => {
    const { name, email, password } = data;

    if(!name || !email || !password) {
        throw new Error('Name, email, and password are required');
    }

    if(password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new Error('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();
    return { message: 'User registered successfully', user: { id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role } };
}

const login = async(data) => {
    const { email, password } = data;

    if(!email || !password) {
        throw new Error('Email and password are required');
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user || user.isDeleted) {
        throw new Error('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Invalid email or password');
    }

    const accessToken = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ userId: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '1d' });

    user.refreshTokens.push({ token: refreshToken, expiresAt: new Date(Date.now() + 24*60*60*1000) });
    await user.save();
    return { accessToken, refreshToken, user: { id: user._id, name: user.name, email: user.email, role: user.role } };
}

const logout = async(refreshToken) => {
    if (!refreshToken) {
        throw new Error('Refresh token is required');
    }

    const user = await User.findOne({ 'refreshTokens.token': refreshToken });
    if (!user) {
        throw new Error('Logout failed');
    }

    user.refreshTokens = user.refreshTokens.filter(rt => rt.token !== refreshToken);
    await user.save();
    return { message: 'Logout successful' };
}

const logoutAll = async(userId) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }

    user.refreshTokens = [];
    await user.save();
    return { message: 'Logout from all devices successful' };
}

const refreshAccessToken = async(refreshToken) => {

    const user = await User.findOne({ 'refreshTokens.token': refreshToken });
    if (!user || user.isDeleted) {
        throw new Error('Invalid refresh token');
    }
    const tokenData = user.refreshTokens.find(rt => rt.token === refreshToken);
    if (!tokenData || tokenData.expiresAt < new Date()) {
        throw new Error('Refresh token expired');
    }

    const newAccessToken = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '15m' });
    return { accessToken: newAccessToken };
}

const forgotPassword = async (email) => {
    try {
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error('User not found');
        }
        const resetToken = crypto.randomBytes(32).toString('hex');

        const hashedResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.passwordResetToken = hashedResetToken;
        user.passwordResetExpires = Date.now() + 3600000; // 1 hour

        await user.save();

        const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
        await emailQueue.add({
            to: user.email,
            subject: 'Password Reset Request',
            text: `You requested a password reset. Click the link to reset your password: ${resetUrl}`
        },
        {
            attempts: 3,
            backoff: 5000
        }); 
        console.log(`Password reset token (send via email): ${resetUrl}`);
    } catch (error) {
        throw error;
    }
};

const resetPassword = async (token, newPassword) => {
    try {
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        const user = await User.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpires: { $gt: Date.now() }
        }).select('+password');

        if (!user) {
            throw new Error('Invalid or expired password reset token');
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.passwordResetToken = null;
        user.passwordResetExpires = null;

        user.refreshTokens = [];

        await user.save();
    } catch (error) {
        throw error;
    }
};

module.exports = {
    signup,
    login,
    logout,
    logoutAll,
    refreshAccessToken,
    forgotPassword,
    resetPassword
};