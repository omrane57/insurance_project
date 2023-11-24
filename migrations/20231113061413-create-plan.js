'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('plans', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      policy_term_min: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      policy_term_max: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      min_age: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      max_age: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      min_investment_amount: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      max_investment_amount: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      profit_ratio: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      commission_amount: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      status: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
      },
      insurance_type_id: {
        allowNull: false,
        type: Sequelize.UUID,
        onDelete:'CASCADE',
        onUpdate:'CASCADE',
        references:{
          model:{
            tableName:"insurancetypes"
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
      }
      ,
      deleted_at: {
        allowNull: true,
        type: Sequelize.DATE
      },
      
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('plans');
  }
};