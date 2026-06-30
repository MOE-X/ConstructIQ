'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('attendances', {
      projectId: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
        references: {
          model: 'Projects',
          key: 'projectId'
        }
      },
      workerId: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
        references: {
          model: 'Workers',
          key: 'workerId'
        }
      },
      attendanceDate: {
        type: Sequelize.DATE,
        primaryKey: true,
        allowNull: false
      },
      isWorking: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      dayRate: {
        type: Sequelize.DOUBLE,
        allowNull: false
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
    await queryInterface.dropTable('attendances');
  }
};