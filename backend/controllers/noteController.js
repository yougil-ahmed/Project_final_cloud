// controllers/noteController.js
const { Note, Module, User } = require('../models');

// Create note
exports.createNote = async (req, res) => {
  try {
    const { value, moduleId, stagiaireId } = req.body;
    const note = await Note.create({ value, moduleId, stagiaireId });
    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la création de la note", error });
  }
};

// Get all notes
exports.getAllNotes = async (_req, res) => {
  try {
    const notes = await Note.findAll({
      include: [
        { model: Module, as: 'module' },
        { model: User, as: 'stagiaire' }
      ]
    });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des notes", error });
  }
};

// Get note by ID
exports.getNoteById = async (req, res) => {
  try {
    const noteId = parseInt(req.params.id, 10);
    if (isNaN(noteId)) {
      return res.status(400).json({ message: 'ID de note invalide' });
    }
    const note = await Note.findByPk(noteId, {
      include: [
        { model: Module, as: 'module' },
        { model: User, as: 'stagiaire' }
      ]
    });
    if (!note) return res.status(404).json({ message: 'Note non trouvée' });
    res.json(note);
  } catch (error) {
    console.error('Erreur lors de la récupération de la note:', error);
    res.status(500).json({ message: "Erreur lors de la récupération de la note", error: error.message });
  }
};

// Update note
exports.updateNote = async (req, res) => {
  try {
    const { value, moduleId, stagiaireId } = req.body;
    const note = await Note.findByPk(req.params.id);
    if (!note) return res.status(404).json({ message: 'Note non trouvée' });

    note.value = value;
    note.moduleId = moduleId;
    note.stagiaireId = stagiaireId;

    await note.save();
    res.json(note);
  } catch (error) {
    res.status(500).json({ message: "Erreur", error });
  }
};

// Delete note
exports.deleteNote = async (req, res) => {
  try {
    const note = await Note.findByPk(req.params.id);
    if (!note) return res.status(404).json({ message: 'Note non trouvée' });
    await note.destroy();
    res.json({ message: 'Note supprimée' });
  } catch (error) {
    res.status(500).json({ message: "Erreur", error });
  }
};
