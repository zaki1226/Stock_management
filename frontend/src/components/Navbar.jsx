    import React, { useState } from 'react';
    import { Link } from 'react-router-dom';
    import UserDeleteModal from './UserDeleteModal.jsx';
    import UserEditModal from './UserEditModal.jsx';
    import stock from '../assets/stock.png'; 

    const Navbar = () => {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/';
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
            <Link className="navbar-brand me-3" to="/users">
            <img src={stock} alt="Stock Management" style={{ height: '40px', width: 'auto' }} />
            </Link>


            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav max-auto" >


                {localStorage.getItem('token') && (
                <>
                    <li className="nav-item">
                    <Link
                        className="nav-link border border-primary rounded px-2 py-1 bg-light text-primary me-2 nav-box"
                        to="/users"
                    >
                        List All Users
                    </Link>
                    </li>
                    <li className="nav-item">
                    <Link
                        className="nav-link border border-primary rounded px-2 py-1 bg-light text-primary me-2 nav-box"
                        to="/users/create"
                    >
                        Create User
                    </Link>
                    </li>
                    <li className="nav-item">
                    <button
                        className="nav-link btn btn-link border border-primary rounded px-2 py-1 bg-light text-primary me-2 nav-box"
                        onClick={() => setShowEditModal(true)}
                    >
                        Edit User
                    </button>
                    </li>
                    <li className="nav-item">
                    <button
                        className="nav-link btn btn-link border border-primary rounded px-2 py-1 bg-light text-primary me-2 nav-box"
                        onClick={() => setShowDeleteModal(true)}
                    >
                        Delete User
                    </button>
                    </li>
                    <li className="nav-item">
                    <Link
                        className="nav-link border border-primary rounded px-2 py-1 bg-light text-primary me-2 nav-box"
                        to="/roles"
                    >
                        Assign Role
                    </Link>
                    </li>
                </>
                )}
            </ul>
            {localStorage.getItem('token') && (
                <ul className="navbar-nav ms-auto">
                <li className="nav-item">
                    <button
                    className="nav-link btn btn-link border border-primary rounded px-2 py-1 bg-light text-primary me-2 nav-box"
                    onClick={handleLogout}
                    >
                    Logout
                    </button>
                </li>
                </ul>
            )}
            </div>
        </div>
        {showDeleteModal && <UserDeleteModal onClose={() => setShowDeleteModal(false)} />}
        {showEditModal && <UserEditModal onClose={() => setShowEditModal(false)} />}
        </nav>
    );
    };

    export default Navbar;