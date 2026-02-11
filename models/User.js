const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserRoles = Object.freeze({
    ADMIN: "admin",
    USER: "user",
});

const userSchema = new mongoose.Schema(
    {
        googleId: {
            type: String,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true
        },
        password: {
            type: String,
            required: false,
        },
        role: {
            type: String,
            enum: Object.values(UserRoles),
            default: UserRoles.USER,
            required: true,
        },
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: function() {
                // lastName is required for email signups but optional for Google OAuth
                return this.signupMethod !== 'google';
            },
            default: ''
        },
        phone: {
            type: String,
            required: true,
        },
        isActive: {
            type: Boolean,
            required: true,
            default: true,
        },
        isBlocked: {
            type: Boolean,
            required: true,
            default: false,
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        profileImage: {
            type: String,
            default: "/images/default-profile.png",
        },
        signupMethod: {
            type: String,
            enum: ["email", "google"],
            required: true,
            default: "email",
        },
        wallet: {
            type: Number,
            default: 0,
        },
        referralCode: {
            type: String,
            unique: true,
            sparse: true  // This allows multiple null values
        },
        referredBy: {
            type: String,
            default: null
        },
        referralEarnings: {
            type: Number,
            default: 0
        },
        isReferralRewarded: {
            type: Boolean,
            default: false
        }, // avoid double reward
    },
    {
        timestamps: true,
    }
);

// Hash password before saving
userSchema.pre('save', async function() {
    if (!this.isModified('password')) return;
    if (this.password) {
        this.password = await bcrypt.hash(this.password, 10);
    }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
