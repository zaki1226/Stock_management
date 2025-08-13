    import React, { useEffect, useState } from 'react';
    import { Link } from 'react-router-dom';
    import { getAllUsers } from '../utils/api';
    import UserDeleteModal from './UserDeleteModal.jsx';
    import RoleManagement from './RoleManagement.jsx';

    const UserList = ({ contentMargin = '80px' }) => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showRoleModal, setShowRoleModal] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage, setUsersPerPage] = useState(10);
    const [totalUsers, setTotalUsers] = useState(0);
    const [sortBy, setSortBy] = useState('firstName');
    const [sortOrder, setSortOrder] = useState('asc');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
        try {
            setLoading(true);
            const params = {
            page: currentPage,
            limit: usersPerPage,
            sortBy,
            sortOrder,
            search: searchTerm || undefined, // Send undefined if empty to avoid filtering
            };
            const response = await getAllUsers(params);
            setUsers(response.data || []);
            setTotalUsers(response.total || 0);
            setError('');
        } catch (err) {
            setError(err.response?.status === 403
            ? 'Access denied: Insufficient permissions. Please check your role.'
            : err.response?.data?.error || 'Failed to load users');
        } finally {
            setLoading(false);
        }
        };
        fetchUsers();
    }, [currentPage, usersPerPage, sortBy, sortOrder, searchTerm]);

    const paginate = (pageNumber) => {
        if (pageNumber > 0 && pageNumber <= Math.ceil(totalUsers / usersPerPage)) {
        setCurrentPage(pageNumber);
        }
    };

    const handleDeleteClick = (userId) => {
        setSelectedUserId(userId);
        setShowDeleteModal(true);
    };

    const handleAssignRoleClick = (userId) => {
        setSelectedUserId(userId);
        setShowRoleModal(true);
    };

    const handleModalClose = () => {
        setShowRoleModal(false);
    };

    const handleSort = (field) => {
        const newSortOrder = sortBy === field && sortOrder === 'asc' ? 'desc' : 'asc';
        setSortBy(field);
        setSortOrder(newSortOrder);
        setCurrentPage(1); // Reset to first page on sort
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // Reset to first page on search
    };

    const handleLimitChange = (e) => {
        const newLimit = Number(e.target.value);
        setUsersPerPage(newLimit);
        setCurrentPage(1); // Reset to first page on limit change
    };

    // Show limited page numbers (e.g., 5 pages around current page)
    const getPageNumbers = () => {
        const pageNumbers = [];
        const maxPagesToShow = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
        let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

        if (endPage - startPage + 1 < maxPagesToShow) {
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
        }
        return pageNumbers;
    };

    const totalPages = Math.ceil(totalUsers / usersPerPage);

    return (
        <div className="container mt-5" style={{ marginLeft: contentMargin, paddingRight: '20px', transition: 'margin-left 0.3s' }}>
        <h1 className="mb-4">List All Users</h1>
        {error && <div className="alert alert-danger">{error}</div>}
        {loading && <div className="alert alert-info">Loading...</div>}
        <div className="mb-3">
            <input
            type="text"
            className="form-control w-25"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={handleSearch}
            />
        </div>
        {users.length > 0 || loading ? (
            <>
            <div className="table-responsive">
                <table className="table table-striped w-100">
                <thead>
                    <tr>
                    <th onClick={() => handleSort('firstName')}>
                        First Name {sortBy === 'firstName' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </th>
                    <th onClick={() => handleSort('middleName')}>
                        Middle Name {sortBy === 'middleName' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </th>
                    <th onClick={() => handleSort('lastName')}>
                        Last Name {sortBy === 'lastName' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </th>
                    <th onClick={() => handleSort('email')}>
                        Email {sortBy === 'email' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </th>
                    <th onClick={() => handleSort('phoneNumber')}>
                        Phone Number {sortBy === 'phoneNumber' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </th>
                    <th onClick={() => handleSort('address')}>
                        Address {sortBy === 'address' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </th>
                    <th>Activity</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                    <tr key={user._id}>
                        <td>{user.firstName}</td>
                        <td>{user.middleName || 'N/A'}</td>
                        <td>{user.lastName}</td>
                        <td>{user.email}</td>
                        <td>{user.phoneNumber}</td>
                        <td>{user.address}</td>
                        <td>
                        <Link to={`/users/edit/${user._id}`} className="text-primary me-3"><i className="fas fa-edit"></i></Link>
                        <button onClick={() => handleDeleteClick(user._id)} className="text-danger me-3" data-bs-toggle="modal" data-bs-target="#deleteModal"><i className="fas fa-trash"></i></button>
                        <button onClick={() => handleAssignRoleClick(user._id)} className="text-success" data-bs-toggle="modal"><i className="fas fa-user-plus"></i> Assign Role</button>
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
            <div className="d-flex justify-content-between align-items-center mt-3">
                <nav aria-label="Page navigation">
                <ul className="pagination">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => paginate(currentPage - 1)}>Previous</button>
                    </li>
                    {getPageNumbers().map(number => (
                    <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
                        <button className="page-link" onClick={() => paginate(number)}>{number}</button>
                    </li>
                    ))}
                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => paginate(currentPage + 1)}>Next</button>
                    </li>
                </ul>
                </nav>
            </div>
            </>
        ) : (
            <p className="text-center">No users available</p>
        )}
        <UserDeleteModal show={showDeleteModal} userId={selectedUserId} onClose={() => setShowDeleteModal(false)} />
        <RoleManagement
            show={showRoleModal}
            userId={selectedUserId}
            onClose={handleModalClose}
        />
        </div>
    );
    };

    export default UserList;