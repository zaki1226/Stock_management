    import React, { useState } from 'react';
    import { useNavigate } from 'react-router-dom';
    import { login } from '../utils/api';
    import logo from '../assets/perfonet.png';

    const Home = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
        const response = await login(formData);
        localStorage.setItem('token', response.data.token);
        navigate('/users');
        } catch (err) {
        console.error('Login error:', err.response?.data || err.message);
        setError(err.response?.data?.error || 'Login failed');
        } finally {
        setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div className="card p-4 shadow" style={{ width: '100%', maxWidth: '400px' }}>
            <h2 className="text-center mb-4">Stock Management Login</h2>
            <div className="text-center mb-4">
            <img src={logo} alt="Stock Management Logo" style={{ width: '80px', height: '80px', objectFit: 'contain' }} />
            </div>
            {error && <div className="alert alert-danger">{error}</div>}
            {loading && <div className="alert alert-info">Logging in...</div>}
            <form onSubmit={handleSubmit}>
            <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                type="email"
                name="email"
                className="form-control"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email"
                required
                disabled={loading}
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
                placeholder="Enter password"
                required
                disabled={loading}
                />
            </div>
            <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={loading}
            >
                {loading ? 'Logging in...' : 'Login'}
            </button>
            <div className="mt-3 text-center">
                <a href="/forgot-password" className="text-primary">Forgot Password?</a>
            </div>
            </form>
        </div>
        </div>
    );
    };

    export default Home;