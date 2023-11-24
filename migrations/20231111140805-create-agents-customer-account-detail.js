'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('agentscustomeraccountdetails', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      customer_name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      insurance_scheme: {
        allowNull: false,
        type: Sequelize.STRING
      },
      commission_amount: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      withdraw_status: {
        allowNull: false,
        type: Sequelize.BOOLEAN
      },
      date: {
        allowNull: false,
        type: Sequelize.STRING
      },
      agent_id:{
        allowNull:false,
        type:Sequelize.UUID,
        onDelete:'CASCADE',
        onUpdate:'CASCADE',
        references:{
          model:{
            tableName:"agents"
          }
        },
        key:"id"
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
      },
      

    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('agentscustomeraccountdetails');
  }
};