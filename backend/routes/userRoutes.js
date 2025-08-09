const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');
const roleMiddleware = require('../middleware/role');

router.use(authMiddleware);

router.post('/', roleMiddleware(['admin', 'manager']), userController.createUser);
router.put('/:id', roleMiddleware(['admin', 'manager']), userController.updateUser);
router.delete('/:id', roleMiddleware(['admin']), userController.deleteUser); // Line 11
router.get('/:id', roleMiddleware(['admin', 'manager', 'staff']), userController.getUser);
router.get('/', roleMiddleware(['admin', 'manager']), userController.getAllUsers);
router.get('/me', userController.getUser);

module.exports = router;