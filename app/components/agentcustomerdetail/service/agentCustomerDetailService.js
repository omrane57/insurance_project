// const employeeConfig = require("../../../model-config/employeeConfig");
const { startTransaction } = require("../../../sequelize/transaction");
const {
  parseLimitAndOffset,
  parseSelectFields,
  parseFilterQueries,
} = require("../../../utils/request");
const { preloadAssociations } = require("../../../sequelize/association");
const { v4 } = require("uuid");
const agentCustomerDetailsConfig = require("../../../model-config/agentCustomerDetailsConfig");
class agentCustomerDetailService {
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
  async createAgentCustomerDetail(settingsConfig, body) {
    const t = await startTransaction();
    try {
      const logger = settingsConfig.logger;
      logger.info(`[AgentCustomerDetail] : Inside createAgentCustomerDetail`);
      body.id = v4();

      const data = await agentCustomerDetailsConfig.model.create(body, { transaction: t });
      await t.commit();
      return data;
    } catch (error) {
      console.log(error.message)
      await t.rollback();
      throw error;
    }
  }

  // async getAgentByUsername(settingsConfig, username) {
  //   const t = await startTransaction();
  //   try {
  //     const logger = settingsConfig.logger;
  //     logger.info(`[AgentCustomerDetail] : Inside getAgentByUsername`);
  //     const data = await agentConfig.model.findAll({
  //       where: { username: username },
  //       paranoid: false,
  //       transaction: t,
  //     });
  //     await t.commit();
  //     return data;
  //   } catch (error) {
  //     await t.rollback();
  //     throw error;
  //   }
  // }

  async deleteAgentCustomerDetail(settingsConfig, agentCustomerDetailId) {
    const t = await startTransaction();
    try {
      const logger = settingsConfig.logger;
      logger.info(`[AgentCustomerDetail] : Inside deleteAgentCustomerDetail`);

      const data = await agentCustomerDetailsConfig.model.destroy({ where: { id: agentCustomerDetailId } });
      t.commit();
      return data;
    } catch (error) {
      t.rollback();
      throw error;
    }
  }
  async getAgentCustomerDetail(settingsConfig, queryParams) {
    const t = await startTransaction();
    try {
      const selectArray = {
        id: agentCustomerDetailsConfig.fieldMapping.id,
        customerName: agentCustomerDetailsConfig.fieldMapping.customerName,
        insuranceScheme: agentCustomerDetailsConfig.fieldMapping.insuranceScheme,
        commissionAmount: agentCustomerDetailsConfig.fieldMapping.commissionAmount,
        date: agentCustomerDetailsConfig.fieldMapping.date,
        withdrawStatus: agentCustomerDetailsConfig.fieldMapping.withdrawStatus,
        agentId: agentCustomerDetailsConfig.fieldMapping.agentId,
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
      logger.info(`[AgentCustomerDetails_SERVICE] : Inside getAgentCustomerDetail`);
      const data = await agentCustomerDetailsConfig.model.findAndCountAll({
        transaction: t,
        ...parseFilterQueries(queryParams, agentCustomerDetailsConfig.filter),
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
  async getAgentCustomerDetailById(settingsConfig, agentCustomerDetailsId, queryParams) {
    const t = await startTransaction();
    try {
      const attributeToReturn = {
        id: agentCustomerDetailsConfig.fieldMapping.id,
        customerName: agentCustomerDetailsConfig.fieldMapping.customerName,
        insuranceScheme: agentCustomerDetailsConfig.fieldMapping.insuranceScheme,
        commissionAmount: agentCustomerDetailsConfig.fieldMapping.commissionAmount,
        date: agentCustomerDetailsConfig.fieldMapping.date,
        withdrawStatus: agentCustomerDetailsConfig.fieldMapping.withdrawStatus,
        agentId: agentCustomerDetailsConfig.fieldMapping.agentId,
      };
      // const attributeToReturn=Object.values(selectArray)
      let selectArray = parseSelectFields(queryParams, attributeToReturn);

      if (!selectArray) {
        selectArray = Object.values(attributeToReturn);
      }
      const logger = settingsConfig.logger;
      logger.info(`[AgentCustomerDetail_SERVICE] : Inside getAgentById`);
      const data = await agentCustomerDetailsConfig.model.findOne({
        where: { id: agentCustomerDetailsId },
        attributes: selectArray,
        transaction: t,
      });
      if (data == null) {
        throw new Error("AgentCustomerDetail Does Not Exists With Given Id");
      }
      t.commit();
      return data;
    } catch (error) {
      t.rollback();
      throw error;
    }
  }

  async updateAgentCustomerDetail(settingsConfig, agentCustomerDetailsId, body) {
  console.log(body,"ddddddddddlkllllllllllllllllllk")
    const t = await startTransaction();
    try {
      const logger = settingsConfig.logger;
      logger.info(`[AgentCustomerDetails_SERVICE] : Inside updateAgentCustomerDetail`);
      let agentCustomerDetailToBeUpdate = await agentCustomerDetailsConfig.model.update(body, {
        where: { id: agentCustomerDetailsId },
        transaction: t,
      });

      t.commit();

      return agentCustomerDetailToBeUpdate;
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }
}

const agentCustomerDetail = new agentCustomerDetailService();
module.exports = agentCustomerDetail;
