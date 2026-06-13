'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('projects', {
      projectId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      projectDescription: {
        type: Sequelize.STRING,
        allowNull: false
      },
      location: {
        type: Sequelize.STRING,
        allowNull: false
      },
      areaInM2: {
        type: Sequelize.DOUBLE,
        allowNull: false
      },
      pricePerM2: {
        type: Sequelize.DOUBLE,
        allowNull: false
      },
      startingDate: {
        type: Sequelize.DATE,
        allowNull: false
      },
      endingDate: {
        type: Sequelize.DATE,
        allowNull: true
      },
      pStatusId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'PStatuses',
          key: 'pStatusId'
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('projects');
  }
};