const employeeConfig = require("../../../model-config/employeeConfig");
const employeeService=require("../../employee/service/EmployeeService")
// const customerService=require("../../employee/service/customerService")
// const agentService=require("../../employee/service/agentService")
// const customerConfig = require("../../../model-config/customerConfig");
// const agentConfig = require("../../../model-config/agentConfig");
const {startTransaction}=require("../../../sequelize/transaction")
const bcrypt = require('bcrypt');
const { parseLimitAndOffset, unmarshalBody, parseSelectFields, parseFilterQueries }=require('../../../utils/request');
const { tokencreation } = require("../../../middleware/authService");
const {preloadAssociations}=require('../../../sequelize/association');
const { v4 } = require("uuid");
class UserService{
    constructor(){
      this.newemployeeService=employeeService
      // this.newcustomerService=customerService
      // this.newagentService=agentService

    }
    async loginForEmployee(settingsConfig, bodyElements, queryParams) {
        const t = await startTransaction();
        try {
          const { username, password, role } = bodyElements;
    
          const arrtibutesToReturnForEmployee = {
            username: employeeConfig.fieldMapping.username,
            password: employeeConfig.fieldMapping.password,
            id: employeeConfig.fieldMapping.id,
            employeeName: employeeConfig.fieldMapping.employeeName,
            email: employeeConfig.fieldMapping.email,
            role: employeeConfig.fieldMapping.role
          };
         
        
    
    
          const selectArray = Object.values(arrtibutesToReturnForEmployee);
          const passwordObj = await employeeConfig.model.findOne({
            ...parseFilterQueries(queryParams, employeeConfig.filter, { [employeeConfig.fieldMapping.username]: username }), t
          });
    
          const result = bcrypt.compare(password, await passwordObj.password);
    
          if (!(await result)) {
    
            throw new Error("Invalid Password");
          }
          if (await result) {
            const payload = {
              id: passwordObj.id,
              username: passwordObj.username,
              role: passwordObj.role,
            };
    
            const token = tokencreation(payload);
            return [token, passwordObj];
          }
        } catch (error) {
          throw error;
        }
      }

      // async loginForCustomer(settingsConfig, bodyElements, queryParams) {
      //   const t = await startTransaction();
      //   try {
      //     const { username, password, role } = bodyElements;
    
      //     const arrtibutesToReturnForCustomer={
      //       id:customerConfig.fieldMapping.id,
      //       customerName:customerConfig.fieldMapping.customerName,
      //       dob:customerConfig.fieldMapping.dob,
      //       email:customerConfig.fieldMapping.email,
      //       role:customerConfig.fieldMapping.role,
      //       state:customerConfig.fieldMapping.state,
      //       city:customerConfig.fieldMapping.city,
      //       pincode:customerConfig.fieldMapping.pincode,
      //       mobileno:customerConfig.fieldMapping.mobileno,
      //       nominee:customerConfig.fieldMapping.nominee,
      //       nomineeRelation:customerConfig.fieldMapping.nomineeRelation,
      //       username:customerConfig.fieldMapping.username,
      //       agentId:customerConfig.fieldMapping.agentId
      //     }
    
    
      //     const selectArray = Object.values(arrtibutesToReturnForCustomer);
      //     const passwordObj = await customerConfig.model.findOne({
      //       ...parseFilterQueries(queryParams, customerConfig.filter, { [customerConfig.fieldMapping.username]: username }), t
      //     });
    
      //     const result = bcrypt.compare(password, await passwordObj.password);
    
      //     if (!(await result)) {
    
      //       throw new Error("Invalid Password");
      //     }
      //     if (await result) {
      //       const payload = {
      //         id: passwordObj.id,
      //         username: passwordObj.username,
      //         role: passwordObj.role,
      //       };
    
      //       const token = tokencreation(payload);
      //       return [token, passwordObj];
      //     }
      //   } catch (error) {
      //     throw error;
      //   }
      // }
      // async loginForAgent(settingsConfig, bodyElements, queryParams) {
      //   const t = await startTransaction();
      //   try {
      //     const { username, password, role } = bodyElements;
    
