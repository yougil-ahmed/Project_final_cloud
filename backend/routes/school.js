const express = require('express');
const router = express.Router();

const moduleController = require('../controllers/moduleController');
const noteController = require('../controllers/noteController');
const emploiController = require('../controllers/emploiController');
const auth = require('../middlewares/auth');

// MODULES
router.post('/modules', auth, moduleController.createModule); // admin
router.get('/modules', auth, moduleController.getAllModules); // all
router.get('/modules/prof/:profId', auth, moduleController.getModulesByProf); // professeur

// NOTES
router.post('/notes', auth, noteController.createNote); // professeur
router.get('/notes/:stagiaireId', auth, noteController.getNotesByStagiaire); // stagiaire

// EMPLOI DU TEMPS
router.post('/emploi', auth, emploiController.create); // admin
router.get('/emploi/:userId', auth, emploiController.getByUser); // prof/stagiaire

module.exports = router;
