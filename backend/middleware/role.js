    const User = require('../models/User');

    module.exports = (roles) => async (req, res, next) => {
    try {
        console.log('Token payload:', req.user); // Debug log
        // Use token roles as fallback
        let userRoles = Array.isArray(req.user.roles)
        ? req.user.roles.map(role => role.toLowerCase()).filter(Boolean)
        : [];
        console.log('Token user roles:', userRoles); // Debug log

        // Fetch user from database for verification
        let user;
        if (req.user.userId) {
        user = await User.findById(req.user.userId).populate('roles');
        } else if (req.user.email) {
        user = await User.findOne({ email: req.user.email }).populate('roles');
        }
        console.log('Authenticated User:', user); // Debug log
        if (!user) {
        console.warn('User not found in database, using token roles');
        } else {
        userRoles = Array.isArray(user.roles)
            ? user.roles.map(role => role.name?.toLowerCase() || '').filter(Boolean)
            : [];
        console.log('Database user roles:', userRoles); // Debug log
        }

        if (!roles.some(role => userRoles.includes(role.toLowerCase()))) {
        return res.status(403).json({ error: 'Access denied' });
        }
        req.user.userId = user ? user._id.toString() : req.user.userId;
        req.user.roles = userRoles;
        next();
    } catch (error) {
        console.error('Role middleware error:', error);
        res.status(500).json({ error: 'Server error' });
    }
    };