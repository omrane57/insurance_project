const policyConfig = require("../../../model-config/policyConfig");
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
class PolicyService {
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
  async createPolicy(settingsConfig, body) {
    const t = await startTransaction();
    try {
      const logger = settingsConfig.logger;
      logger.info(`[PolicyService] : Inside createPolicy`);
      body.dateCreated = new Date();
      const data = await policyConfig.model.create(body, { transaction: t });
      await t.commit();
      return data;
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  async getAllPolicy(settingsConfig, queryParams) {
    const t = await startTransaction();
    console.log(queryParams);
    try {
      const selectArray = {
        id: policyConfig.fieldMapping.id,
        insuranceType: policyConfig.fieldMapping.insuranceType,
        planName: policyConfig.fieldMapping.planName,
        date: policyConfig.fieldMapping.date,
        maturityDate: policyConfig.fieldMapping.maturityDate,
        primimumType: policyConfig.fieldMapping.primimumType,
        totalPremimumAmount: policyConfig.fieldMapping.totalPremimumAmount,
        profitRatio: policyConfig.fieldMapping.profitRatio,
        sumAssured: policyConfig.fieldMapping.sumAssured,
        requestStatus: policyConfig.fieldMapping.requestStatus,
        customer_id: policyConfig.fieldMapping.customer_id,
        agent_id: policyConfig.fieldMapping.agent_id,
        plan_id: policyConfig.fieldMapping.plan_id,
    
      };
      const attributeToReturn = Object.values(selectArray);
      const includeQuery = queryParams.include || [];
      let association = [];
      if (queryParams.include) {
        delete queryParams.include;
      }
      if (includeQuery) {
        // association = this.createAssociation(includeQuery);
        console.log("UserService", association);
      }

      const logger = settingsConfig.logger;
      logger.info(`[POLICY_SERVICE] : Inside getAllUser`);
      const data = await policyConfig.model.findAndCountAll({
        transaction: t,
        ...parseFilterQueries(queryParams, policyConfig.filter),
        attributes: attributeToReturn,
        ...parseLimitAndOffset(queryParams),
        ...preloadAssociations(association),
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
  async getPolicyById(settingsConfig, policyId, queryParams) {
    const t = await startTransaction();
    try {
      const selectArray = {
        id: policyConfig.fieldMapping.id,
        insuranceType: policyConfig.fieldMapping.insuranceType,
        planName: policyConfig.fieldMapping.planName,
        dateCreated: policyConfig.fieldMapping.dateCreated,
        maturityDate: policyConfig.fieldMapping.maturityDate,
        primimumType: policyConfig.fieldMapping.primimumType,
        totalPremimumAmount: policyConfig.fieldMapping.totalPremimumAmount,
        profitRatio: policyConfig.fieldMapping.profitRatio,
        sumAssured: policyConfig.fieldMapping.sumAssured,
        requestStatus: policyConfig.fieldMapping.requestStatus,
        customer_id: policyConfig.fieldMapping.customer_id,
        agent_id: policyConfig.fieldMapping.agent_id,
        plan_id: policyConfig.fieldMapping.plan_id,
        aadharMetadata: policyConfig.fieldMapping.aadharMetadata,
        panMetadata: policyConfig.fieldMapping.panMetadata,
      };
      const attributeToReturn = Object.values(selectArray);
      const includeQuery = queryParams.include || [];
      let association = [];
      if (queryParams.include) {
        delete queryParams.include;
      }
      if (includeQuery) {
        // association = this.createAssociation(includeQuery);
        console.log("UserService", association);
      }

      const logger = settingsConfig.logger;
      logger.info(`[POLICY_SERVICE] : Inside getPolicyById`);
      const data = await policyConfig.model.findOne({
        where: { id: policyId },
        attributes: attributeToReturn,
        transaction: t,
      });
      if (data == null) {
        throw new Error("Policy Does Not Exists With Given Id");
      }
      t.commit();
      return data;
    } catch (error) {
      t.rollback();
      throw error;
    }
  }

  async updatePolicy(settingsConfig, policyId, body) {
    const t = await startTransaction();
    try {
      const logger = settingsConfig.logger;
      logger.info(`[UserService] : Inside updatePolicy`);
      let userToBeUpdate = await policyConfig.model.update(body, {
        where: { id: policyId },
        transaction: t,
      });

      t.commit();

      return userToBeUpdate;
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  async deletePolicy(settingsConfig, policyId, queryParams) {
    const t = await startTransaction();
    try {
      const logger = settingsConfig.logger;
      logger.info(`[POLICY_SERVICE] : Inside deletePolicy`);
      const policyExitence = await this.getPolicyById(
        settingsConfig,
        policyId,
        queryParams
      );
      console.log(policyExitence);
      if (policyExitence == null) {
        throw new Error("policy Does Not Exists");
      }
      const data = await policyConfig.model.destroy({
        where: { id: policyId },
      });
      t.commit();
      return data;
    } catch (error) {
      t.rollback();
      throw error;
    }
  }
}

const policyService = new PolicyService();
module.exports = policyService;
