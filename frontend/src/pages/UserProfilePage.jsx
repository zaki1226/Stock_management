    import React, { useState, useEffect } from 'react';
    import { useParams, useNavigate } from 'react-router-dom';
    import { getUser } from '../utils/api';
    import UserDeleteModal from '../components/UserDeleteModal.jsx';

    const UserProfilePage = () => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (id) {
        const fetchUser = async () => {
            try {
            console.log('Fetching user with ID:', id);
            const response = await getUser(id);
            setUser(response.data);
            } catch (error) {
            console.error('Error fetching user:', error);
            setError(error.response?.data?.error || 'Failed to load user');
            }
        };
        fetchUser();
        } else {
        setError('Invalid user ID');
        }
    }, [id]);

    const handleEdit = () => {
        console.log('Navigating to edit for user ID:', id);
        navigate(`/users/edit/${id}`);
    };

    if (error) {
        return (
        <div className="container mt-5">
            <div className="alert alert-danger">{error}</div>
        </div>
        );
    }

    if (!user) {
        return (
        <div className="container mt-5">
            <div className="alert alert-info">Loading...</div>
        </div>
        );
    }

    return (
        <div className="container mt-5">
        <div className="card">
            <div className="card-header bg-primary text-white">User Profile</div>
            <div className="card-body">
            <p><strong>First Name:</strong> {user.firstName || 'N/A'}</p>
            <p><strong>Middle Name:</strong> {user.middleName || 'N/A'}</p>
            <p><strong>Last Name:</strong> {user.lastName || 'N/A'}</p>
            <p><strong>Phone Number:</strong> {user.phoneNumber || 'N/A'}</p>
            <p><strong>Address:</strong> {user.address || 'N/A'}</p>
            <p><strong>Email:</strong> {user.email || 'N/A'}</p>
            <p>
                <strong>Roles:</strong>{' '}
                {user.roles && Array.isArray(user.roles) && user.roles.length > 0
                ? user.roles.map((role) => role.name || 'Unknown').join(', ')
                : 'None'}
            </p>
            <button
                className="btn btn-primary me-2"
                onClick={handleEdit}
            >
                Edit
            </button>
            <button
                className="btn btn-danger"
                onClick={() => setShowModal(true)}
            >
                Delete
            </button>
            </div>
        </div>
        {showModal && <UserDeleteModal userId={id} onClose={() => setShowModal(false)} />}
        </div>
    );
    };

    export default UserProfilePage;