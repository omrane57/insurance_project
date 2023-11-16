'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('cities', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      city_name: {
        allowNull: false,

        type: Sequelize.STRING
      },
      status: {
        allowNull: false,

        type: Sequelize.BOOLEAN
      },
      state_id: {
        allowNull: false,
        type: Sequelize.UUID,
        onDelete:'CASCADE',
        onUpdate:'CASCADE',
        references:{
          model:{
            tableName:"states"
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
    await queryInterface.dropTable('cities');
  }
};