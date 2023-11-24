'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class logindetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  logindetail.init({
    role: DataTypes.STRING,
    date:DataTypes.STRING,
    time:DataTypes.STRING,
    role:DataTypes.STRING,
    username:DataTypes.STRING,

  }, {
    sequelize,
    modelName: 'logindetail',
    underscored: true,
    paranoid:true
  });
  return logindetail;
};