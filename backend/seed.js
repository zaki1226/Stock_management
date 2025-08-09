    const mongoose = require('mongoose');
    const bcrypt = require('bcryptjs');
    const User = require('./models/User');
    const Role = require('./models/Role');
    require('dotenv').config();

    const seed = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI, {});
        console.log('MongoDB connected');

        // Create or verify admin role
        let adminRole = await Role.findOne({ name: 'admin' });
        if (!adminRole) {
        adminRole = new Role({ name: 'admin' });
        await adminRole.save();
        console.log('Admin role created:', adminRole);
        } else {
        console.log('Admin role exists:', adminRole);
        }

        // Create admin user
        const email = 'admin3@example.com';
        const existingUser = await User.findOne({ email });
        if (existingUser) {
        console.log('User already exists:', email);
        await User.deleteOne({ email }); // Remove to update with new role
        }

        const hashedPassword = await bcrypt.hash('password123', 10);
        const user = new User({
        _id: new mongoose.Types.ObjectId('6895fd8ad3247b0c5c292047'),
        email,
        password: hashedPassword,
        firstName: 'Admin',
        middleName: '',
        lastName: 'User',
        phoneNumber: '1234567890',
        address: 'Admin Address',
        roles: [adminRole._id],
        });
        await user.save();
        console.log('User created with admin role:', user);

        // Disconnect
        await mongoose.disconnect();
        console.log('MongoDB disconnected');
    } catch (error) {
        console.error('Seeding error:', error);
    }
    };

    seed();