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
        const isExpired = payload.exp * 1000 < Date.now();
        if (isExpired) {
            console.log('Removing expired token');
            localStorage.removeItem('token');
        } else {
            config.headers.Authorization = `Bearer ${token}`;
        }
        } catch (error) {
        console.error('Error parsing token:', error);
        localStorage.removeItem('token');
        }
    } else {
        console.warn('No token found in localStorage');
    }
    return config;
    }, (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
    });

    export const createUser = async (data) => {
    try {
        const response = await api.post('/users', data);
        console.log('Create user response:', response.data);
        return response;
    } catch (error) {
        console.error('Create user error:', error.response || error);
        throw error;
    }
    };

    export const updateUser = async (id, data) => {
    try {
        const response = await api.put(`/users/${id}`, data);
        console.log('Update user response:', response.data);
        return response;
    } catch (error) {
        console.error('Update user error:', error.response || error);
        throw error;
    }
    };

    export const deleteUser = async (id) => {
    try {
        const response = await api.delete(`/users/${id}`);
        console.log('Delete user response:', response.data);
        return response;
    } catch (error) {
        console.error('Delete user error:', error.response || error);
        throw error;
    }
    };

    export const getUser = async (id) => {
    try {
        const response = await api.get(`/users/${id}`);
        console.log('Get user response:', response.data);
        return response;
    } catch (error) {
        console.error('Get user error:', error.response || error);
        throw error;
    }
    };

    export const getAllUsers = async () => {
    try {
        const response = await api.get('/users');
        console.log('Get all users response:', response.data);
        return response;
    } catch (error) {
        console.error('Get all users error:', error.response || error);
        throw error;
    }
    };

    export const getRoles = async () => {
    try {
        const response = await api.get('/roles');
        console.log('Get roles response:', response.data);
        return response;
    } catch (error) {
        console.error('Get roles error:', error.response || error);
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
        console.error('Assign role error:', error.response || error);
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
        console.error('Login error:', error.response || error);
        throw error;
    }
    };

    export default api;