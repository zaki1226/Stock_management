const express = require('express');
const router = express.Router();
const { createPermission, getPermissions, deletePermission } = require('../controllers/roleController');

router.post('/', createPermission);
router.get('/', getPermissions);
router.delete('/:id', deletePermission);

module.exports = router;