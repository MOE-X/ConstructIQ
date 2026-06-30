'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('projects', {
      projectId: {
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        type: Sequelize.UUID,
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
        type: Sequelize.UUID,
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