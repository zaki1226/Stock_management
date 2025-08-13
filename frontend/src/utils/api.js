    import axios from 'axios';

    const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: { 'Content-Type': 'application/json' }
    });

    api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log('API token payload:', payload);
        const isExpired = payload.exp * 1000 < Date.now();
        if (isExpired) {
            console.log('Removing expired token');
            localStorage.removeItem('token');
            window.location.href = '/'; // Redirect to login
        } else {
            config.headers.Authorization = `Bearer ${token}`;
        }
        } catch (error) {
        console.error('Error parsing token:', error.message);
        localStorage.removeItem('token');
        window.location.href = '/'; // Redirect to login
        }
    } else {
        console.warn('No token found in localStorage for request:', config.url);
    }
    return config;
    }, (error) => {
    console.error('Request interceptor error:', error.message);
    return Promise.reject(error);
    });

    export const createUser = async (data) => {
    try {
        const response = await api.post('/users', data);
        console.log('Create user response:', response.data);
        return response;
    } catch (error) {
        console.error('Create user error:', error.response?.data || error.message);
        throw error;
    }
    };

    export const updateUser = async (id, data) => {
    try {
        const response = await api.put(`/users/${id}`, data);
        console.log('Update user response:', response.data);
        return response;
    } catch (error) {
        console.error('Update user error:', error.response?.data || error.message);
        throw error;
    }
    };

    export const deleteUser = async (id) => {
    try {
        const response = await api.delete(`/users/${id}`);
        console.log('Delete user response:', response.data);
        return response;
    } catch (error) {
        console.error('Delete user error:', error.response?.data || error.message);
        throw error;
    }
    };

    export const getUser = async (id) => {
    try {
        const response = await api.get(`/users/${id}`);
        console.log('Get user response:', response.data);
        return response;
    } catch (error) {
        console.error('Get user error:', error.response?.data || error.message);
        throw error;
    }
    };

    export const getAllUsers = async () => {
    try {
        const response = await api.get('/users');
        console.log('Get all users response:', response.data);
        return response;
    } catch (error) {
        console.error('Get all users error:', error.response?.data || error.message);
        throw error;
    }
    };

    export const getRoles = async () => {
    try {
        const response = await api.get('/roles');
        console.log('Get roles response:', response.data);
        return response;
    } catch (error) {
        console.error('Get roles error:', error.response?.data || error.message);
        throw error;
    }
    };

    export const getPermissions = async () => {
    try {
        const response = await api.get('/permissions');
        console.log('Get permissions response:', response.data);
        return response;
    } catch (error) {
        console.error('Get permissions error:', error.response?.data || error.message);
        throw error;
    }
    };

    export const createPermission = async (data) => {
    console.log('Sending createPermission request:', data);
    try {
        const response = await api.post('/permissions', data);
        console.log('Create permission response:', response.data);
        return response;
    } catch (error) {
        console.error('Create permission error:', error.response?.data || error.message);
        throw error;
    }
    };

    export const deleteRole = async (id) => {
    try {
        const response = await api.delete(`/roles/${id}`);
        console.log('Delete role response:', response.data);
        return response;
    } catch (error) {
        console.error('Delete role error:', error.response?.data || error.message);
        throw error;
    }
    };

    export const createRole = async (data) => {
    console.log('Sending createRole request:', data);
    try {
        const response = await api.post('/roles', data);
        console.log('Create role response:', response.data);
        return response;
    } catch (error) {
        console.error('Create role error:', error.response?.data || error.message);
        throw error;
    }
    };

    export const assignRole = async (data) => {
    console.log('Sending assignRole request:', data);
    try {
        const response = await api.post('/roles/assign', data);
        console.log('Assign role response:', response.data);
        return response;
    } catch (error) {
        console.error('Assign role error:', error.response?.data || error.message);
        throw error;
    }
    };

    export const removeRole = async (data) => {
    console.log('Sending removeRole request:', data);
    try {
        const response = await api.post('/roles/remove', data);
        console.log('Remove role response:', response.data);
        return response;
    } catch (error) {
        console.error('Remove role error:', error.response?.data || error.message);
        throw error;
    }
    };
        export const updateRole = async (roleId, data) => {
    try {
        const response = await api.put(`/roles/${roleId}`, data);
        console.log('Update role response:', response.data);
        return response;
    } catch (error) {
        console.error('Update role error:', error.response?.data || error.message);
        throw error;
    }
    };

    export const login = async (data) => {
    console.log('Sending login request:', data);
    try {
        const response = await api.post('/auth/login', data);
        console.log('Login response:', response.data);
        localStorage.setItem('token', response.data.token);
        return response;
    } catch (error) {
        console.error('Login error:', error.response?.data || error.message, error.response?.status);
        throw error;
    }
    };

    export const forgotPassword = async (data) => {
    console.log('Sending forgot password request:', data);
    try {
        const response = await api.post('/auth/forgot-password', data);
        console.log('Forgot password response:', response.data);
        return response;
    } catch (error) {
        console.error('Forgot password error:', error.response?.data || error.message, error.response?.status);
        throw error;
    }
    };

    export const resetPassword = async (data) => {
    console.log('Sending reset password request:', data);
    try {
        const response = await api.post('/auth/reset-password', data);
        console.log('Reset password response:', response.data);
        return response;
    } catch (error) {
        console.error('Reset password error:', error.response?.data || error.message, error.response?.status);
        throw error;
    }
    };

    export default api;