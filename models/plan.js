'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class plan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    // static associate(models) {
    //   // define association here
    //   plan.belongsTo(models.insuranceType,{
    //     foreignKey:'insurance_type_id',
    //     as:'insuranceType'
    //   })
    //   plan.hasMany(models.policy,{
    //     foreignKey: 'plan_id',
    //     as:'policy'
    //   })
    // }
  }
  plan.init({
    policyTermMin: DataTypes.INTEGER,
    policyTermMax: DataTypes.INTEGER,
    minAge: DataTypes.INTEGER,
    maxAge: DataTypes.INTEGER,
    minInvestmentAmount: DataTypes.INTEGER,
    maxInvestmentAmount: DataTypes.INTEGER,
    profitRatio: DataTypes.INTEGER,
    commissionAmount: DataTypes.INTEGER,
    status: DataTypes.BOOLEAN,
    insuranceTypeId:DataTypes.UUID
  }, {
    sequelize,
    modelName: 'plan',
    underscored: true,
    paranoid:true
  });
  return plan;
};