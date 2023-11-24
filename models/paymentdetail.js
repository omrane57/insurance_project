'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class paymentdetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    // static associate(models) {
    //   // define association here
    //   policy.belongsTo(models.agent,{
    //     foreignKey:'agent_id',
    //     as:'agent'
    //   })
    //   feedback.belongsTo(models.policy,{
    //     foreignKey:'policy_id',
    //     as:'policy'
    //   })
    // }
  }
  paymentdetail.init({
    installationDate: DataTypes.DATE,
    installationAmount: DataTypes.INTEGER,
    paymentDate: DataTypes.DATE,
    paymentStatus: DataTypes.BOOLEAN,
    paymentMethod: DataTypes.STRING,
    agentId:DataTypes.UUID,
    policyId:DataTypes.UUID
  }, {
    sequelize,
    modelName: 'paymentdetail',
    underscored: true,
    paranoid:true
  });
  return paymentdetail;
};