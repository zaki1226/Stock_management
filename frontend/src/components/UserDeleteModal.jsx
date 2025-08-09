    import React, { useState, useEffect } from 'react';
    import { getAllUsers, deleteUser } from '../utils/api';

    const UserDeleteModal = ({ onClose }) => {
    const [users, setUsers] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showConfirm, setShowConfirm] = useState(false);

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

    const handleDelete = async () => {
        if (!selectedUserId) {
        setError('Please select a user');
        return;
        }
        setShowConfirm(true); // Show confirmation prompt
    };

    const confirmDelete = async () => {
        try {
        await deleteUser(selectedUserId);
        setSuccess('User deleted successfully');
        setError('');
        setShowConfirm(false);
        setTimeout(() => {
            setSuccess('');
            onClose();
        }, 2000); // Close modal after 2 seconds
        } catch (err) {
        setError(err.response?.data?.error || 'Failed to delete user');
        setShowConfirm(false);
        }
    };

    return (
        <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <div className="modal-dialog">
            <div className="modal-content">
            <div className="modal-header">
                <h5 className="modal-title">Delete User</h5>
                <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body">
                {success && <div className="alert alert-success">{success}</div>}
                {error && <div className="alert alert-danger">{error}</div>}
                {showConfirm ? (
                <div>
                    <p>Are you sure you want to delete this user?</p>
                    <div className="d-flex justify-content-between">
                    <button type="button" className="btn btn-secondary" onClick={() => setShowConfirm(false)}>
                        Cancel
                    </button>
                    <button type="button" className="btn btn-danger" onClick={confirmDelete}>
                        Confirm
                    </button>
                    </div>
                </div>
                ) : (
                <select
                    className="form-select"
                    value={selectedUserId}
                    onChange={(e) => setSelectedUserId(e.target.value)}
                >
                    <option value="">Select a user</option>
                    {users.map(user => (
                    <option key={user._id} value={user._id}>
                        {user.email} ({user.firstName} {user.lastName})
                    </option>
                    ))}
                </select>
                )}
            </div>
            {!showConfirm && !success && (
                <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={onClose}>
                    Cancel
                </button>
                <button type="button" className="btn btn-danger" onClick={handleDelete}>
                    Delete
                </button>
                </div>
            )}
            </div>
        </div>
        </div>
    );
    };

    export default UserDeleteModal;