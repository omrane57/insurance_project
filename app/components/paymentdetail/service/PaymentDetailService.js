const { v4 } = require("uuid");
const paymentDetailConfig = require("../../../model-config/paymentDetailConfig");
const { startTransaction } = require("../../../sequelize/transaction");

class PaymentDetailService {
  constructor() {}

  async getAllPaymentDetails(settingsConfig) {
    const t = await startTransaction();
    try {
      const data = await paymentDetailConfig.model.findAndCountAll({
        transaction: t,
      });
      await t.commit();
      return data;
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  async getPaymentDetailById(settingsConfig, paymentDetailId) {
    const t = await startTransaction();
    try {
      const data = await paymentDetailConfig.model.findAndCountAll({
        transaction: t,
        id: paymentDetailId,
      });
      await t.commit();
      return data;
    } catch (error) {
      await t.rollback();
      throw error;  
    }
  }
  async getPaymentDetailByPolicyId(settingsConfig, policyId) {
    const t = await startTransaction();
    try {
      const {count,rows} = await paymentDetailConfig.model.findAndCountAll({where:{policyId:policyId},
        transaction: t
      });
      await t.commit();
      return rows;
    } catch (error) {
      await t.rollback();
      throw error;  
    }
  }
  

  async updatePaymentByid(settingsConfig,paymenId,body) {
    const t = await startTransaction();
    try {
      body.paymentStatus=true
      
      const data = await paymentDetailConfig.model.update(body,{where:{id:paymenId},
        transaction: t
      });
      await t.commit();
      return data;
    } catch (error) {
      await t.rollback();
      throw error;  
    }
  }

  async createPaymentDetail(settingsConfig,policyId, body) {
    const t = await startTransaction();
    try {
      const logger = settingsConfig.logger;
      logger.info(`[PaymentDetailService] : Inside createPaymentDetail`);

      body.id = v4();
    
      // body.agentId = agentId,
          body.policyId = policyId
      
      const data = await paymentDetailConfig.model.create(body, {
        transaction: t,
      });

      await t.commit();
      return data;
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }
}

module.exports = PaymentDetailService;
