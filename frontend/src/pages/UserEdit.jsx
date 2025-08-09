    import React, { useState, useEffect } from 'react';
    import { useParams, useNavigate } from 'react-router-dom';
    import { getUser, updateUser } from '../utils/api';

    const UserEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: '',
        middleName: '',
        lastName: '',
        phoneNumber: '',
        address: '',
        email: '',
    });
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUser = async () => {
        try {
            console.log('Fetching user with ID:', id);
            const response = await getUser(id);
            setFormData(response.data);
        } catch (err) {
            console.error('Error fetching user:', err);
            setError(err.response?.data?.error || `Failed to fetch user with ID: ${id}`);
        }
        };
        fetchUser();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
        const { firstName, middleName, lastName, address } = formData;
        await updateUser(id, { firstName, middleName, lastName, address });
        navigate('/users');
        } catch (err) {
        setError(err.response?.data?.error || 'Failed to update user');
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="container mt-5">
        <h2>Edit User</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
            <div className="mb-3">
            <label>First Name</label>
            <input
                type="text"
                name="firstName"
                value={formData.firstName}
                className="form-control"
                onChange={handleChange}
                required
            />
            </div>
            <div className="mb-3">
            <label>Middle Name</label>
            <input
                type="text"
                name="middleName"
                value={formData.middleName}
                className="form-control"
                onChange={handleChange}
            />
            </div>
            <div className="mb-3">
            <label>Last Name</label>
            <input
                type="text"
                name="lastName"
                value={formData.lastName}
                className="form-control"
                onChange={handleChange}
                required
            />
            </div>
            <div className="mb-3">
            <label>Phone Number</label>
            <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                className="form-control"
                readOnly
            />
            </div>
            <div className="mb-3">
            <label>Address</label>
            <input
                type="text"
                name="address"
                value={formData.address}
                className="form-control"
                onChange={handleChange}
                required
            />
            </div>
            <div className="mb-3">
            <label>Email</label>
            <input
                type="email"
                name="email"
                value={formData.email}
                className="form-control"
                readOnly
            />
            </div>
            <button type="submit" className="btn btn-primary">Update User</button>
        </form>
        </div>
    );
    };

    export default UserEdit;