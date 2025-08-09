    const User = require('../models/User');
    const bcrypt = require('bcryptjs');

    const createUser = async (req, res) => {
    try {
        const { firstName, middleName, lastName, phoneNumber, address, email, password } = req.body;
        const existingUser = await User.findOne({ $or: [{ email }, { phoneNumber }] });
        if (existingUser) {
        return res.status(400).json({ error: 'Email or phone number already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
        firstName,
        middleName,
        lastName,
        phoneNumber,
        address,
        email,
        password: hashedPassword,
        roles: [],
        });
        await user.save();
        console.log('User saved:', user);
        res.status(201).json({ message: 'User created successfully', userId: user._id });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Server error' });
    }
    };

    const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { firstName, middleName, lastName, address } = req.body; // Exclude email, phoneNumber
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ error: 'Invalid user ID' });
        }
        const user = await User.findById(id);
        if (!user) {
        return res.status(404).json({ error: 'User not found' });
        }
        user.firstName = firstName || user.firstName;
        user.middleName = middleName || user.middleName;
        user.lastName = lastName || user.lastName;
        user.address = address || user.address;
        await user.save();
        res.status(200).json({ message: 'User updated successfully' });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Server error' });
    }
    };

    const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ error: 'Invalid user ID' });
        }
        const user = await User.findById(id);
        if (!user) {
        return res.status(404).json({ error: 'User not found' });
        }
        await user.deleteOne();
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Server error' });
    }
    };

    const getUser = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ error: 'Invalid user ID' });
        }
        const user = await User.findById(id).select('-password');
        if (!user) {
        return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Server error' });
    }
    };

    const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Server error' });
    }
    };

    module.exports = { createUser, updateUser, deleteUser, getUser, getAllUsers };