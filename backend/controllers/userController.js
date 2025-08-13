    const User = require('../models/User');
    const Role = require('../models/Role');
    const bcrypt = require('bcryptjs');
    const jwt = require('jsonwebtoken');

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
        const { firstName, middleName, lastName, address } = req.body;
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
        const user = await User.findById(id).select('-password').populate('roles');
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
        const users = await User.find().select('-password').populate('roles');
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Server error' });
    }
    };

    const assignRole = async (req, res) => {
    try {
        const { userId, role } = req.body;
        console.log('Received assignRole request:', { userId, role });
        if (!userId || !role) {
        return res.status(400).json({ error: 'User ID and role are required' });
        }
        const user = await User.findById(userId);
        if (!user) {
        return res.status(404).json({ error: 'User not found' });
        }
        const foundRole = await Role.findOne({ name: role });
        if (!foundRole) {
        console.log('Role not found for name:', role);
        return res.status(404).json({ error: 'Role not found' });
        }
        if (!user.roles.includes(foundRole._id)) {
        user.roles.push(foundRole._id);
        }
        await user.save();
        res.status(200).json({ message: 'Role assigned successfully', user });
    } catch (error) {
        console.error('AssignRole error:', error);
        res.status(400).json({ error: error.message });
    }
    };

    const removeRole = async (req, res) => {
    try {
        const { userId, role } = req.body;
        console.log('Received removeRole request:', { userId, role });
        if (!userId || !role) {
        return res.status(400).json({ error: 'User ID and role are required' });
        }
        const user = await User.findById(userId);
        if (!user) {
        return res.status(404).json({ error: 'User not found' });
        }
        const foundRole = await Role.findOne({ name: role });
        if (!foundRole) {
        console.log('Role not found for name:', role);
        return res.status(404).json({ error: 'Role not found' });
        }
        user.roles = user.roles.filter(roleId => roleId.toString() !== foundRole._id.toString());
        await user.save();
        res.status(200).json({ message: 'Role removed successfully', user });
    } catch (error) {
        console.error('RemoveRole error:', error);
        res.status(400).json({ error: error.message });
    }
    };

    const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
        }
        const user = await User.findOne({ email }).populate('roles');
        if (!user) {
        return res.status(401).json({ error: 'Invalid email or password' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
        return res.status(401).json({ error: 'Invalid email or password' });
        }
        const token = jwt.sign(
        { userId: user._id, roles: user.roles.map(role => role.name) },
        process.env.JWT_SECRET || 'your_jwt_secret',
        { expiresIn: '1h' }
        );
        res.status(200).json({ token, user: { id: user._id, email: user.email, roles: user.roles } });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Server error' });
    }
    };

    module.exports = { createUser, updateUser, deleteUser, getUser, getAllUsers, assignRole, removeRole, login };