const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
name: {type: String, required: true, }, 
email: { type: String, required: true, unique: true, lowercase: true, trim: true}, 
password: { type: String, required: true, select: false, }, 
role: { type: String, enum: ['USER', 'ADMIN'], default: 'USER', },
isDeleted: { type: Boolean, default: false, },
deletedAt: { type: Date, default: null, },
refreshTokens: [{ token: { type: String, required: true }, createdAt: { type: Date, default: Date.now }, expiresAt: { type: Date, required: true }, }],
passwordResetToken: { type: String, default: null, },
passwordResetExpires: { type: Date, default: null, },
avatar: { type: String, default: null, },
}, { timestamps: true });

userSchema.index({ email: 1, isDeleted: 1 });
const User = mongoose.model('User', userSchema);
module.exports = User;