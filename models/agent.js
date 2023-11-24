'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class agent extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    // static associate(models) {
    //   agent.belongsTo(models.employee,{
    //     foreignKey:'employee_id',
    //     as:'employee'
    //   })
    //   agent.hasMany(models.agentsCustomerAccountDetail,{
    //     foreignKey: 'agent_id',
    //     as:'agentsCustomerAccountDetail'
    //   })
    //   agent.hasMany(models.customerDetail,{
    //     foreignKey: 'agent_id',
    //     as:'customerDetail'
    //   })
    //   agent.hasMany(models.policy,{
    //     foreignKey: 'agent_id',
    //     as:'policy'
    //   })
    //   agent.hasMany(models.paymentDetails,{
    //     foreignKey: 'agent_id',
    //     as:'paymentDetails'
    //   })
      
    //   // define association here
    // }
  }
  agent.init({
    agentName: DataTypes.STRING,
    role:DataTypes.STRING,
    password: DataTypes.STRING,
    email: DataTypes.STRING,
    agentAddress: DataTypes.STRING,
    qualification: DataTypes.STRING,
    status: DataTypes.BOOLEAN,
    username: DataTypes.STRING,
    employeeId:DataTypes.UUID,
    agentImgUrl: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'agent',
    underscored: true,
    paranoid:true,
  });
  return agent;
};