    import React, { useState, useEffect } from 'react';
    import { useNavigate, useParams } from 'react-router-dom';
    import { createUser, updateUser, getUser } from '../utils/api';

    const UserForm = () => {
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
    const navigate = useNavigate();
    const { id } = useParams(); // For edit mode

    useEffect(() => {
        if (id) {
        // Fetch user data for editing
        getUser(id).then((response) => {
            setFormData(response.data);
        }).catch((err) => {
            setError('Failed to load user');
        });
        }
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
        if (id) {
            await updateUser(id, formData); // Update existing user
        } else {
            await createUser(formData); // Create new user
        }
        navigate('/users');
        } catch (err) {
        setError(err.response?.data?.error || 'Failed to save user');
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="container mt-5">
        <h2>{id ? 'Edit User' : 'Create User'}</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
            <div className="mb-3">
            <label>First Name</label>
            <input type="text" name="firstName" className="form-control" value={formData.firstName} onChange={handleChange} required />
            </div>
            <div className="mb-3">
            <label>Middle Name</label>
            <input type="text" name="middleName" className="form-control" value={formData.middleName} onChange={handleChange} />
            </div>
            <div className="mb-3">
            <label>Last Name</label>
            <input type="text" name="lastName" className="form-control" value={formData.lastName} onChange={handleChange} required />
            </div>
            <div className="mb-3">
            <label>Phone Number</label>
            <input type="text" name="phoneNumber" className="form-control" value={formData.phoneNumber} onChange={handleChange} required />
            </div>
            <div className="mb-3">
            <label>Address</label>
            <input type="text" name="address" className="form-control" value={formData.address} onChange={handleChange} required />
            </div>
            <div className="mb-3">
            <label>Email</label>
            <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="mb-3">
            <label>Password</label>
            <input type="password" name="password" className="form-control" value={formData.password} onChange={handleChange} required={!id} />
            </div>
            <button type="submit" className="btn btn-primary">{id ? 'Update' : 'Create'}</button>
        </form>
        </div>
    );
    };

    export default UserForm;