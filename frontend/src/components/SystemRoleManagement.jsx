    import React, { useState, useEffect } from 'react';
    import { getRoles, getPermissions, createRole, deleteRole, createPermission, getUser, updateRole } from '../utils/api';

    const SystemRoleManagement = () => {
    const [roles, setRoles] = useState([]);
    const [permissions, setPermissions] = useState([]);
    const [newRoleName, setNewRoleName] = useState('');
    const [newPermissionName, setNewPermissionName] = useState('');
    const [selectedPermissions, setSelectedPermissions] = useState([]);
    const [deleteRoleId, setDeleteRoleId] = useState('');
    const [editRoleId, setEditRoleId] = useState('');
    const [editRoleName, setEditRoleName] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [userRoles, setUserRoles] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
        try {
            setLoading(true);
            let userRoleNames = [];
            const token = localStorage.getItem('token');
            let userId = '';
            if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                userId = payload.userId || payload.id || payload.sub || '';
                if (Array.isArray(payload.roles)) {
                userRoleNames = payload.roles.map(role => role.toLowerCase()).filter(Boolean);
                }
            } catch (err) {
                setError('Failed to parse authentication token. Please log in again.');
                localStorage.removeItem('token');
                window.location.href = '/';
                return;
            }
            } else {
            setError('Please log in to access role management');
            setLoading(false);
            return;
            }

            if (!userRoleNames.length && userId) {
            try {
                const userResponse = await getUser(userId);
                const user = userResponse.data;
                if (Array.isArray(user.roles)) {
                userRoleNames = user.roles.map(role => role.name?.toLowerCase() || '').filter(Boolean);
                } else {
                setError('User roles not found in backend data.');
                }
            } catch (err) {
                setError('Failed to verify user role: ' + (err.response?.data?.error || 'Unknown error'));
            }
            }

            setUserRoles(userRoleNames);

            if (!userRoleNames.includes('admin')) {
            setError('Access denied: Admins only.');
            setLoading(false);
            return;
            }

            try {
            const [rolesResponse, permissionsResponse] = await Promise.all([
                getRoles(),
                getPermissions(),
            ]);
            setRoles(rolesResponse.data || []);
            setPermissions(permissionsResponse.data || []);
            setError('');
            } catch (err) {
            if (err.response?.status === 401) {
                setError('Authentication failed: Please log in again.');
                localStorage.removeItem('token');
                window.location.href = '/';
            } else if (err.response?.status === 404) {
                setError('Permissions endpoint not found. Contact administrator.');
            } else {
                setError(err.response?.data?.error || 'Failed to load roles or permissions');
            }
            }
        } catch (err) {
            setError('An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
        };
        fetchData();
    }, []);

    const handleRoleAction = async (e, action) => {
        e.preventDefault();
        if (action === 'create' && !newRoleName) {
        setError('Please enter a role name');
        return;
        }
        if (action === 'delete' && !deleteRoleId) {
        setError('Please select a role to delete');
        return;
        }
        if (action === 'createPermission' && !newPermissionName) {
        setError('Please enter a permission name');
        return;
        }
        if (action === 'update' && (!editRoleId || !editRoleName)) {
        setError('Please select a role and enter a name to update');
        return;
        }
        try {
        setLoading(true);
        if (action === 'create') {
            const data = { name: newRoleName, permissions: selectedPermissions };
            const response = await createRole(data);
            setRoles([...roles, response.data.role]);
            setSuccess('Role created successfully');
            setNewRoleName('');
            setSelectedPermissions([]);
        } else if (action === 'delete') {
            if (!window.confirm('Are you sure you want to delete this role from the system?')) return;
            await deleteRole(deleteRoleId);
            setRoles(roles.filter(role => role._id !== deleteRoleId));
            setSuccess('Role deleted successfully');
            setDeleteRoleId('');
        } else if (action === 'createPermission') {
            const data = { name: newPermissionName };
            const response = await createPermission(data);
            setPermissions([...permissions, response.data.permission]);
            setSuccess('Permission created successfully');
            setNewPermissionName('');
        } else if (action === 'update') {
            const data = { name: editRoleName, permissions: selectedPermissions };
            const response = await updateRole(editRoleId, data);
            setRoles(roles.map(role => role._id === editRoleId ? response.data.role : role));
            setSuccess('Role updated successfully');
            setEditRoleId('');
            setEditRoleName('');
            setSelectedPermissions([]);
        }
        setError('');
        } catch (err) {
        if (err.response?.status === 401) {
            setError('Authentication failed: Please log in again.');
            localStorage.removeItem('token');
            window.location.href = '/';
        } else {
            setError(err.response?.data?.error || `Failed to ${action.replace('createPermission', 'create permission').replace('update', 'update role')}`);
        }
        setSuccess('');
        } finally {
        setLoading(false);
        }
    };

    const handlePermissionToggle = (permissionId) => {
        setSelectedPermissions(prev =>
        prev.includes(permissionId)
            ? prev.filter(id => id !== permissionId)
            : [...prev, permissionId]
        );
    };

    const handleEditRoleSelect = (e) => {
        const roleId = e.target.value;
        setEditRoleId(roleId);
        const role = roles.find(r => r._id === roleId);
        if (role) {
        setEditRoleName(role.name);
        setSelectedPermissions(role.permissions.map(p => p._id || p));
        }
    };

    const isAdmin = userRoles.includes('admin');

    if (!isAdmin) {
        return (
        <div className="container mt-5">
            <h2>System Role Management</h2>
            <div className="alert alert-danger">{error || 'Access denied: Admins only.'}</div>
        </div>
        );
    }

    return (
        <div className="container mt-5">
        <h2>System Role Management</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        {loading && <div className="alert alert-info">Loading...</div>}

        <div className="mb-5">
            <h3>Create Permission</h3>
            <form onSubmit={(e) => handleRoleAction(e, 'createPermission')}>
            <div className="input-group mb-3">
                <input
                type="text"
                className="form-control"
                value={newPermissionName}
                onChange={(e) => setNewPermissionName(e.target.value)}
                placeholder="Enter permission name (e.g., view_users)"
                disabled={loading}
                />
                <button
                className="btn btn-success"
                type="submit"
                disabled={loading}
                >
                {loading ? 'Creating...' : 'Create Permission'}
                </button>
            </div>
            </form>
        </div>

        <div className="mb-5">
            <h3>Create Role</h3>
            <form onSubmit={(e) => handleRoleAction(e, 'create')}>
            <div className="mb-3">
                <label className="form-label">Role Name</label>
                <input
                type="text"
                className="form-control"
                value={newRoleName}
                onChange={(e) => setNewRoleName(e.target.value)}
                placeholder="Enter role name (e.g., Supervisor)"
                disabled={loading}
                />
            </div>
            <div className="mb-3">
                <label className="form-label">Select Permissions</label>
                <div>
                {permissions.length > 0 ? (
                    permissions.map(permission => (
                    <div key={permission._id} className="form-check">
                        <input
                        type="checkbox"
                        className="form-check-input"
                        id={`perm-${permission._id}`}
                        checked={selectedPermissions.includes(permission._id)}
                        onChange={() => handlePermissionToggle(permission._id)}
                        disabled={loading}
                        />
                        <label className="form-check-label" htmlFor={`perm-${permission._id}`}>
                        {permission.name}
                        </label>
                    </div>
                    ))
                ) : (
                    <p>No permissions available. Create permissions above.</p>
                )}
                </div>
            </div>
            <button
                type="submit"
                className="btn btn-success"
                disabled={loading}
            >
                {loading ? 'Creating...' : 'Create Role'}
            </button>
            </form>
        </div>

        <div className="mb-5">
            <h3>Delete Role</h3>
            <form onSubmit={(e) => handleRoleAction(e, 'delete')}>
            <div className="input-group mb-3">
                <select
                className="form-select"
                value={deleteRoleId}
                onChange={(e) => setDeleteRoleId(e.target.value)}
                disabled={loading}
                >
                <option value="">Select role to delete</option>
                {roles.length > 0 ? (
                    roles
                    .filter(role => role.name.toLowerCase() !== 'admin')
                    .map(role => (
                        <option key={role._id} value={role._id}>
                        {role.name}
                        </option>
                    ))
                ) : (
                    <option value="" disabled>No roles available</option>
                )}
                </select>
                <button
                className="btn btn-danger"
                type="submit"
                disabled={loading || !deleteRoleId}
                >
                {loading ? 'Deleting...' : 'Delete Role'}
                </button>
            </div>
            </form>
        </div>

        <div className="mb-5">
            <h3>Edit Role</h3>
            <form onSubmit={(e) => handleRoleAction(e, 'update')}>
            <div className="mb-3">
                <label className="form-label">Select Role to Edit</label>
                <select
                className="form-select"
                value={editRoleId}
                onChange={handleEditRoleSelect}
                disabled={loading}
                >
                <option value="">Select role to edit</option>
                {roles.length > 0 ? (
                    roles
                    .filter(role => role.name.toLowerCase() !== 'admin')
                    .map(role => (
                        <option key={role._id} value={role._id}>
                        {role.name}
                        </option>
                    ))
                ) : (
                    <option value="" disabled>No roles available</option>
                )}
                </select>
            </div>
            <div className="mb-3">
                <label className="form-label">Role Name</label>
                <input
                type="text"
                className="form-control"
                value={editRoleName}
                onChange={(e) => setEditRoleName(e.target.value)}
                placeholder="Enter new role name"
                disabled={loading || !editRoleId}
                />
            </div>
            <div className="mb-3">
                <label className="form-label">Update Permissions</label>
                <div>
                {permissions.length > 0 ? (
                    permissions.map(permission => (
                    <div key={permission._id} className="form-check">
                        <input
                        type="checkbox"
                        className="form-check-input"
                        id={`perm-edit-${permission._id}`}
                        checked={selectedPermissions.includes(permission._id)}
                        onChange={() => handlePermissionToggle(permission._id)}
                        disabled={loading || !editRoleId}
                        />
                        <label className="form-check-label" htmlFor={`perm-edit-${permission._id}`}>
                        {permission.name}
                        </label>
                    </div>
                    ))
                ) : (
                    <p>No permissions available. Create permissions above.</p>
                )}
                </div>
            </div>
            <button
                type="submit"
                className="btn btn-warning"
                disabled={loading || !editRoleId}
            >
                {loading ? 'Updating...' : 'Update Role'}
            </button>
            </form>
        </div>
        </div>
    );
    };

    export default SystemRoleManagement;