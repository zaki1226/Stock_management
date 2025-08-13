    import React, { useState, useEffect } from 'react';
    import { useNavigate, useSearchParams } from 'react-router-dom';
    import { resetPassword } from '../utils/api';

    const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const email = searchParams.get('email');
    const token = searchParams.get('token');

    useEffect(() => {
        if (!email || !token) {
        setError('Invalid or missing reset token');
        setTimeout(() => navigate('/login'), 3000);
        }
    }, [email, token, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        if (newPassword !== confirmPassword) {
        setError('Passwords do not match');
        return;
        }
        setLoading(true);
        try {
        await resetPassword({ email, token, newPassword });
        setSuccess('Password reset successfully. Redirecting to login...');
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
        console.error('Reset password error:', err.response?.data || err.message);
        setError(err.response?.data?.error || 'Failed to reset password');
        } finally {
        setLoading(false);
        }
    };

    return (
        <div className="container mt-5">
        <h2>Reset Password</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        {loading && <div className="alert alert-info">Resetting password...</div>}
        <form onSubmit={handleSubmit}>
            <div className="mb-3">
            <label className="form-label">New Password</label>
            <input
                type="password"
                className="form-control"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                disabled={loading}
            />
            </div>
            <div className="mb-3">
            <label className="form-label">Confirm Password</label>
            <input
                type="password"
                className="form-control"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                disabled={loading}
            />
            </div>
            <button
            type="submit"
            className="btn btn-primary"
            disabled={loading || !email || !token}
            >
            {loading ? 'Resetting...' : 'Reset Password'}
            </button>
            <div className="mt-3">
            <a href="/login">Back to Login</a>
            </div>
        </form>
        </div>
    );
    };

    export default ResetPassword;