    const express = require('express');
    const router = express.Router();
    const roleController = require('../controllers/roleController');
    const userController = require('../controllers/userController');
    const authMiddleware = require('../middleware/auth');
    const roleMiddleware = require('../middleware/role');

    // Protect all routes with authentication
    router.use(authMiddleware);

    // Role-based access control
    router.post('/', roleMiddleware(['admin']), roleController.createRole);
    router.put('/:id', roleMiddleware(['admin']), roleController.updateRole); // Added PUT endpoint
    router.delete('/:id', roleMiddleware(['admin']), roleController.deleteRole);
    router.post('/assign', roleMiddleware(['admin']), (req, res, next) => {
    console.log('Received POST /api/roles/assign request:', req.body);
    userController.assignRole(req, res, next);
    });
    router.post('/remove', roleMiddleware(['admin']), (req, res, next) => {
    console.log('Received POST /api/roles/remove request:', req.body);
    userController.removeRole(req, res, next);
    });
    router.get('/', roleMiddleware(['admin', 'manager']), roleController.getRoles);
    router.post('/permissions', roleMiddleware(['admin']), roleController.createPermission);
    router.delete('/permissions/:id', roleMiddleware(['admin']), roleController.deletePermission);
    router.get('/permissions', roleMiddleware(['admin', 'manager']), roleController.getPermissions);

    module.exports = router;