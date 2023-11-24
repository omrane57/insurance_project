'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('customerdetails', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      customer_name: {
        allowNull: false,

        type: Sequelize.STRING
      },
      dob: {
        allowNull: false,

        type: Sequelize.STRING
      },
      age: {
        allowNull: false,

        type: Sequelize.INTEGER
      },
      address: {
        allowNull: false,

        type: Sequelize.STRING
      },
      role:{
        allowNull: false,
        type: Sequelize.STRING
      },
      email: {
        allowNull: false,

        type: Sequelize.STRING
      },
      state: {
        allowNull: false,

        type: Sequelize.STRING
      },
      city: {
        allowNull: false,

        type: Sequelize.STRING
      },
      pincode: {
        allowNull: false,

        type: Sequelize.STRING
      },
      mobileno: {
        allowNull: false,

        type: Sequelize.STRING
      },
      nominee: {
        allowNull: false,

        type: Sequelize.STRING
      },
      nominee_relation: {
        allowNull: false,

        type: Sequelize.STRING
      },
      username: {
        allowNull: false,
        unique:true,
        type: Sequelize.STRING
      },
      password: {
        allowNull: false,

        type: Sequelize.STRING
      },
      customer_img_url:{
        type: Sequelize.STRING,
        allowNull:false
      },
      agent_id: {
        allowNull: true,
        type: Sequelize.UUID,
        onDelete:'CASCADE',
        onUpdate:'CASCADE',
        references:{
          model:{
            tableName:"agents"
          }
        },key:"id"


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
    await queryInterface.dropTable('customerdetails');
  }
};