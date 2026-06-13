'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PStatus extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      PStatus.hasMany(models.Project, {
        foreignKey: 'pStatusId',
        constraints: true,
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
      })
    }
  }
  PStatus.init({
    pStatusId: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    status: DataTypes.STRING,
    pStatusIsActive: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'PStatus',
  });
  return PStatus;
};