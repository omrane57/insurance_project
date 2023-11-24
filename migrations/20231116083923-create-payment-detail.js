'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('paymentdetails', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      installation_date: {
        allowNull: false,

        type: Sequelize.DATE
      },
      installation_amount: {
        allowNull: false,

        type: Sequelize.INTEGER
      },
      payment_date: {
        allowNull: false,

        type: Sequelize.DATE
      },
      payment_status: {
        allowNull: false,

        type: Sequelize.BOOLEAN
      },
      payment_method: {
        allowNull: false,

        type: Sequelize.STRING
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
      policy_id: {
        allowNull: false,
        type: Sequelize.UUID,
        onDelete:'CASCADE',
        onUpdate:'CASCADE',
        references:{
          model:{
            tableName:"policies"
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
    await queryInterface.dropTable('paymentdetails');
  }
};