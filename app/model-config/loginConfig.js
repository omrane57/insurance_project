const {validateUuid}=require('../utils/uuid')

const db = require("../../models")
const { validateStringLength } = require('../utils/string')
const { Op } = require('sequelize')

class LoginConfig{
    constructor(){
        this.fieldMapping=Object.freeze({
            id:"id",
            role:"role",
            date:"date",
            time:"time",
            username:"username"
    
           
        })
      //   this.association=Object.freeze({
      //     accountFilter:'accountFilter',
      // })    
      this.model=db.logindetail
      this.modelName=db.logindetail.name
      this.tableName=db.logindetail.tableName
      this.filter=Object.freeze({
        id: (id) => {
          
            return {
              [this.fieldMapping.id]: {
                [Op.eq]: id,
              },
            };
          },
          role: (role) => {
            
            return {
              [this.fieldMapping.role]: {
                [Op.like]:` ${role}`,
               
              },
            };
          },
          date: (date) => {
            
            return {
              [this.fieldMapping.date]: {
                [Op.like]:` ${date}`,
               
              },
            };
          },
          time: (time) => {
            
            return {
              [this.fieldMapping.time]: {
                [Op.like]:` ${time}`,
               
              },
            };
          },
          username: (username) => {
            
            return {
              [this.fieldMapping.username]: {
                [Op.like]:` ${username}`,
               
              },
            };
          }
          
      })
    }
}
const loginConfig=new LoginConfig()
module.exports=loginConfig