'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class policy extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    // static associate(models) {
    //   // define association here
    //   policy.belongsTo(models.customerDetail,{
    //     foreignKey:'customerDetail_id',
    //     as:'customerDetail'
    //   })
    //   policy.belongsTo(models.agent,{
    //     foreignKey:'agent_id',
    //     as:'agent'
    //   })
    //   policy.belongsTo(models.plan,{
    //     foreignKey:'plan_id',
    //     as:'plan'
    //   })
    //   policy.hasMany(models.feedback,{
    //     foreignKey: 'policy_id',
    //     as:'feedback'
    //   })
    //   policy.hasMany(models.paymentDetails,{
    //     foreignKey: 'policy_id',
    //     as:'paymentDetails'
    //   })
    // }
  }
  policy.init({
    insuranceType: DataTypes.STRING,
    planName: DataTypes.STRING,
    dateCreated: DataTypes.DATE,
    maturityDate: DataTypes.STRING,
    primimumType: DataTypes.STRING,
    totalPremimumAmount: DataTypes.INTEGER,
    profitRatio: DataTypes.INTEGER,
    sumAssured: DataTypes.STRING,
    customerId:DataTypes.UUID,
    agentId:DataTypes.UUID,
    planId:DataTypes.UUID
  }, {
    sequelize,
    modelName: 'policy',
    underscored: true,
    paranoid:true
  });
  return policy;
};