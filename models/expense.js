'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Expense extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      //Project Expense relation
      Expense.belongsTo(models.Project, {
        foreignKey: 'projectId',
        constraints: true,
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
      })
    }
  }
  Expense.init({
    expenseId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    expenseDescription: DataTypes.STRING,
    expenseDate: DataTypes.DATE,
    expenseAmount: DataTypes.DOUBLE
  }, {
    sequelize,
    modelName: 'Expense',
  });
  return Expense;
};