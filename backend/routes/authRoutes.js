    const express = require('express');
    const router = express.Router();
    const userController = require('../controllers/userController');
    const roleController = require('../controllers/roleController');
    const jwt = require('jsonwebtoken');

    const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        console.error('No token provided in request');
        return res.status(401).json({ error: 'No token provided' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Token verification error:', error.message);
        res.status(401).json({ error: 'Invalid or expired token' });
    }
    };

    router.post('/login', (req, res, next) => {
    console.log('Received POST /api/auth/login request:', req.body);
    userController.login(req, res, next);
    });
    router.get('/users', authenticate, userController.getAllUsers);
    router.get('/users/:id', authenticate, userController.getUser);
    router.post('/users', authenticate, userController.createUser);
    router.put('/users/:id', authenticate, userController.updateUser);
    router.delete('/users/:id', authenticate, userController.deleteUser);
    router.get('/roles', authenticate, roleController.getRoles);

    module.exports = router;