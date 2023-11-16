'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class insuranceType extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    // static associate(models) {
    //   // define association here
    //   insuranceType.hasMany(models.plan,{
    //     foreignKey: 'insurance_type_id',
    //     as:'plan'
    //   })
    // }
    
  }
  insuranceType.init({
    insuranceName: DataTypes.STRING,
    status: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'insuranceType',
    underscored: true,
    paranoid:true
  });
  return insuranceType;
};