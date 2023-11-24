'use strict';
const {
  Model
} = require('sequelize');
const agent = require('./agent');
module.exports = (sequelize, DataTypes) => {
  class customerdetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    // static associate(models) {
    //   // define association here
    //   customerdetail.belongsTo(models.agent,{
    //     foreignKey:'agent_id',
    //     as:'agent'
    //   })
    //   customerdetail.hasMany(models.policy,{
    //     foreignKey: 'customer_id',
    //     as:'policy'
    //   })
    //   customerdetail.hasMany(models.feedback,{
    //     foreignKey: 'customer_id',
    //     as:'feedback'
    //   })
    // }
  }
  customerdetail.init({
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
    customerImgUrl: DataTypes.STRING,
    age:DataTypes.INTEGER,
    role:DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'customerdetail',
    underscored: true,
    paranoid:true
  });
  return customerdetail;
};