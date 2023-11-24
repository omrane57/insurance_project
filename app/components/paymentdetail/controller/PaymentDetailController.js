const { BadRequest } = require("throw.js");
const PaymentDetailService = require("../service/PaymentDetailService");
const { HttpStatusCode } = require("axios");
class PaymentDetailController {
  constructor() {
    this.paymentdetailservice = new PaymentDetailService();
  }

  async getAllPaymentDetails(settingsConfig, req, res, next) {
    try {
      const logger = settingsConfig.logger;
      logger.info(`[paymentdetail_CONTROLLER] : Inside getAllPaymentDetails`);
      const data = await this.paymentdetailservice.getAllPaymentDetails(
        settingsConfig
      );
      // res.set('X-Total-Count', count)
      res.status(HttpStatusCode.Ok).json(data);
    } catch (error) {
      next(error);
    }
  }

  async getPaymentDetailById(settingsConfig, req, res, next) {
    try {
      const logger = settingsConfig.logger;
      logger.info(`[ContactController] : Inside getContactdetailById`);

      const paymentDetailId = req.params.paymentDetailId;

      const paymentDetail =
        await this.paymentdetailservice.getPaymentDetailById(
          settingsConfig,
          paymentDetailId
        );
      res.status(HttpStatusCode.Ok).json(paymentDetail);
      return;
    } catch (error) {
      next(error);
    }
  }

  async createPaymentDetail(settingsConfig, req, res, next) {
    try {
      const logger = settingsConfig.logger;
      logger.info(`[PaymentDetailController] : Inside create`);
      const agentId = req.params.agentId;
      const policyId = req.params.policyId;
      if (!agentId) {
        throw new BadRequest("Please enter agent Id");
      }
      if (!policyId) {
        throw new BadRequest("Please enter policy Id");
      }
      const data = await this.paymentdetailservice.createPaymentDetail(
        settingsConfig,
        agentId,
        policyId,
        req.body
      );
      res.status(HttpStatusCode.Created).json(data);
      return;
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PaymentDetailController();
