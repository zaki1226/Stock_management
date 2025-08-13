    import React, { useEffect, useState } from 'react';
    import { Link } from 'react-router-dom';
    import { getRoles } from '../utils/api';

    const RoleList = () => {
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchRoles = async () => {
        try {
            setLoading(true);
            const response = await getRoles();
            setRoles(response.data || []);
            setError('');
        } catch (err) {
            setError(err.response?.status === 403
            ? 'Access denied: Insufficient permissions.'
            : err.response?.data?.error || 'Failed to fetch roles');
        } finally {
            setLoading(false);
        }
        };
        fetchRoles();
    }, []);

    return (
        <div className="container mt-5" style={{ marginLeft: '120px', paddingRight: '20px' }}>
        <h1 className="mb-4">Role List</h1>
        {error && <div className="alert alert-danger">{error}</div>}
        {loading && <div className="alert alert-info">Loading...</div>}
        {roles.length > 0 ? (
            <ul className="list-group">
            {roles.map(role => (
                <li key={role._id} className="list-group-item">
                {role.name} (ID: {role._id})
                <div className="mt-2">
                    <strong>Permissions:</strong>
                    {role.permissions && role.permissions.length > 0 ? (
                    role.permissions.map(permission => (
                        <span key={permission._id || permission} className="badge bg-secondary me-1">
                        {typeof permission === 'object' ? permission.name : permission}
                        </span>
                    ))
                    ) : (
                    <span className="text-muted">No permissions assigned</span>
                    )}
                </div>
                </li>
            ))}
            </ul>
        ) : (
            <p>No roles available</p>
        )}
        <div className="mt-3">
            <Link to="/system-roles" className="btn btn-primary">Manage Roles</Link>
        </div>
        </div>
    );
    };

    export default RoleList;