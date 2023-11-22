const {validateUuid}=require('../utils/uuid')

const db = require("../../models")
const { validateStringLength } = require('../utils/string')
const { Op } = require('sequelize')

class TaxConfig{
    constructor(){
        this.fieldMapping=Object.freeze({
            id:"id",
            taxPercentage:"taxPercentage",
    
           
        })
      //   this.association=Object.freeze({
      //     accountFilter:'accountFilter',
      // })    
      this.model=db.tax
      this.modelName=db.tax.name
      this.tableName=db.tax.tableName
      this.filter=Object.freeze({
        id: (id) => {
          
            return {
              [this.fieldMapping.id]: {
                [Op.eq]: id,
              },
            };
          },
          taxPercentage: (taxPercentage) => {
            
            return {
              [this.fieldMapping.taxPercentage]: {
                [Op.eq]: taxPercentage,
               
              },
            };
          }
          
      })
    }
}
const taxConfig=new TaxConfig()
module.exports=taxConfig