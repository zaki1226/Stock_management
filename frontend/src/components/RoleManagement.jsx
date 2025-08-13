    import React, { useEffect, useState } from 'react';
    import { getRoles, getUser, assignRole, removeRole } from '../utils/api';

    const RoleManagement = ({ show, userId, onClose }) => {
    const [roles, setRoles] = useState([]);
    const [userRoles, setUserRoles] = useState([]);
    const [selectedRole, setSelectedRole] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (show && userId) {
        const fetchData = async () => {
            try {
            setLoading(true);
            const [rolesResponse, userResponse] = await Promise.all([
                getRoles(),
                getUser(userId),
            ]);
            setRoles(rolesResponse.data);
            const user = userResponse.data;
            setUserRoles(Array.isArray(user.roles) ? user.roles.map(role => role.name?.toLowerCase() || '') : []);
            setError('');
            } catch (err) {
            setError(err.response?.status === 403
                ? 'Access denied: Insufficient permissions.'
                : err.response?.data?.error || 'Failed to load roles or user data');
            } finally {
            setLoading(false);
            }
        };
        fetchData();
        }
    }, [show, userId]);

    const handleRoleAction = async (action) => {
        if (!selectedRole) {
        setError('Please select a role');
        return;
        }
        try {
        setLoading(true);
        const data = { userId, role: selectedRole };
        if (action === 'assign') {
            await assignRole(data);
            setSuccess('Role assigned successfully');
            setUserRoles([...userRoles, selectedRole]);
        } else if (action === 'remove') {
            await removeRole(data);
            setSuccess('Role removed successfully');
            setUserRoles(userRoles.filter(r => r !== selectedRole));
        }
        setError('');
        setSelectedRole('');
        } catch (err) {
        setError(err.response?.data?.error || `Failed to ${action} role`);
        setSuccess('');
        } finally {
        setLoading(false);
        }
    };

    if (!show) return null;

    return (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1" role="dialog">
        <div className="modal-dialog" role="document">
            <div className="modal-content">
            <div className="modal-header">
                <h5 className="modal-title">Role Management for User ID: {userId}</h5>
                <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
            </div>
            <div className="modal-body">
                {error && <div className="alert alert-danger">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}
                <h6>Current Roles:</h6>
                <ul className="list-group mb-3">
                {userRoles.map(role => (
                    <li key={role} className="list-group-item d-flex justify-content-between align-items-center">
                    {role}
                    <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleRoleAction('remove')}
                        disabled={loading}
                    >
                        {loading ? 'Removing...' : 'Remove'}
                    </button>
                    </li>
                ))}
                </ul>
                <h6>Assign Role:</h6>
                <select
                className="form-select mb-3"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                disabled={loading}
                >
                <option value="">Select a role to assign</option>
                {roles.map(role => (
                    <option key={role._id} value={role.name}>
                    {role.name}
                    </option>
                ))}
                </select>
                <button
                type="button"
                className="btn btn-primary"
                onClick={() => handleRoleAction('assign')}
                disabled={loading || !selectedRole}
                >
                {loading ? 'Assigning...' : 'Assign Role'}
                </button>
            </div>
            <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>Close</button>
            </div>
            </div>
        </div>
        </div>
    );
    };

    export default RoleManagement;