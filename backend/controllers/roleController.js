    const Role = require('../models/Role');
    const Permission = require('../models/Permission');

    const getRoles = async (req, res) => {
    try {
        const roles = await Role.find().populate('permissions');
        console.log('Fetched roles with permissions:', roles);
        res.status(200).json(roles);
    } catch (error) {
        console.error('Error fetching roles:', error.message);
        res.status(500).json({ error: 'Server error' });
    }
    };

    const createRole = async (req, res) => {
    try {
        const { name, permissions } = req.body;
        if (!name) {
        console.log('Create role failed: Role name is required');
        return res.status(400).json({ error: 'Role name is required' });
        }
        const existingRole = await Role.findOne({ name });
        if (existingRole) {
        console.log('Create role failed: Role already exists:', name);
        return res.status(400).json({ error: 'Role already exists' });
        }
        const permissionDocs = permissions && permissions.length > 0
        ? await Permission.find({ _id: { $in: permissions } })
        : [];
        if (permissions && permissions.length > 0 && permissionDocs.length !== permissions.length) {
        console.log('Create role failed: Some permissions not found:', permissions);
        return res.status(400).json({ error: 'Some permissions not found' });
        }
        const role = new Role({ 
        name, 
        permissions: permissionDocs.map(p => p._id) 
        });
        await role.save();
        await role.populate('permissions');
        console.log('Created role:', role);
        res.status(201).json({ message: 'Role created successfully', role });
    } catch (error) {
        console.error('Error creating role:', error.message);
        res.status(500).json({ error: 'Server error' });
    }
    };

    const updateRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, permissions } = req.body;

        // Validate input
        if (!name) {
        console.log('Update role failed: Role name is required');
        return res.status(400).json({ error: 'Role name is required' });
        }

        // Find the role
        const role = await Role.findById(id);
        if (!role) {
        console.log('Update role failed: Role not found:', id);
        return res.status(404).json({ error: 'Role not found' });
        }

        // Prevent updating the 'admin' role
        if (role.name.toLowerCase() === 'admin') {
        console.log('Update role failed: Cannot update admin role');
        return res.status(403).json({ error: 'Cannot update admin role' });
        }

        // Check for duplicate name (excluding the current role)
        const existingRole = await Role.findOne({ name, _id: { $ne: id } });
        if (existingRole) {
        console.log('Update role failed: Role name already exists:', name);
        return res.status(400).json({ error: 'Role name already exists' });
        }

        // Validate permissions
        const permissionDocs = permissions && permissions.length > 0
        ? await Permission.find({ _id: { $in: permissions } })
        : [];
        if (permissions && permissions.length > 0 && permissionDocs.length !== permissions.length) {
        console.log('Update role failed: Some permissions not found:', permissions);
        return res.status(400).json({ error: 'Some permissions not found' });
        }

        // Update the role
        role.name = name;
        role.permissions = permissionDocs.map(p => p._id);
        await role.save();
        await role.populate('permissions');
        console.log('Updated role:', role);
        res.status(200).json({ message: 'Role updated successfully', role });
    } catch (error) {
        console.error('Error updating role:', error.message);
        res.status(500).json({ error: 'Server error' });
    }
    };

    const deleteRole = async (req, res) => {
    try {
        const { id } = req.params;
        const role = await Role.findById(id);
        if (!role) {
        console.log('Delete role failed: Role not found:', id);
        return res.status(404).json({ error: 'Role not found' });
        }
        if (role.name.toLowerCase() === 'admin') {
        console.log('Delete role failed: Cannot delete admin role');
        return res.status(403).json({ error: 'Cannot delete admin role' });
        }
        await Role.findByIdAndDelete(id); // Updated to use findByIdAndDelete
        console.log('Deleted role:', id);
        res.status(200).json({ message: 'Role deleted successfully' });
    } catch (error) {
        console.error('Error deleting role:', error.message);
        res.status(500).json({ error: error.message }); // Return specific error message
    }
    };

    const createPermission = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
        console.log('Create permission failed: Permission name is required');
        return res.status(400).json({ error: 'Permission name is required' });
        }
        const existingPermission = await Permission.findOne({ name });
        if (existingPermission) {
        console.log('Create permission failed: Permission already exists:', name);
        return res.status(400).json({ error: 'Permission already exists' });
        }
        const permission = new Permission({ name });
        await permission.save();
        console.log('Created permission:', permission);
        res.status(201).json({ message: 'Permission created successfully', permission });
    } catch (error) {
        console.error('Error creating permission:', error.message);
        res.status(500).json({ error: 'Server error' });
    }
    };

    const deletePermission = async (req, res) => {
    try {
        const { id } = req.params;
        const permission = await Permission.findById(id);
        if (!permission) {
        console.log('Delete permission failed: Permission not found:', id);
        return res.status(404).json({ error: 'Permission not found' });
        }
        await permission.remove();
        console.log('Deleted permission:', id);
        res.status(200).json({ message: 'Permission deleted successfully' });
    } catch (error) {
        console.error('Error deleting permission:', error.message);
        res.status(500).json({ error: 'Server error' });
    }
    };

    const getPermissions = async (req, res) => {
    try {
        const permissions = await Permission.find();
        console.log('Fetched permissions:', permissions);
        res.status(200).json(permissions);
    } catch (error) {
        console.error('Error fetching permissions:', error.message);
        res.status(500).json({ error: 'Server error' });
    }
    };

    module.exports = { getRoles, createRole, updateRole, deleteRole, createPermission, deletePermission, getPermissions };