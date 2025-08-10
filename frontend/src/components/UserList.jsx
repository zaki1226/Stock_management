    import React, { useEffect, useState } from 'react';
    import { getAllUsers } from '../utils/api';

    const UserList = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
        try {
            const response = await getAllUsers();
            setUsers(response.data);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to fetch users');
        }
        };
        fetchUsers();
    }, []);

    return (
        <div className="container mt-5">
        <h2>Users</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <table className="table">
            <thead>
            <tr>
                <th>First Name</th>
                <th>Middle Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Phone Number</th>
                <th>Address</th>
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
                </tr>
            ))}
            </tbody>
        </table>
        </div>
    );
    };

    export default UserList;