'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('employees', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      role: {
        type: Sequelize.STRING,
        allowNull:false
      },
      employee_name: {
        type: Sequelize.STRING,
        allowNull:false
      },
      username: {
        type: Sequelize.STRING,
        allowNull:false,
        unique:true
      },
      password: {
        type: Sequelize.STRING,
        allowNull:false
      },
      email: {
        type: Sequelize.STRING,
        allowNull:false,
       
      },
      status: {
        type: Sequelize.BOOLEAN,
        allowNull:false
      },
      employee_img_url:{
        type: Sequelize.STRING,
        allowNull:false

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
    await queryInterface.dropTable('employees');
  }
};