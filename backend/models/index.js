'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const config = require(__dirname + '/../config/config.json')['development'];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// Import models
db.User = require('./user')(sequelize, Sequelize.DataTypes);
db.Module = require('./module')(sequelize, Sequelize.DataTypes);
db.Note = require('./note')(sequelize, Sequelize.DataTypes);
db.EmploiDuTemps = require('./emploidutemps')(sequelize, Sequelize.DataTypes);
db.Classe = require('./classe')(sequelize, Sequelize.DataTypes);
db.EmploiDuTemps = require('./emploidutemps')(sequelize, Sequelize.DataTypes);

// Define relationships

// User <=> Module (professeur)
db.User.hasMany(db.Module, { foreignKey: 'professeurId', as: 'modules' });
db.Module.belongsTo(db.User, { foreignKey: 'professeurId', as: 'professeur' });

// User <=> Note (stagiaire)
db.User.hasMany(db.Note, { foreignKey: 'stagiaireId', as: 'notes' });
db.Note.belongsTo(db.User, { foreignKey: 'stagiaireId', as: 'stagiaire' });

// Module <=> Note
db.Module.hasMany(db.Note, { foreignKey: 'moduleId', as: 'notes' });
db.Note.belongsTo(db.Module, { foreignKey: 'moduleId', as: 'module' });

// User <=> EmploiDuTemps
db.User.hasMany(db.EmploiDuTemps, { foreignKey: 'userId', as: 'emploiDuTemps' });
db.EmploiDuTemps.belongsTo(db.User, { foreignKey: 'userId', as: 'user' });


// Classe <=> Professeur
db.User.hasMany(db.Classe, { foreignKey: 'professeurId', as: 'classesDirigees' });
db.Classe.belongsTo(db.User, { foreignKey: 'professeurId', as: 'professeurResponsable' });

// Classe <=> Stagiaires (many-to-many)
db.Classe.belongsToMany(db.User, {
  through: 'ClasseStagiaires',
  as: 'stagiaires',
  foreignKey: 'classeId',
  otherKey: 'stagiaireId',
});
db.User.belongsToMany(db.Classe, {
  through: 'ClasseStagiaires',
  as: 'classes',
  foreignKey: 'stagiaireId',
  otherKey: 'classeId',
});

// Classe <=> Modules (one-to-many)
db.Classe.hasMany(db.Module, { foreignKey: 'classeId', as: 'modules' });
db.Module.belongsTo(db.Classe, { foreignKey: 'classeId', as: 'classe' });


// Classe <=> EmploiDuTemps
db.Classe.hasMany(db.EmploiDuTemps, { foreignKey: 'classId', as: 'emploisDuTemps' });
db.EmploiDuTemps.belongsTo(db.Classe, { foreignKey: 'classId', as: 'classe' });

// EmploiDuTemps <=> Professeur
db.User.hasMany(db.EmploiDuTemps, { foreignKey: 'professeurId', as: 'emploisDuTemps' });
db.EmploiDuTemps.belongsTo(db.User, { foreignKey: 'professeurId', as: 'professeur' });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
