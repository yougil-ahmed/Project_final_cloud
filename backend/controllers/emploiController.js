const { EmploiDuTemps } = require('../models');

exports.create = async (req, res) => {
  const { userId, day, startTime, endTime, module } = req.body;
  try {
    const emploi = await EmploiDuTemps.create({ userId, day, startTime, endTime, module });
    res.json(emploi);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la création de l\'emploi' });
  }
};

exports.getByUser = async (req, res) => {
  const { userId } = req.params;
  const emploi = await EmploiDuTemps.findAll({ where: { userId } });
  res.json(emploi);
};
