    import React, { useState, useEffect } from 'react';
    import { getAllUsers, getRoles, assignRole } from '../utils/api';

    const RoleManagement = () => {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState('');
    const [selectedRole, setSelectedRole] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
        try {
            setLoading(true);
            const [usersResponse, rolesResponse] = await Promise.all([
            getAllUsers(),
            getRoles(),
            ]);
            console.log('Fetched users:', usersResponse.data);
            console.log('Fetched roles:', rolesResponse.data);
            setUsers(usersResponse.data);
            setRoles(rolesResponse.data);
            setError('');
        } catch (err) {
            console.error('Failed to fetch data:', err);
            setError(err.response?.data?.error || 'Failed to load users or roles');
        } finally {
            setLoading(false);
        }
        };
        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedUserId || !selectedRole) {
        setError('Please select a user and a role');
        return;
        }
        try {
        setLoading(true);
        const data = { userId: selectedUserId, role: selectedRole };
        console.log('Assigning role with data:', data);
        await assignRole(data);
        setSuccess('Role assigned successfully');
        setError('');
        setSelectedUserId('');
        setSelectedRole('');
        } catch (err) {
        console.error('Role assignment error:', err);
        setError(err.response?.data?.error || 'Failed to assign role');
        setSuccess('');
        } finally {
        setLoading(false);
        }
    };

    return (
        <div className="container mt-5">
        <h2>Assign Role</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        {loading && <div className="alert alert-info">Loading...</div>}
        <form onSubmit={handleSubmit}>
            <div className="mb-3">
            <label className="form-label">Select User</label>
            <select
                className="form-select"
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                disabled={loading}
            >
                <option value="">Select a user</option>
                {users.length > 0 ? (
                users.map(user => (
                    <option key={user._id} value={user._id}>
                    {user.email} ({user.firstName} {user.lastName})
                    </option>
                ))
                ) : (
                <option value="" disabled>No users available</option>
                )}
            </select>
            </div>
            <div className="mb-3">
            <label className="form-label">Select Role</label>
            <select
                className="form-select"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                disabled={loading}
            >
                <option value="">Select a role</option>
                {roles.length > 0 ? (
                roles.map(role => (
                    <option key={role._id} value={role.name}>
                    {role.name}
                    </option>
                ))
                ) : (
                <option value="" disabled>No roles available</option>
                )}
            </select>
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Assigning...' : 'Assign Role'}
            </button>
        </form>
        </div>
    );
    };

    export default RoleManagement;