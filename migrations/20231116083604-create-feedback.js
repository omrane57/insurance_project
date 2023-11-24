'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('feedbacks', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      customer_name: {
        allowNull: false,

        type: Sequelize.STRING
      },
      title: {
        allowNull: false,

        type: Sequelize.STRING
      },
      message: {
        allowNull: false,

        type: Sequelize.STRING
      },
      contact_date: {
        allowNull: false,

        type: Sequelize.DATE
      },
      reply: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('feedbacks');
  }
};