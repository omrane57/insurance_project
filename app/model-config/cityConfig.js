const {validateUuid}=require('../utils/uuid')

const db = require("../../models")
const { validateStringLength } = require('../utils/string')
const { Op } = require('sequelize')

class CityConfig{
    constructor(){
        this.fieldMapping=Object.freeze({
            id:"id",
            cityName:"cityName",
            stateId:"stateId",
            status:"status"
           
        })
      //   this.association=Object.freeze({
      //     accountFilter:'accountFilter',
      // })    
      this.model=db.city
      this.modelName=db.city.name
      this.tableName=db.city.tableName
      this.filter=Object.freeze({
        id: (id) => {
          
            return {
              [this.fieldMapping.id]: {
                [Op.eq]: id,
              },
            };
          },
          stateId: (stateId) => {
          
            return {
              [this.fieldMapping.stateId]: {
                [Op.eq]: stateId,
              },
            };
          },
          cityName: (cityName) => {
            
            return {
              [this.fieldMapping.cityName]: {
                [Op.like]: `%${cityName}%`,
              },
            };
          }
          
      })
    }
}
const cityConfig=new CityConfig()
module.exports=cityConfig