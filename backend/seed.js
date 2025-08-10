    require('dotenv').config();
    const mongoose = require('mongoose');
    const bcrypt = require('bcryptjs');
    const User = require('./models/User');
    const Role = require('./models/Role');

    const seedDatabase = async () => {
    try {
        // Connect to MongoDB
        const mongoUri = process.env.MONGO_URI;
        if (!mongoUri) {
        throw new Error('MONGODB_URI is not defined in .env file');
        }
        await mongoose.connect(mongoUri);
        console.log('MongoDB connected');

        // Clear existing data
        await User.deleteMany({});
        await Role.deleteMany({});
        console.log('Existing users and roles cleared');

        // Create roles
        const adminRole = await Role.create({ name: 'Admin' });
        const staffRole = await Role.create({ name: 'Staff' });
        const managerRole = await Role.create({ name: 'Manager' });
        console.log('Roles created:', adminRole.name, staffRole.name, managerRole.name);

        // Create admin user
        const hashedPassword = await bcrypt.hash('password123', 10);
        const adminUser = await User.create({
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin3@example.com',
        password: hashedPassword,
        address: '123 Admin Street, City',
        phoneNumber: '123-456-7890',
        roles: [adminRole._id],
        });
        console.log('Admin user created:', adminUser.email);

        console.log('Database seeded successfully');
    } catch (error) {
        console.error('Seeding error:', error);
    } finally {
        await mongoose.connection.close();
        console.log('MongoDB connection closed');
    }
    };

    seedDatabase();