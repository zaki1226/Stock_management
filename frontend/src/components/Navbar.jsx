    import React, { useState, useEffect } from 'react';
    import { Link, useLocation, useNavigate } from 'react-router-dom';
    import stock from '../assets/stoc.png';

    const Navbar = () => {
    const location = useLocation();
    const [userRoles, setUserRoles] = useState([]);
    const navigate = useNavigate();
    const [isCollapsed, setIsCollapsed] = useState(localStorage.getItem('sidebarCollapsed') === 'true');

    useEffect(() => {
        const fetchUserRoles = () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const roles = Array.isArray(payload.roles)
                ? payload.roles.map(role => role.toLowerCase()).filter(Boolean)
                : [];
            setUserRoles(roles);
            } catch (err) {
            setUserRoles([]);
            }
        } else {
            setUserRoles([]);
        }
        };
        fetchUserRoles();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('sidebarCollapsed');
        navigate('/');
    };

    const isAdmin = userRoles.includes('admin');
    const sidebarWidth = isCollapsed ? '60px' : '250px';
    const contentMargin = isCollapsed ? '80px' : '260px';

    return (
        <>
        <div className="d-flex justify-content-end p-2 bg-dark text-white" style={{ zIndex: 1000 }}>
            <button className="btn btn-secondary" onClick={() => {
            const newCollapsed = !isCollapsed;
            setIsCollapsed(newCollapsed);
            localStorage.setItem('sidebarCollapsed', newCollapsed);
            }}>
            <i className={`fas ${isCollapsed ? 'fa-angle-double-right' : 'fa-angle-double-left'}`}></i>
            </button>
        </div>
        <div className={`d-flex flex-column vh-100 bg-dark text-white p-2`} style={{ width: sidebarWidth, position: 'fixed', transition: 'width 0.3s', overflow: 'hidden' }}>
            <div className="mb-3">
            <img src={stock} alt="Logo" className="mb-2" style={{ height: '40px', display: isCollapsed ? 'none' : 'block' }} />
            {!isCollapsed && <h2 className="h5 mb-0">User Management</h2>}
            </div>
            {localStorage.getItem('token') && (
            <nav className="flex-grow-1">
                <Link to="/dashboard" className={`d-block py-2 px-3 mb-2 rounded text-decoration-none ${location.pathname === '/dashboard' ? 'bg-secondary' : 'text-white'}`} style={{ display: isCollapsed ? 'none' : 'block' }}>Dashboard</Link>
            </nav>
            )}
            {localStorage.getItem('token') && (
            <button onClick={handleLogout} className="btn btn-danger w-100 mt-1" style={{ padding: '6px', fontSize: '14px' }}>Logout</button>
            )}
        </div>
        </>
    );
    };

    export default Navbar;