    import axios from 'axios';

    const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: { 'Content-Type': 'application/json' },
    });

    api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    } else {
        console.warn('No token found in localStorage');
    }
    return config;
    });

    export const createUser = async (data) => api.post('/users', data);
    export const updateUser = async (id, data) => api.put(`/users/${id}`, data);
    export const deleteUser = async (id) => api.delete(`/users/${id}`);
    export const getUser = async (id) => api.get(`/users/${id}`);
    export const getAllUsers = async () => api.get('/users');
    export const getRoles = async () => api.get('/roles');
    export const assignRole = async (data) => api.post('/roles/assign', data); // Add this
    export const login = async (data) => api.post('/auth/login', data);

    export default api;