const {validateUuid}=require('../utils/uuid')

const db = require("../../models")
const { validateStringLength } = require('../utils/string')
const { Op } = require('sequelize')

class EmployeeConfig{
    constructor(){
        this.fieldMapping=Object.freeze({
            id:"id",
            employeeName:"employeeName",
            role:"role",
            username:"username",
            password:"password",
            email:"email"
        })
      //   this.association=Object.freeze({
      //     accountFilter:'accountFilter',
      // })    
      this.model=db.employee
      this.modelName=db.employee.name
      this.tableName=db.employee.tableName
      this.filter=Object.freeze({
        id: (id) => {
            
            validateUuid(id)
            return {
              [this.fieldMapping.id]: {
                [Op.eq]: id,
              },
            };
          },
          employeeName: (employeeName) => {
            
            return {
              [this.fieldMapping.employeeName]: {
                [Op.like]: `%${employeeName}%`,
              },
            };
          },
          email: (email) => {
            return {
              [this.fieldMapping.email]: {
                [Op.like]: `%${email}`,
              },
            };
          },    
          username: (username) => {
            return {
             
              [this.fieldMapping.username]: {
                [Op.like]: `%${username}%`,
              },
            };
          },
          password: (password) => {
            return {
              [this.fieldMapping.password]: {
                [Op.like]: `%${password}%`,
              },
            };
          },
          role: (role) => {
            return {
              [this.fieldMapping.role]: {
                [Op.like]: `%${role}%`,
              },
            };
          },
      })
    }
}
const employeeConfig=new EmployeeConfig()
module.exports=employeeConfig