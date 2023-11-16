'use strict';
const {
  Model
} = require('sequelize');
const agent = require('./agent');
module.exports = (sequelize, DataTypes) => {
  class customerDetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      customerDetail.belongsTo(models.agent,{
        foreignKey:'agent_id',
        as:'agent'
      })
      customerDetail.hasMany(models.policy,{
        foreignKey: 'customer_id',
        as:'policy'
      })
      customerDetail.hasMany(models.feedback,{
        foreignKey: 'customer_id',
        as:'feedback'
      })
    }
  }
  customerDetail.init({
    customerName: DataTypes.STRING,
    dob: DataTypes.DATE,
    address: DataTypes.STRING,
    email: DataTypes.STRING,
    state: DataTypes.STRING,
    city: DataTypes.STRING,
    pincode: DataTypes.STRING,
    mobileno: DataTypes.STRING,
    nominee: DataTypes.STRING,
    nomineeRelation: DataTypes.STRING,
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    agentId:DataTypes.UUID,

  }, {
    sequelize,
    modelName: 'customerDetail',
    underscored: true,
    paranoid:true
  });
  return customerDetail;
};