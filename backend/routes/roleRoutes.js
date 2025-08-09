const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');
const authMiddleware = require('../middleware/auth');
const roleMiddleware = require('../middleware/role');

// Protect all routes with authentication
router.use(authMiddleware);

// Role-based access control for admin
router.post('/', roleMiddleware(['admin']), roleController.createRole);
router.post('/assign', roleMiddleware(['admin']), roleController.assignRole);
router.get('/', roleMiddleware(['admin', 'manager']), roleController.getRoles);
router.post('/permissions', roleMiddleware(['admin']), roleController.createPermission);
router.get('/permissions', roleMiddleware(['admin', 'manager']), roleController.getPermissions);

module.exports = router;