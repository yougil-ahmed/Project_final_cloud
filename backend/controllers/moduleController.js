const { Module } = require('../models');

exports.createModule = async (req, res) => {
  try {
    const { name, professeurId } = req.body;
    const module = await Module.create({ name, professeurId });
    res.status(201).json(module);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création du module' });
  }
};

exports.getAllModules = async (req, res) => {
  try {
    const modules = await Module.findAll();
    res.json(modules);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des modules' });
  }
};

exports.getModuleById = async (req, res) => {
  try {
    const module = await Module.findByPk(req.params.id);
    if (!module) return res.status(404).json({ error: 'Module non trouvé' });
    res.json(module);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération du module' });
  }
};

exports.updateModule = async (req, res) => {
  try {
    const { name, professeurId } = req.body;
    const module = await Module.findByPk(req.params.id);
    if (!module) return res.status(404).json({ error: 'Module non trouvé' });

    module.name = name || module.name;
    module.professeurId = professeurId || module.professeurId;
    await module.save();

    res.json(module);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour du module' });
  }
};

exports.deleteModule = async (req, res) => {
  try {
    const module = await Module.findByPk(req.params.id);
    if (!module) return res.status(404).json({ error: 'Module non trouvé' });
    await module.destroy();
    res.json({ message: 'Module supprimé' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression du module' });
  }
};
