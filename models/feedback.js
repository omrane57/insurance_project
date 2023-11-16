'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class feedback extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    // static associate(models) {
    //   // define association here
    //   feedback.belongsTo(models.customerDetail,{
    //     foreignKey:'customer_id',
    //     as:'customerDetail'
    //   })
    //   feedback.belongsTo(models.policy,{
    //     foreignKey:'policy_id',
    //     as:'policy'
    //   })
    // }
  }
  feedback.init({
    customerName: DataTypes.STRING,
    title: DataTypes.STRING,
    message: DataTypes.STRING,
    contactDate: DataTypes.DATE,
    reply: DataTypes.STRING,
    customerId:DataTypes.UUID,
    policyId:DataTypes.UUID
  }, {
    sequelize,
    modelName: 'feedback',
    underscored: true,
    paranoid:true
  });
  return feedback;
};