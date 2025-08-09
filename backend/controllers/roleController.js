    const Role = require('../models/Role');
    const Permission = require('../models/Permission');
    const User = require('../models/User');

    exports.createRole = async (req, res) => {
    try {
        const { name, permissionIds } = req.body;
        const role = new Role({ name, permissions: permissionIds });
        await role.save();
        res.status(201).json({ message: 'Role created successfully', role });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
    };

    exports.assignRole = async (req, res) => {
    try {
        const { userId, roleId } = req.body;
        const user = await User.findById(userId);
        if (!user) {
        return res.status(404).json({ error: 'User not found' });
        }
        const role = await Role.findById(roleId);
        if (!role) {
        return res.status(404).json({ error: 'Role not found' });
        }
        if (!user.roles.includes(roleId)) {
        user.roles.push(roleId);
        await user.save();
        }
        res.json({ message: 'Role assigned successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
    };

    exports.getRoles = async (req, res) => {
    try {
        const roles = await Role.find().populate('permissions');
        res.json(roles);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
    };

    exports.createPermission = async (req, res) => {
    try {
        const { name, description } = req.body;
        const permission = new Permission({ name, description });
        await permission.save();
        res.status(201).json({ message: 'Permission created successfully', permission });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
    };

    exports.getPermissions = async (req, res) => {
    try {
        const permissions = await Permission.find();
        res.json(permissions);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
    };