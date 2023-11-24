const {validateUuid}=require('../utils/uuid')

const db = require("../../models")
const { validateStringLength } = require('../utils/string')
const { Op } = require('sequelize')

class StateConfig{
    constructor(){
        this.fieldMapping=Object.freeze({
            id:"id",
            stateName:"stateName",
            status:"status"
           
        })
      //   this.association=Object.freeze({
      //     accountFilter:'accountFilter',
      // })    
      this.model=db.state
      this.modelName=db.state.name
      this.tableName=db.state.tableName
      this.filter=Object.freeze({
        id: (id) => {
          
            return {
              [this.fieldMapping.id]: {
                [Op.eq]: id,
              },
            };
          },
          stateName: (stateName) => {
            
            return {
              [this.fieldMapping.stateName]: {
                [Op.like]: `%${stateName}%`,
              },
            };
          }
          
      })
    }
}
const stateConfig=new StateConfig()
module.exports=stateConfig