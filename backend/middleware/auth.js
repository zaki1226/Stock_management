    const jwt = require('jsonwebtoken');

    module.exports = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        console.log('Auth middleware: No token provided for', req.originalUrl);
        return res.status(401).json({ error: 'Access denied, no token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
        console.log('Auth middleware: Decoded token:', decoded);
        req.user = decoded;
        if (!decoded.roles || !decoded.roles.includes('admin')) {
        console.log('Auth middleware: Access denied, not an admin for', req.originalUrl);
        return res.status(403).json({ error: 'Access denied, admin only' });
        }
        next();
    } catch (error) {
        console.error('Auth middleware: Invalid token:', error.message);
        res.status(401).json({ error: 'Invalid token' });
    }
    };