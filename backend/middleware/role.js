    const User = require('../models/User');

    module.exports = (roles) => async (req, res, next) => {
    try {
        console.log('Token payload:', req.user);
        let user;
        if (req.user.userId) {
        user = await User.findById(req.user.userId).populate('roles');
        } else if (req.user.email) {
        user = await User.findOne({ email: req.user.email }).populate('roles');
        }
        console.log('Authenticated User:', user);
        if (!user) return res.status(401).json({ error: 'User not found' });
        const userRoles = user.roles.map(role => role.name.toLowerCase());
        console.log('User Roles:', userRoles);
        if (!roles.some(role => userRoles.includes(role.toLowerCase()))) {
        return res.status(403).json({ error: 'Access denied' });
        }
        req.user.userId = user._id.toString();
        next();
    } catch (error) {
        console.error('Role middleware error:', error);
        res.status(500).json({ error: 'Server error' });
    }
    };