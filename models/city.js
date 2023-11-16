'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class city extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    // static associate(models) {
    //   // define association here
    // city.belongsTo(models.state,{
    //     foreignKey:'state_id',
    //     as:'state'
    //   })
    // }
  }
  city.init({
    cityName: DataTypes.STRING,
    status: DataTypes.BOOLEAN,
    stateId:DataTypes.UUID
  }, {
    sequelize,
    modelName: 'city',
    underscored: true,
    paranoid:true
  });
  return city;
};