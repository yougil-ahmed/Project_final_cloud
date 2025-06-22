const express = require('express');
const router = express.Router();
const moduleController = require('../controllers/moduleController');
const auth = require('../middlewares/auth');

// Toutes les routes nécessitent l'authentification
router.post('/', auth, moduleController.createModule);
router.get('/', auth, moduleController.getAllModules);
router.get('/:id', auth, moduleController.getModuleById);
router.put('/:id', auth, moduleController.updateModule);
router.delete('/:id', auth, moduleController.deleteModule);

module.exports = router;
