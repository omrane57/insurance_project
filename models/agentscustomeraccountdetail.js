'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class agentsCustomerAccountDetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    // static associate(models) {
    //   // define association here
    //   agentsCustomerAccountDetail.belongsTo(models.agent,{
    //     foreignKey:'agent_id',
    //     as:'agent'
    //   })
    // }
  }
  agentsCustomerAccountDetail.init({
    customerName: DataTypes.STRING,
    insuranceScheme: DataTypes.STRING,
    commissionAmount: DataTypes.INTEGER,
    withdrawStatus: DataTypes.BOOLEAN,
    date: DataTypes.DATE,
    agentId:DataTypes.UUID

  }, {
    sequelize,
    modelName: 'agentsCustomerAccountDetail',
    underscored: true,
    paranoid:true,
  });
  return agentsCustomerAccountDetail;
};