const User = require('../users/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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

module.exports = {
    signup,
    login,
    logout,
    logoutAll,
    refreshAccessToken
};