      //     const arrtibutesToReturnForAgent={
      //       id: agentConfig.fieldMapping.id,
      //       agentName: agentConfig.fieldMapping.agentName,
      //       email: agentConfig.fieldMapping.email,
      //       role: agentConfig.fieldMapping.role,
      //       agentAddress: agentConfig.fieldMapping.agentAddress,
      //       qualification: agentConfig.fieldMapping.qualification,
      //       status: agentConfig.fieldMapping.status,
      //       username: agentConfig.fieldMapping.username,
      //       employeeId: agentConfig.fieldMapping.employeeId,
      //     }
    
    
      //     const selectArray = Object.values(arrtibutesToReturnForAgent);
      //     const passwordObj = await agentConfig.model.findOne({
      //       ...parseFilterQueries(queryParams, agentConfig.filter, { [agentConfig.fieldMapping.username]: username }), t
      //     });
    
      //     const result = bcrypt.compare(password, await passwordObj.password);
    
      //     if (!(await result)) {
    
      //       throw new Error("Invalid Password");
      //     }
      //     if (await result) {
      //       const payload = {
      //         id: passwordObj.id,
      //         username: passwordObj.username,
      //         role: passwordObj.role,
      //       };
    
      //       const token = tokencreation(payload);
      //       return [token, passwordObj];
      //     }
      //   } catch (error) {
      //     throw error;
      //   }
      // }

      async resetPasswordForEmployee(settingsConfig, username, oldPassword, newPassword) {
        const t = await startTransaction();
        try {
          const logger = settingsConfig.logger;
          logger.info(`[EmployeeService] : Inside checkingPassword`);
    
    
          const user = await this.newemployeeService.getEmpByUsername(settingsConfig, username)
    
          let result = await bcrypt.compare(oldPassword, await user[0].dataValues.password);
    
          if (!result) {
            throw new Error("invalid password");
          }
          const hashpassword = await bcrypt.hash(newPassword, 12);
          let updatePassword = await employeeConfig.model.update({ password: hashpassword }, { where: { id: await user[0].dataValues.id }, transaction: t, })
          t.commit()
          return updatePassword
        } catch (error) {
          t.rollback()
          throw error
        }
      }
      // async resetPasswordForCustomer(settingsConfig, username, oldPassword, newPassword) {
      //   const t = await startTransaction();
      //   try {
      //     const logger = settingsConfig.logger;
      //     logger.info(`[EmployeeService] : Inside checkingPassword`);
    
    
      //     const user = await this.newcustomerService.getEmpByUsername(settingsConfig, username)
    
      //     let result = await bcrypt.compare(oldPassword, await user[0].dataValues.password);
    
      //     if (!result) {
      //       throw new Error("invalid password");
      //     }
      //     const hashpassword = await bcrypt.hash(newPassword, 12);
      //     let updatePassword = await employeeConfig.model.update({ password: hashpassword }, { where: { id: await user[0].dataValues.id }, transaction: t, })
      //     t.commit()
      //     return updatePassword
      //   } catch (error) {
      //     t.rollback()
      //     throw error
      //   }
      // }
      // async resetPasswordForAgent(settingsConfig, username, oldPassword, newPassword) {
      //   const t = await startTransaction();
      //   try {
      //     const logger = settingsConfig.logger;
      //     logger.info(`[EmployeeService] : Inside checkingPassword`);
    
    
      //     const user = await this.newagentService.getEmpByUsername(settingsConfig, username)
    
      //     let result = await bcrypt.compare(oldPassword, await user[0].dataValues.password);
    
      //     if (!result) {
      //       throw new Error("invalid password");
      //     }
      //     const hashpassword = await bcrypt.hash(newPassword, 12);
      //     let updatePassword = await employeeConfig.model.update({ password: hashpassword }, { where: { id: await user[0].dataValues.id }, transaction: t, })
      //     t.commit()
      //     return updatePassword
      //   } catch (error) {
      //     t.rollback()
      //     throw error
      //   }
      // }
}

const userService=new UserService()
module.exports=userService