const express = require('express');
const router = express.Router();
const classeController = require('../controllers/classeController');

router.post('/', classeController.createClasse);
router.get('/', classeController.getAllClasses);
router.get('/:id', classeController.getClasseById);
router.put('/:id', classeController.updateClasse);
router.delete('/:id', classeController.deleteClasse);

module.exports = router;
