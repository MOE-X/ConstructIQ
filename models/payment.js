'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Payment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Payment.belongsTo(models.Project, {
        foreignKey: 'projectId',
        constraints: true,
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
      })

      Payment.belongsTo(models.Worker, {
        foreignKey: 'workerId',
        constraints: true,
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
      })
    }
  }
  Payment.init({
    projectId: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    workerId: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    paymentDate: {
      type: DataTypes.DATE,
      primaryKey: true
    },
    paymentAmount: DataTypes.DOUBLE
  }, {
    sequelize,
    modelName: 'Payment',
  });
  return Payment;
};