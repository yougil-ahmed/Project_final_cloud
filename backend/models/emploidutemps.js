'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class EmploiDuTemps extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  EmploiDuTemps.init({
    startTime: DataTypes.DATE,
    endTime: DataTypes.DATE,
    file: DataTypes.STRING,
    classId: DataTypes.INTEGER,
    professeurId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'EmploiDuTemps',
  });
  return EmploiDuTemps;
};