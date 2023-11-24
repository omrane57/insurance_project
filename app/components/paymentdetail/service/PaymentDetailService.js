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
      const data = await insuranceTypeConfig.model.findAndCountAll({
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

  async createPaymentDetail(settingsConfig, agentId, policyId, body) {
    const t = await startTransaction();
    try {
      const logger = settingsConfig.logger;
      logger.info(`[PaymentDetailService] : Inside createPaymentDetail`);

      body.id = v4();
      body.paymentStatus = true;
      (body.installationDate = new Date()), (body.paymentDate = new Date()); //change later
      // body.agentId = agentId,
      //     body.policyId = policyId
      console.log(body);
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
