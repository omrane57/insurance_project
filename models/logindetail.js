'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class loginDetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  loginDetail.init({
    type: DataTypes.STRING,
    createdDate: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'loginDetail',
    underscored: true,
    paranoid:true
  });
  return loginDetail;
};