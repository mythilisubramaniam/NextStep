const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const addressSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    label: {
        type: String,
        trim: true
    },
    type: {
        type: String,
        enum: ['HOME', 'WORK', 'OTHER'],
        default: 'HOME'
    },
    house_number: {
        type: String,
        required: true,
        trim: true
    },
    locality: {
        type: String,
        required: true,
        trim: true
    },
    street: {
        type: String,
        trim: true
    },
    city: {
        type: String,
        required: true,
        trim: true
    },
    state: {
        type: String,
        required: true,
        trim: true
    },
    pincode: {
        type: String,
        required: true,
        trim: true
    },
    phone_number: {
        type: String,
        required: true,
        trim: true
    },
    isDefault: {
        type: Boolean,
        default: false
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
});

// Automatically set first address as default
addressSchema.pre('save', async function(next) {
    if (this.isNew) {
        const Address = this.constructor;
        const count = await Address.countDocuments({ user_id: this.user_id });
        
        // If this is the first address, make it default
        if (count === 0) {
            this.isDefault = true;
        }
    }
    
    // Update the updated_at timestamp
    this.updated_at = Date.now();
    next();
});

// If setting an address as default, unset other defaults for this user
addressSchema.pre('save', async function(next) {
    if (this.isDefault && this.isModified('isDefault')) {
        const Address = this.constructor;
        await Address.updateMany(
            { user_id: this.user_id, _id: { $ne: this._id } },
            { $set: { isDefault: false } }
        );
    }
    next();
});

module.exports = mongoose.model('Address', addressSchema);
