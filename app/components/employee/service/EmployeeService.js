const employeeConfig = require("../../../model-config/employeeConfig");
const { startTransaction } = require("../../../sequelize/transaction")
const bcrypt = require('bcrypt');
const { parseLimitAndOffset, unmarshalBody, parseSelectFields, parseFilterQueries } = require('../../../utils/request');
const { tokencreation } = require("../../../middleware/authService");
const { preloadAssociations } = require('../../../sequelize/association');
const { v4 } = require("uuid");
const fs = require('fs/promises');

const uploadImage = async (file) => {


  try {
      // Check if image file is included
      if (file) {
        let dynamicDirectory;
        dynamicDirectory = 'C:/Users/aksha/OneDrive/Desktop/insurance/uploadimages/employee/employeephoto';
        
        await fs.mkdir(dynamicDirectory, { recursive: true });
        const finalFileLocation = `${dynamicDirectory}/${file.image.name}`;
        await fs.writeFile(finalFileLocation, file.image.data);
        if (file.image.mimetype != 'image/jpeg') {
        throw  new Error('Invalid file type. Only JPEG files are allowed.');

      } 
          // Access the file location and name
          const fileLocation = finalFileLocation; // File path
          const fileName = file.image.name; // File name

          return { "fileLocation": fileLocation, "fileName": fileName };
      } else {
          return { error: 'Image file is required.' };
      }
  } catch (error) {
      throw error;
  }
};
class EmployeeService {
  constructor() {
  }
  async createEmployee(settingsConfig, body,file) {
    const t = await startTransaction();
    try {
      const logger = settingsConfig.logger;
      logger.info(`[EmployeeService] : Inside createEmployee`);
      const hashpassword = await bcrypt.hash(body.password, 12);
      body.id = v4();
      body.username = "Emp" + body.username
      body.password = hashpassword;
      body.status = true;
      const fileResult = await uploadImage(file);
      body.employeeImgUrl=fileResult.fileLocation
      const data = await employeeConfig.model.create(body, { transaction: t });
      await t.commit();
      return data;
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  async createAdmin(settingsConfig, body) {
    const t = await startTransaction();
    try {
      const logger = settingsConfig.logger;
      logger.info(`[EmployeeService] : Inside createAdmin`);

      const hashpassword = await bcrypt.hash(body.password, 12);
      body.id = v4();
      body.username = "Adm" + body.username
      body.password = hashpassword;
      body.status = true;

      const data = await employeeConfig.model.create(body, { transaction: t });
      await t.commit();
      return data;
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  async verifyEmployee(settingsConfig, payload, username) {
    try {
      const logger = settingsConfig.logger;
      logger.info(`[EmployeeService] : Inside verifyEmployee`);
      return payload.username === username;
    } catch (error) {
      throw error;
    }
  }
  

  async getEmpByUsername(settingsConfig, username) {

    const t = await startTransaction();
    try {
  
      const logger = settingsConfig.logger;
      logger.info(`[EmployeeService] : Inside getEmpByUsername`);
     
      const data = await employeeConfig.model.findAll({
        where: { username:username },
        paranoid: false,
        transaction: t,
      });
   
      await t.commit();
      
      return data;
    } catch (error) {
      
      await t.rollback();
      throw error;
}
}

  async deleteEmployee(settingsConfig, empId, queryParams) {
    const t = await startTransaction()
    try {
      const logger = settingsConfig.logger;
      logger.info(`[EmployeeService] : Inside deleteEmployee`);
      const empExitence = await this.getEmployee(settingsConfig, empId, queryParams)

      if (empExitence == null) {
        throw new Error("Employee Does Not Exists")

      }
      const data = await employeeConfig.model.destroy({ where: { id: empId } })
      t.commit()
      return data
    } catch (error) {
      t.rollback()
      throw error
    }
  }
  async getAllEmpoyee(settingsConfig, queryParams) {
    const t = await startTransaction()
    try {
      const selectArray = {
        id: employeeConfig.fieldMapping.id,
        employeeName: employeeConfig.fieldMapping.employeeName,
        username: employeeConfig.fieldMapping.username,
        email: employeeConfig.fieldMapping.email,
        role: employeeConfig.fieldMapping.role
      }
      const attributeToReturn = Object.values(selectArray)
      const includeQuery = queryParams.include || [];
      const logger = settingsConfig.logger;
      logger.info(`[Employee_SERVICE] : Inside getAllEmployee`);
      const data = await employeeConfig.model.findAndCountAll({
        transaction: t,
        ...parseFilterQueries(queryParams, employeeConfig.filter),
        attributes: attributeToReturn,
        ...parseLimitAndOffset(queryParams)
      })
      if (data == null) {
        throw new Error("Record Does Not Exists")

      }
      t.commit()
      return data
    } catch (error) {
      t.rollback()
      throw error
    }
  }
  async getEmployee(settingsConfig, empId, queryParams) {
    const t = await startTransaction()
    try {
      const attributeToReturn = {
        id: employeeConfig.fieldMapping.id,
        employeeName: employeeConfig.fieldMapping.employeeName,
        username: employeeConfig.fieldMapping.username,
        email: employeeConfig.fieldMapping.email,
        role: employeeConfig.fieldMapping.role

      }

      let selectArray = parseSelectFields(queryParams, attributeToReturn);

      if (!selectArray) {
        selectArray = Object.values(attributeToReturn);
      }
      const logger = settingsConfig.logger;
      logger.info(`[Employee_SERVICE] : Inside getEmployee`);
      const data = await employeeConfig.model.findOne({
        where: { id: empId },
        attributes: selectArray,
        transaction: t,

      });
      if (data == null) {
        throw new Error("User Does Not Exists With Given Id")

      }
      t.commit()
      return data
    } catch (error) {
      t.rollback()
      throw error
    }
  }

  async updateEmployee(settingsConfig, userId, body) {
    const t = await startTransaction();
    try {
      const logger = settingsConfig.logger;
      logger.info(`[Employee_SERVICE] : Inside updateEmployee`);
      let empToBeUpdate = await employeeConfig.model.update(body, {
        where: { id: userId },
        transaction: t,
      });

      t.commit();

      return empToBeUpdate;

    } catch (error) {
      await t.rollback();
      throw error;
    }
  }


  async login(settingsConfig, bodyElements, queryParams) {
    const t = await startTransaction();
    try {
      const { username, password, role } = bodyElements;

      const arrtibutesToReturn = {
        username: employeeConfig.fieldMapping.username,
        password: employeeConfig.fieldMapping.password,
        id: employeeConfig.fieldMapping.id,
        employeeName: employeeConfig.fieldMapping.employeeName,
        email: employeeConfig.fieldMapping.email,
        role: employeeConfig.fieldMapping.role
      };


      const selectArray = Object.values(arrtibutesToReturn);
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


}

const employeeService = new EmployeeService()
module.exports = employeeService