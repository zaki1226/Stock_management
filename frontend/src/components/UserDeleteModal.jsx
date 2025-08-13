    import React, { useEffect, useState } from 'react';
    import { deleteUser } from '../utils/api';

    const UserDeleteModal = ({ show, userId, onClose }) => {
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (show) {
        setError('');
        setSuccess('');
        }
    }, [show]);

    const handleDelete = async () => {
        if (!userId) {
        setError('Please select a user');
        return;
        }
        try {
        await deleteUser(userId);
        setSuccess('User deleted successfully');
        setTimeout(() => {
            setSuccess('');
            onClose();
        }, 2000);
        } catch (err) {
        setError(err.response?.data?.error || 'Failed to delete user');
        }
    };

    if (!show) return null;

    return (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1" role="dialog">
        <div className="modal-dialog" role="document">
            <div className="modal-content">
            <div className="modal-header">
                <h5 className="modal-title">Delete User</h5>
                <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
            </div>
            <div className="modal-body">
                {success && <div className="alert alert-success">{success}</div>}
                {error && <div className="alert alert-danger">{error}</div>}
                <p>Are you sure you want to delete this user?</p>
            </div>
            <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                <button type="button" className="btn btn-danger" onClick={handleDelete}>Confirm</button>
            </div>
            </div>
        </div>
        </div>
    );
    };

    export default UserDeleteModal;