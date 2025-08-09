    import React, { useState } from 'react';
    import { useNavigate } from 'react-router-dom';
    import { login } from '../utils/api';

    const Home = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
        const response = await login(formData);
        localStorage.setItem('token', response.data.token);
        navigate('/users');
        } catch (err) {
        setError(err.response?.data?.error || 'Login failed');
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div className="card p-4 shadow" style={{ width: '100%', maxWidth: '400px' }}>
            <h2 className="text-center mb-4">Stock Management Login</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
            <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                type="email"
                name="email"
                className="form-control"
                value={formData.email}
                onChange={handleChange}
                required
                />
            </div>
            <div className="mb-3">
                <label className="form-label">Password</label>
                <input
                type="password"
                name="password"
                className="form-control"
                value={formData.password}
                onChange={handleChange}
                required
                />
            </div>
            <button type="submit" className="btn btn-primary w-100">Login</button>
            </form>
        </div>
        </div>
    );
    };

    export default Home;