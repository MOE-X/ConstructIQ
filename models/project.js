'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Project extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      //Project pStatus relation
      Project.belongsTo(models.PStatus, {
        foreignKey: 'pStatusId',
        constraints: true,
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
      })

      //Project Expense relation
      Project.hasMany(models.Expense, {
        foreignKey: 'projectId',
        constraints: true,
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
      })

      //Project Worker through attendance relation
      Project.belongsToMany(models.Worker, {
        through: models.Attendance,
        foreignKey: 'projectId',
        otherKey: 'workerId',
        constraints: true,
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
      })

      //Project Worker through payment relation
      Project.belongsToMany(models.Worker, {
        through: models.Payment,
        foreignKey: 'projectId',
        otherKey: 'workerId',
        constraints: true,
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
      })

      //Project Worker through account relation
      Project.belongsToMany(models.Worker, {
        through: models.Account,
        foreignKey: 'projectId',
        otherKey: 'workerId',
        constraints: true,
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
      })
    }
  }
  Project.init({
    projectId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    projectDescription: DataTypes.STRING,
    location: DataTypes.STRING,
    areaInM2: DataTypes.DOUBLE,
    pricePerM2: DataTypes.DOUBLE,
    startingDate: DataTypes.DATE,
    endingDate: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Project',
  });
  return Project;
};