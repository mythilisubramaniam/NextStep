const User = require('../../models/User');

const initializeAdmin = async () => {
    try {
        // Check if admin already exists
        const adminExists = await User.findOne({ role: 'admin' });
        
        if (!adminExists) {
            // Create default admin account
            const adminEmail = process.env.ADMIN_EMAIL || 'admin@nextstep.com';
            const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123';
            
            const admin = new User({
                firstName: 'Admin',
                lastName: 'User',
                email: adminEmail,
                phone: '9999999999',
                password: adminPassword, // Will be hashed by pre-save hook
                role: 'admin',
                isVerified: true,
                isActive: true,
                signupMethod: 'email'
            });

            await admin.save();
            console.log('✅ Default admin account created successfully');
            console.log(`   Email: ${adminEmail}`);
            console.log(`   Password: ${adminPassword}`);
            console.log('   Please change the password after first login!');
        } else {
            console.log('✅ Admin account already exists');
        }
    } catch (error) {
        console.error('❌ Error initializing admin:', error.message);
    }
};

module.exports = initializeAdmin;
