const db = require('../models');
const Classe = db.Classe;

// Create a new classe
exports.createClasse = async (req, res) => {
    try {
        const classe = new Classe(req.body);
        await classe.save();
        res.status(201).json(classe);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Get all classes
exports.getAllClasses = async (req, res) => {
    try {
        const classes = await Classe.findAll(); // Changed from find() to findAll()
        res.json(classes);
    } catch (err) {
        res.status(500).json({ 
            error: err.message,
            stack: err.stack // Helpful for debugging
        });
    }
};

// Get a single classe by ID
exports.getClasseById = async (req, res) => {
    try {
        const classe = await Classe.findById(req.params.id);
        if (!classe) return res.status(404).json({ error: 'Classe not found' });
        res.json(classe);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update a classe by ID
exports.updateClasse = async (req, res) => {
    try {
        const classe = await Classe.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!classe) return res.status(404).json({ error: 'Classe not found' });
        res.json(classe);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Delete a classe by ID
exports.deleteClasse = async (req, res) => {
    try {
        const classe = await Classe.findByIdAndDelete(req.params.id);
        if (!classe) return res.status(404).json({ error: 'Classe not found' });
        res.json({ message: 'Classe deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};