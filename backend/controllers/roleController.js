    const Role = require('../models/Role');
    const Permission = require('../models/Permission');

    const getRoles = async (req, res) => {
    try {
        const roles = await Role.find();
        res.status(200).json(roles);
    } catch (error) {
        console.error('Error fetching roles:', error);
        res.status(500).json({ error: 'Server error' });
    }
    };

    const createRole = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
        return res.status(400).json({ error: 'Role name is required' });
        }
        const existingRole = await Role.findOne({ name });
        if (existingRole) {
        return res.status(400).json({ error: 'Role already exists' });
        }
        const role = new Role({ name });
        await role.save();
        res.status(201).json({ message: 'Role created successfully', role });
    } catch (error) {
        console.error('Error creating role:', error);
        res.status(500).json({ error: 'Server error' });
    }
    };

    const createPermission = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
        return res.status(400).json({ error: 'Permission name is required' });
        }
        const existingPermission = await Permission.findOne({ name });
        if (existingPermission) {
        return res.status(400).json({ error: 'Permission already exists' });
        }
        const permission = new Permission({ name });
        await permission.save();
        res.status(201).json({ message: 'Permission created successfully', permission });
    } catch (error) {
        console.error('Error creating permission:', error);
        res.status(500).json({ error: 'Server error' });
    }
    };

    const getPermissions = async (req, res) => {
    try {
        const permissions = await Permission.find();
        res.status(200).json(permissions);
    } catch (error) {
        console.error('Error fetching permissions:', error);
        res.status(500).json({ error: 'Server error' });
    }
    };

    module.exports = { getRoles, createRole, createPermission, getPermissions };