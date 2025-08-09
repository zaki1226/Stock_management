    import React, { useState } from 'react';
    import { useNavigate } from 'react-router-dom';
    import { login } from '../utils/api';

    const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
        const response = await login(formData);
        localStorage.setItem('token', response.data.token);
        navigate('/');
        } catch (err) {
        setError(err.response?.data?.error || 'Login failed');
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="container">
        <div className="card">
            <div className="card-header bg-primary text-white">Login</div>
            <div className="card-body">
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                </div>
                <div className="mb-3">
                <label className="form-label">Password</label>
                <input
                    type="password"
                    className="form-control"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
                </div>
                <button type="submit" className="btn btn-primary">
                Login
                </button>
            </form>
            </div>
        </div>
        </div>
    );
    };

    export default Login;