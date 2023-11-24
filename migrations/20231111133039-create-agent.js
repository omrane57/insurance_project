'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('agents', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      agent_name: {
        allowNull:false,
        type: Sequelize.STRING
      },
      password: {
        allowNull:false,
        type: Sequelize.STRING
      },
      email: {
        allowNull:false,
       
        type: Sequelize.STRING
      },
      agent_address: {
        allowNull:false,
        type: Sequelize.STRING
      },
      qualification: {
        allowNull:false,
        type: Sequelize.STRING
      },
      status: {
        allowNull:false,
        type: Sequelize.BOOLEAN
      },
      username: {
        allowNull:false,
        unique:true,
        type: Sequelize.STRING
      },
      
      role:{
        allowNull: false,
        type: Sequelize.STRING
      },
      agent_img_url:{
        type: Sequelize.STRING,
        allowNull:false

      },
      employee_id:{
        allowNull:false,
        type:Sequelize.UUID,
        onDelete:'CASCADE',
        onUpdate:'CASCADE',
        references:{
          model:{
            tableName:'employees'
          }
        },
        key:'id'
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
    await queryInterface.dropTable('agents');
  }
};