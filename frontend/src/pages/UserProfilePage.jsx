    import React, { useState, useEffect } from 'react';
    import { useParams, useNavigate } from 'react-router-dom';
    import { getUser } from '../utils/api';
    import UserDeleteModal from '../components/UserDeleteModal.jsx';

    const UserProfilePage = () => {
    const [user, setUser] = useState({});
    const [showModal, setShowModal] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (id) {
        const fetchUser = async () => {
            try {
            const response = await getUser(id);
            setUser(response.data);
            } catch (error) {
            console.error(error);
            }
        };
        fetchUser();
        }
    }, [id]);

    return (
        <div className="container">
        <div className="card">
            <div className="card-header bg-primary text-white">User Profile</div>
            <div className="card-body">
            <p><strong>First Name:</strong> {user.firstName}</p>
            <p><strong>Middle Name:</strong> {user.middleName}</p>
            <p><strong>Last Name:</strong> {user.lastName}</p>
            <p><strong>Phone Number:</strong> {user.phoneNumber}</p>
            <p><strong>Address:</strong> {user.address}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Roles:</strong> {user.roles?.map((role) => role.name).join(', ')}</p>
            <button
                className="btn btn-primary me-2"
                onClick={() => navigate(`/users/edit/${id}`)}
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