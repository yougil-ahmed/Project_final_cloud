const express = require('express');
const router = express.Router();
const multer = require('multer');
const emploiController = require('../controllers/emploiDuTempsController');
const path = require('path');

// Configuration de multer pour le téléchargement des fichiers
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Dossier de téléchargement
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
});
const upload = multer({ storage: storage });

// Télécharger un fichier et créer un emploi du temps
router.post('/', upload.single('file'), emploiController.createEmploiDuTemps);

// Récupérer tous les emplois du temps
router.get('/', emploiController.getAllEmplois);

// Supprimer un emploi du temps
router.delete('/:id', emploiController.deleteEmploi);

module.exports = router;
