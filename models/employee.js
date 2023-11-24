'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class employee extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    // static associate(models) {
    //   employee.hasMany(models.agent,{
    //     foreignKey: 'employee_id',
    //     as:'agent'
    //   })
    // }
      // define association here
    }
  
  employee.init({
    role: DataTypes.BOOLEAN,
    employeeName: DataTypes.STRING,
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    email: DataTypes.STRING,
    status: DataTypes.BOOLEAN,
    employeeImgUrl: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'employee',
    underscored: true,
    paranoid:true
  });
  return employee;
};