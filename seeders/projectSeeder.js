'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
   await queryInterface.bulkInsert('projects', [
      {
        projectDescription: 'P1',
        location: 'L1',
        areaInM2: 100,
        pricePerM2: 100,
        startingDate: '2022-01-01',
        endingDate: '2024-12-31',
        pStatusId: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        projectDescription: 'P2',
        location: 'L2',
        areaInM2: 200,
        pricePerM2: 150,
        startingDate: '2024-01-01',
        endingDate: '2026-12-31',
        pStatusId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        projectDescription: 'P3',
        location: 'L3',
        areaInM2: 450,
        pricePerM2: 175,
        startingDate: '2027-01-01',
        endingDate: '2029-12-31',
        pStatusId: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('projects', null, {});
  }
};
