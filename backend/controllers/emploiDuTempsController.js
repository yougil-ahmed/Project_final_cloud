const { EmploiDuTemps, Classe, User } = require('../models');
const path = require('path');
const fs = require('fs');

module.exports = {

    // Upload fichier & créer emploi du temps
    async createEmploiDuTemps(req, res) {
        try {
            const { startTime, endTime, classId, professeurId } = req.body;
            if (!req.file) return res.status(400).json({ message: 'Fichier requis' });

            // Nom du fichier téléchargé
            const file = req.file.filename;

            const emploi = await EmploiDuTemps.create({
                startTime,
                endTime,
                file,
                classId: classId || null,
                professeurId: professeurId || null,
            });

            res.status(201).json(emploi);

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Erreur lors de la création de l\'emploi du temps', error });
        }
    },

    // Récupérer tous les emplois du temps
    async getAllEmplois(req, res) {
        try {
            const emplois = await EmploiDuTemps.findAll({
                include: [
                    { model: Classe, as: 'classe' },
                    { model: User, as: 'professeur' }
                ]
            });
            res.json(emplois);
        } catch (error) {
            res.status(500).json({ message: 'Erreur lors de la récupération des emplois du temps', error });
        }
    },

    // Supprimer un emploi du temps avec le fichier
    async deleteEmploi(req, res) {
        try {
            const emploi = await EmploiDuTemps.findByPk(req.params.id);
            if (!emploi) return res.status(404).json({ message: 'Emploi du temps non trouvé' });

            // Supprimer le fichier du serveur
            const filePath = path.join(__dirname, '..', 'uploads', emploi.file);
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

            await emploi.destroy();
            res.json({ message: 'Emploi du temps supprimé' });
        } catch (error) {
            res.status(500).json({ message: 'Erreur lors de la suppression de l\'emploi du temps', error });
        }
    }

};
