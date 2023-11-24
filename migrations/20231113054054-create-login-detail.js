'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('logindetails', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      role: {
        allowNull: false,

        type: Sequelize.STRING
      },
      date:{
        allowNull: false,

        type: Sequelize.STRING
      },
      time:{
        allowNull: false,

        type: Sequelize.STRING
      },
      username:{
        allowNull: false,

        type: Sequelize.STRING
      },
    
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deleted_at: {
        allowNull: true,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('logindetails');
  }
};