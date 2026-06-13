'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Worker extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      //Worker wRole relation
      Worker.belongsTo(models.WRole, {
        foreignKey: 'wRoleId',
        constraints: true,
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
      })

      //Project Worker through attendance relation
      Worker.belongsToMany(models.Project, {
        through: models.Attendance,
        foreignKey: 'workerId',
        otherKey: 'projectId',
        constraints: true,
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
      })

      //Project Worker through payment relation
      Worker.belongsToMany(models.Project, {
        through: models.Payment,
        foreignKey: 'workerId',
        otherKey: 'projectId',
        constraints: true,
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
      })

      //Project Worker through account relation
      Worker.belongsToMany(models.Project, {
        through: models.Account,
        foreignKey: 'workerId',
        otherKey: 'projectId',
        constraints: true,
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
      })

      Worker.hasMany(models.Account, {
        foreignKey: 'workerId',
        constraints: true,
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
      })
    }
  }
  Worker.init({
    workerId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    fullName: DataTypes.STRING,
    dob: DataTypes.DATE,
    phone: DataTypes.STRING,
    address: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Worker',
  });
  return Worker;
};