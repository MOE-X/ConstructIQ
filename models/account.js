'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Account extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Account.belongsTo(models.Project, {
        foreignKey: 'projectId',
        constraints: true,
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
      })

      Account.belongsTo(models.Worker, {
        foreignKey: 'workerId',
        constraints: true,
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
      })
    }
  }
  Account.init({
    projectId: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    workerId: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    account: DataTypes.DOUBLE
  }, {
    sequelize,
    modelName: 'Account',
  });
  return Account;
};