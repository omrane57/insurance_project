'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tax extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  tax.init({
    taxPercentage: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'tax',
    underscored: true,
    paranoid:true
  });
  return tax;
};