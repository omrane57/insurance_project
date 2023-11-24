'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class insurancetype extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    // static associate(models) {
    //   // define association here
    //   insurancetype.hasMany(models.plan,{
    //     foreignKey: 'insurance_type_id',
    //     as:'plan'
    //   })
    // }
    
  }
  insurancetype.init({
    insuranceName: DataTypes.STRING,
    status: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'insurancetype',
    underscored: true,
    paranoid:true
  });
  return insurancetype;
};