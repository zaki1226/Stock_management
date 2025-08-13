    import React, { useState } from 'react';
    import { useNavigate } from 'react-router-dom';
    import { forgotPassword } from '../utils/api';

    const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);
        try {
        await forgotPassword({ email });
        setSuccess('Password reset link sent to your email');
        setEmail('');
        setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
        console.error('Forgot password error:', err.response?.data || err.message);
        setError(err.response?.data?.error || 'Failed to send reset link');
        } finally {
        setLoading(false);
        }
    };

    return (
        <div className="container mt-5">
        <h2>Forgot Password</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        {loading && <div className="alert alert-info">Sending reset link...</div>}
        <form onSubmit={handleSubmit}>
            <div className="mb-3">
            <label className="form-label">Email</label>
            <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                disabled={loading}
            />
            </div>
            <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            >
            {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
            <div className="mt-3">
            <a href="/login">Back to Login</a>
            </div>
        </form>
        </div>
    );
    };

    export default ForgotPassword;