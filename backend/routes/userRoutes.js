const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/', auth, userController.createUser);
router.get('/', auth, userController.getAllUsers);
router.get('/:id', auth, userController.getUserById);
router.put('/:id', auth, userController.updateUser);
router.delete('/:id', auth, userController.deleteUser);

module.exports = router;
