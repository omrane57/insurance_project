// const employeeConfig = require("../../../model-config/employeeConfig");
const { startTransaction } = require("../../../sequelize/transaction");
const bcrypt = require("bcrypt");
const {
  parseLimitAndOffset,
  unmarshalBody,
  parseSelectFields,
  parseFilterQueries,
} = require("../../../utils/request");
const { tokencreation } = require("../../../middleware/authService");
const { preloadAssociations } = require("../../../sequelize/association");
const { v4 } = require("uuid");
const customerConfig = require("../../../model-config/customerConfig");
const agentConfig = require("../../../model-config/agentConfig");
const fs = require('fs/promises');
const uploadImage = async (file) => {


  try {
      // Check if image file is included
      if (file) {
        let dynamicDirectory;
        dynamicDirectory = 'C:/Users/aksha/OneDrive/Desktop/insurance/uploadimages/agent/agentPhoto';
        
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
  }}
class AgentService {
  // #associatiomMap = {
  //     account: {
  //       model: accountConfig.model,
  //       as: "account"
  //     },
  //   };
  constructor() {}
  // createAssociation(includeQuery) {
  //     const association = [];
  //     if (Array.isArray(includeQuery)) {
  //       includeQuery = [includeQuery];
  //     }
  //     if (includeQuery?.includes(userConfig.association.accountFilter)) {
  //       association.push(this.#associatiomMap.account);
  //       console.log("association>>>>", association);
  //       return association;
  //     }
  //   }
  async createAgent(settingsConfig, body,file) {
    const t = await startTransaction();
    try {
      const logger = settingsConfig.logger;
      logger.info(`[AgentService] : Inside createAgent`);
      const hashpassword = await bcrypt.hash(body.password, 12);
      body.id = v4();
      body.username = "Agent" + body.username;
      body.password = hashpassword;
      body.role="Agent"
      const fileResult = await uploadImage(file);
      body.agentImgUrl=fileResult.fileLocation
      const data = await agentConfig.model.create(body, { transaction: t });
      await t.commit();
      return data;
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  async getAgentByUsername(settingsConfig, username) {
    const t = await startTransaction();
    try {
      const logger = settingsConfig.logger;
      logger.info(`[AgentService] : Inside getAgentByUsername`);
      const data = await agentConfig.model.findAll({
        where: { username: username },
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

  async deleteAgent(settingsConfig, agentId) {
    const t = await startTransaction();
    try {
      const logger = settingsConfig.logger;
      logger.info(`[agentService] : Inside deleteAgent`);

      const data = await agentConfig.model.destroy({ where: { id: agentId } });
      t.commit();
      return data;
    } catch (error) {
      t.rollback();
      throw error;
    }
  }
  async getAllAgent(settingsConfig, queryParams) {
    const t = await startTransaction();
    try {
      const selectArray = {
        id: agentConfig.fieldMapping.id,
        agentName: agentConfig.fieldMapping.agentName,
        email: agentConfig.fieldMapping.email,
        role: agentConfig.fieldMapping.role,
        agentAddress: agentConfig.fieldMapping.agentAddress,
        status: agentConfig.fieldMapping.status,
        qualification:agentConfig.fieldMapping.qualification,
        username: agentConfig.fieldMapping.username,
        employeeId: agentConfig.fieldMapping.employeeId,
      };
      const attributeToReturn = Object.values(selectArray);
      // const includeQuery = queryParams.include || [];

      // let association = [];
      // if (queryParams.include) {
      //   delete queryParams.include;
      // }
      // if (includeQuery) {
      //   association = this.createAssociation(includeQuery);
      //   console.log("UserService",association);
      // }

      const logger = settingsConfig.logger;
      logger.info(`[Agent_SERVICE] : Inside getAllAgent`);
      const data = await agentConfig.model.findAndCountAll({
        transaction: t,
        ...parseFilterQueries(queryParams, agentConfig.filter),
        attributes: attributeToReturn,
        ...parseLimitAndOffset(queryParams),
        //  ...preloadAssociations(association),
      });
      if (data == null) {
        throw new Error("Record Does Not Exists");
      }
      t.commit();
      return data;
    } catch (error) {
      t.rollback();
      throw error;
    }
  }
  async getAgentById(settingsConfig, agentId, queryParams) {
    const t = await startTransaction();
    try {
      const attributeToReturn = {
        id: agentConfig.fieldMapping.id,
        agentName: agentConfig.fieldMapping.agentName,
        email: agentConfig.fieldMapping.email,
        role: agentConfig.fieldMapping.role,
        agentAddress: agentConfig.fieldMapping.agentAddress,
        status: agentConfig.fieldMapping.status,
        username: agentConfig.fieldMapping.username,
        employeeId: agentConfig.fieldMapping.employeeId,
      };
      // const attributeToReturn=Object.values(selectArray)
      let selectArray = parseSelectFields(queryParams, attributeToReturn);

      if (!selectArray) {
        selectArray = Object.values(attributeToReturn);
      }
      const logger = settingsConfig.logger;
      logger.info(`[Agent_SERVICE] : Inside getAgentById`);
      const data = await agentConfig.model.findOne({
        where: { id: agentId },
        attributes: selectArray,
        transaction: t,
      });
      if (data == null) {
        throw new Error("Agent Does Not Exists With Given Id");
      }
      t.commit();
      return data;
    } catch (error) {
      t.rollback();
      throw error;
    }
  }

  async updateAgent(settingsConfig, agentId, body) {
    const t = await startTransaction();
    try {
      const logger = settingsConfig.logger;
      logger.info(`[Agent_SERVICE] : Inside updateAgent`);
      let agentToBeUpdate = await agentConfig.model.update(body, {
        where: { id: agentId },
        transaction: t,
      });

      t.commit();

      return agentToBeUpdate;
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }
}

const agentService = new AgentService();
module.exports = agentService;
