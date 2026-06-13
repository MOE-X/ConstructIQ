'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class WRole extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      //Woker wRole relation
      WRole.hasMany(models.Worker, {
        foreignKey: 'wRoleId',
        constraints: true,
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
      })
    }
  }
  WRole.init({
    wRoleId: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    role: DataTypes.STRING,
    wRoleIsActive: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'WRole',
  });
  return WRole;
};