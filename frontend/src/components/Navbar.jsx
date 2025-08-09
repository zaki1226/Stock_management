    import React, { useState, useEffect } from 'react';
    import { Link, useNavigate } from 'react-router-dom';
    import { getAllUsers } from '../utils/api';
    import UserDeleteModal from './UserDeleteModal.jsx';

    const Navbar = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [users, setUsers] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
        try {
            const response = await getAllUsers();
            console.log('Fetched users:', response.data);
            setUsers(response.data);
            setError('');
        } catch (err) {
            console.error('Failed to fetch users:', err);
            setError(err.response?.data?.error || 'Failed to load users for dropdown');
        }
        };
        if (token) fetchUsers();
    }, [token]);

    const handleEditUser = () => {
        console.log('handleEditUser triggered, selectedUserId:', selectedUserId);
        if (selectedUserId) {
        console.log('Navigating to:', `/users/edit/${selectedUserId}`);
        navigate(`/users/edit/${selectedUserId}`, { replace: false });
        } else {
        console.error('No user selected for edit');
        setError('Please select a user to edit');
        }
    };

    const handleUserSelect = (e) => {
        const userId = e.target.value;
        console.log('Selected user ID:', userId);
        setSelectedUserId(userId);
        setError('');
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
            <Link className="navbar-brand" to="/">Stock Management</Link>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
            {error && (
                <div className="alert alert-danger ms-3" style={{ maxWidth: '300px' }}>
                {error}
                </div>
            )}
            <ul className="navbar-nav">
                {token && (
                <>
                    <li className="nav-item">
                    <Link className="nav-link" to="/users">List All Users</Link>
                    </li>
                    <li className="nav-item">
                    <Link className="nav-link" to="/users/create">Create User</Link>
                    </li>
                    <li className="nav-item">
                    <div className="d-flex align-items-center">
                        <select
                        className="form-select me-2"
                        style={{ width: '200px' }}
                        value={selectedUserId}
                        onChange={handleUserSelect}
                        >
                        <option value="">Select a user to edit</option>
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
                        <button
                        className="btn btn-primary"
                        onClick={handleEditUser}
                        disabled={!selectedUserId}
                        >
                        Edit User
                        </button>
                    </div>
                    </li>
                    <li className="nav-item">
                    <button
                        className="nav-link btn btn-link"
                        onClick={() => setShowDeleteModal(true)}
                    >
                        Delete User
                    </button>
                    </li>
                    <li className="nav-item">
                    <Link className="nav-link" to="/roles">Assign Role</Link>
                    </li>
                </>
                )}
            </ul>
            {token && (
                <ul className="navbar-nav ms-auto">
                <li className="nav-item">
                    <button className="nav-link btn btn-link" onClick={handleLogout}>
                    Logout
                    </button>
                </li>
                </ul>
            )}
            </div>
        </div>
        {showDeleteModal && <UserDeleteModal onClose={() => setShowDeleteModal(false)} />}
        </nav>
    );
    };

    export default Navbar;