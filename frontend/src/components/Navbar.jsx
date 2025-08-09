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

    useEffect(() => {
        const fetchUsers = async () => {
        try {
            const response = await getAllUsers();
            setUsers(response.data);
        } catch (err) {
            console.error('Failed to fetch users:', err);
        }
        };
        if (token) fetchUsers();
    }, [token]);

    const handleEditUser = () => {
        if (selectedUserId) {
        navigate(`/users/edit/${selectedUserId}`);
        }
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
            <ul className="navbar-nav">
                {token && (
                <>
                    <li className="nav-item">
                    <Link className="nav-link" to="/users">List All Users</Link>
                    </li>
                    <li className="nav-item">
                    <Link className="nav-link" to="/users/create">Create User</Link>
                    </li>
                    <li className="nav-item dropdown">
                    <a
                        className="nav-link dropdown-toggle"
                        href="#"
                        id="editUserDropdown"
                        role="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                    >
                        Edit User
                    </a>
                    <ul className="dropdown-menu" aria-labelledby="editUserDropdown">
                        <li>
                        <select
                            className="form-select m-2"
                            value={selectedUserId}
                            onChange={(e) => setSelectedUserId(e.target.value)}
                        >
                            <option value="">Select a user</option>
                            {users.map(user => (
                            <option key={user._id} value={user._id}>
                                {user.email} ({user.firstName} {user.lastName})
                            </option>
                            ))}
                        </select>
                        <button
                            className="btn btn-primary m-2"
                            onClick={handleEditUser}
                            disabled={!selectedUserId}
                        >
                            Go to Edit
                        </button>
                        </li>
                    </ul>
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