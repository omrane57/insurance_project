'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('policies', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      insurance_type: {
        allowNull: false,

        type: Sequelize.STRING
      },
      plan_name: {
        allowNull: false,

        type: Sequelize.STRING
      },
      date: {
        allowNull: false,

        type: Sequelize.STRING
      },
      maturity_date: {
        allowNull: false,

        type: Sequelize.STRING
      },
      primimum_type: {
        allowNull: false,

        type: Sequelize.STRING
      },
      total_premimum_amount: {
        allowNull: false,

        type: Sequelize.DOUBLE
      },
      profit_ratio: {
        allowNull: false,

        type: Sequelize.DOUBLE
      },
      sum_assured: {
        allowNull: false,

        type: Sequelize.STRING
      },
      request_status: {
        allowNull: false,

        type: Sequelize.BOOLEAN
      },
    
      customer_id: {
        allowNull: false,
        type: Sequelize.UUID,
        onDelete:'CASCADE',
        onUpdate:'CASCADE',
        references:{
          model:{
            tableName:"customerdetails"
          }
        },key:"id"


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
      plan_id: {
        allowNull: false,
        type: Sequelize.UUID,
        onDelete:'CASCADE',
        onUpdate:'CASCADE',
        references:{
          model:{
            tableName:"plans"
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
    await queryInterface.dropTable('policies');
  }
};