    import React, { useState, useEffect } from 'react';
    import { assignRole, getRoles, getAllUsers } from '../utils/api';

    const RoleManagement = () => {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [selectedUser, setSelectedUser] = useState('');
    const [selectedRole, setSelectedRole] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        getAllUsers().then((response) => setUsers(response.data));
        getRoles().then((response) => setRoles(response.data));
    }, []);

    const handleAssignRole = async (e) => {
        e.preventDefault();
        try {
        await assignRole({ userId: selectedUser, roleId: selectedRole });
        alert('Role assigned successfully');
        } catch (err) {
        setError(err.response?.data?.error || 'Failed to assign role');
        }
    };

    return (
        <div className="container mt-5">
        <h2>Role Management</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleAssignRole}>
            <div className="mb-3">
            <label>User</label>
            <select
                className="form-control"
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                required
            >
                <option value="">Select User</option>
                {users.map((user) => (
                <option key={user._id} value={user._id}>{user.email}</option>
                ))}
            </select>
            </div>
            <div className="mb-3">
            <label>Role</label>
            <select
                className="form-control"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                required
            >
                <option value="">Select Role</option>
                {roles.map((role) => (
                <option key={role._id} value={role._id}>{role.name}</option>
                ))}
            </select>
            </div>
            <button type="submit" className="btn btn-primary">Assign Role</button>
        </form>
        </div>
    );
    };

    export default RoleManagement;