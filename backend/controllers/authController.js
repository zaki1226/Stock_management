    const User = require('../models/User');
    const jwt = require('jsonwebtoken');

    const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
        return res.status(401).json({ error: 'Invalid credentials' });
        }
        const token = jwt.sign(
        { userId: user._id.toString(), email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
        );
        res.status(200).json({ token, userId: user._id.toString() });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Server error' });
    }
    };

    module.exports = { login };