    require('dotenv').config(); // Load environment variables
    const express = require('express');
    const mongoose = require('mongoose');
    const cors = require('cors');
    const authRoutes = require('./routes/authRoutes');
    const userRoutes = require('./routes/userRoutes');
    const roleRoutes = require('./routes/roleRoutes');
    const permissionRoutes = require('./routes/permissions');
    const authMiddleware = require('./middleware/auth');
    const connectDB = require('./config/db');

    const app = express();

    app.use(cors());
    app.use(express.json());

    // Connect to MongoDB
    connectDB();

    // Routes
    app.use('/api/auth', authRoutes);
    app.use('/api/users', authMiddleware, userRoutes);
    app.use('/api/roles', authMiddleware, roleRoutes);
    app.use('/api/permissions', authMiddleware, permissionRoutes);

    // Error handling middleware
    app.use((err, req, res, next) => {
    console.error('Server error:', err.message);
    res.status(500).json({ error: 'Server error' });
    });

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));