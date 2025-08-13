    import React, { useState } from 'react';
    import { useNavigate } from 'react-router-dom';
    import { createUser } from '../utils/api';

    const UserForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: '',
        middleName: '',
        lastName: '',
        phoneNumber: '',
        address: '',
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
        setLoading(true);
        await createUser(formData);
        navigate('/users');
        } catch (err) {
        setError(err.response?.data?.error || 'Failed to create user');
        } finally {
        setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    return (
        <div className="container mt-5">
        <h2>Create User</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        {loading && <div className="alert alert-info">Loading...</div>}
        <form onSubmit={handleSubmit}>
            <div className="mb-3">
            <label className="form-label">First Name</label>
            <input
                type="text"
                name="firstName"
                value={formData.firstName}
                className="form-control"
                onChange={handleChange}
                required
                disabled={loading}
            />
            </div>
            <div className="mb-3">
            <label className="form-label">Middle Name</label>
            <input
                type="text"
                name="middleName"
                value={formData.middleName}
                className="form-control"
                onChange={handleChange}
                disabled={loading}
            />
            </div>
            <div className="mb-3">
            <label className="form-label">Last Name</label>
            <input
                type="text"
                name="lastName"
                value={formData.lastName}
                className="form-control"
                onChange={handleChange}
                required
                disabled={loading}
            />
            </div>
            <div className="mb-3">
            <label className="form-label">Phone Number</label>
            <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                className="form-control"
                onChange={handleChange}
                required
                disabled={loading}
            />
            </div>
            <div className="mb-3">
            <label className="form-label">Address</label>
            <input
                type="text"
                name="address"
                value={formData.address}
                className="form-control"
                onChange={handleChange}
                required
                disabled={loading}
            />
            </div>
            <div className="mb-3">
            <label className="form-label">Email</label>
            <input
                type="email"
                name="email"
                value={formData.email}
                className="form-control"
                onChange={handleChange}
                required
                disabled={loading}
            />
            </div>
            <div className="mb-3">
            <label className="form-label">Password</label>
            <input
                type="password"
                name="password"
                value={formData.password}
                className="form-control"
                onChange={handleChange}
                required
                disabled={loading}
            />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Creating...' : 'Create User'}
            </button>
        </form>
        </div>
    );
    };

    export default UserForm;