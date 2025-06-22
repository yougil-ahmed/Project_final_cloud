const { Note, Module, User } = require('../models');

exports.createNote = async (req, res) => {
  const { moduleId, stagiaireId, value } = req.body;
  try {
    const note = await Note.create({ moduleId, stagiaireId, value });
    res.json(note);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de l\'ajout de la note' });
  }
};

exports.getNotesByStagiaire = async (req, res) => {
  const { stagiaireId } = req.params;
  const notes = await Note.findAll({
    where: { stagiaireId },
    include: [Module]
  });
  res.json(notes);
};
