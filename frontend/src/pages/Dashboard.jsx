    import React, { useEffect, useState } from 'react';
    import { Link } from 'react-router-dom';
    import { getAllUsers, getRoles, getPermissions } from '../utils/api';

    const Dashboard = () => {
    const [userCount, setUserCount] = useState(0);
    const [rolesCount, setRolesCount] = useState(0);
    const [permissionsCount, setPermissionsCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
        try {
            setLoading(true);
            const [usersResponse, rolesResponse, permissionsResponse] = await Promise.all([
            getAllUsers(),
            getRoles(),
            getPermissions(),
            ]);
            setUserCount(usersResponse.data.length);
            setRolesCount(rolesResponse.data.length);
            setPermissionsCount(permissionsResponse.data.length);
            setError('');
        } catch (err) {
            setError(err.response?.status === 403
            ? 'Access denied: Insufficient permissions.'
            : err.response?.data?.error || 'Failed to fetch dashboard data');
        } finally {
            setLoading(false);
        }
        };
        fetchData();
    }, []);

    return (
        <div className="container mt-5" style={{ marginLeft: '120px', paddingRight: '20px' }}>
        <h1 className="mb-4">Dashboard</h1>
        {error && <div className="alert alert-danger">{error}</div>}
        {loading && <div className="alert alert-info">Loading...</div>}
        <div className="row">
            <div className="col-md-2 mb-4">
            <div className="card text-center p-3 bg-primary text-white" style={{ minHeight: '120px', cursor: 'pointer' }}>
                <Link to="/users" style={{ textDecoration: 'none', color: 'white' }}>
                <h3 className="mb-0">{userCount}</h3>
                <p className="h6">User List</p>
                </Link>
            </div>
            </div>
            <div className="col-md-2 mb-4">
            <div className="card text-center p-3 bg-success text-white" style={{ minHeight: '120px', cursor: 'pointer' }}>
                <Link to="/users/create" style={{ textDecoration: 'none', color: 'white' }}>
                <h3 className="mb-0">Create User</h3>
                </Link>
            </div>
            </div>
            <div className="col-md-2 mb-4">
            <div className="card text-center p-3 bg-info text-white" style={{ minHeight: '120px', cursor: 'pointer' }}>
                <Link to="/roles" style={{ textDecoration: 'none', color: 'white' }}>
                <h3 className="mb-0">{rolesCount}</h3>
                <p className="h6">Roles</p>
                </Link>
            </div>
            </div>
            <div className="col-md-2 mb-4">
            <div className="card text-center p-3 bg-warning text-white" style={{ minHeight: '120px', cursor: 'pointer' }}>
                <Link to="/system-roles" style={{ textDecoration: 'none', color: 'white' }}>
                <h3 className="mb-0">{permissionsCount}</h3>
                <p className="h6">Permissions</p>
                </Link>
            </div>
            </div>
        </div>
        </div>
    );
    };

    export default Dashboard;