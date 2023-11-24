'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class agentscustomeraccountdetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    // static associate(models) {
    //   // define association here
    //   agentscustomeraccountdetail.belongsTo(models.agent,{
    //     foreignKey:'agent_id',
    //     as:'agent'
    //   })
    // }
  }
  agentscustomeraccountdetail.init({
    customerName: DataTypes.STRING,
    insuranceScheme: DataTypes.STRING,
    commissionAmount: DataTypes.INTEGER,
    withdrawStatus: DataTypes.BOOLEAN,
    date: DataTypes.STRING,
    agentId:DataTypes.UUID

  }, {
    sequelize,
    modelName: 'agentscustomeraccountdetail',
    underscored: true,
    paranoid:true,
  });
  return agentscustomeraccountdetail;
};