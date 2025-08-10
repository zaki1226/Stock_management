    import React, { useState, useEffect } from 'react';
    import { useNavigate } from 'react-router-dom';
    import { getAllUsers } from '../utils/api';

    const UserEditModal = ({ onClose }) => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
        try {
            const response = await getAllUsers();
            console.log('Fetched users for edit modal:', response.data);
            setUsers(response.data);
            setError('');
        } catch (err) {
            console.error('Failed to fetch users:', err);
            setError(err.response?.data?.error || 'Failed to load users');
        }
        };
        fetchUsers();
    }, []);

    const handleEdit = () => {
        console.log('handleEdit triggered, selectedUserId:', selectedUserId);
        if (selectedUserId) {
        console.log('Navigating to:', `/users/edit/${selectedUserId}`);
        navigate(`/users/edit/${selectedUserId}`);
        onClose();
        } else {
        setError('Please select a user to edit');
        }
    };

    const handleUserSelect = (e) => {
        const userId = e.target.value;
        console.log('Selected user ID:', userId);
        setSelectedUserId(userId);
        setError('');
    };

    return (
        <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <div className="modal-dialog">
            <div className="modal-content">
            <div className="modal-header">
                <h5 className="modal-title">Edit User</h5>
                <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body">
                {error && <div className="alert alert-danger">{error}</div>}
                <select
                className="form-select"
                value={selectedUserId}
                onChange={handleUserSelect}
                >
                <option value="">Select a user</option>
                {users.length > 0 ? (
                    users.map(user => (
                    <option key={user._id} value={user._id}>
                        {user.email} ({user.firstName} {user.lastName})
                    </option>
                    ))
                ) : (
                    <option value="" disabled>No users available</option>
                )}
                </select>
            </div>
            <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
                </button>
                <button
                type="button"
                className="btn btn-primary"
                onClick={handleEdit}
                disabled={!selectedUserId}
                >
                Edit
                </button>
            </div>
            </div>
        </div>
        </div>
    );
    };

    export default UserEditModal;