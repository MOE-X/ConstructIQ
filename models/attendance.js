'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Attendance extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Attendance.belongsTo(models.Project, {
        foreignKey: 'projectId',
        constraints: true,
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
      })

      Attendance.belongsTo(models.Worker, {
        foreignKey: 'workerId',
        constraints: true,
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
      })
    }
  }
  Attendance.init({
    projectId: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    workerId: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    attendanceDate: {
      type: DataTypes.DATE,
      primaryKey: true
    },
    isWorking: DataTypes.BOOLEAN,
    dayRate: DataTypes.DOUBLE
  }, {
    sequelize,
    modelName: 'Attendance',
  });
  return Attendance;
};