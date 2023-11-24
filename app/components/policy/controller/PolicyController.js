const { validate } = require("uuid");
const nodemailer = require("nodemailer");
const policyConfig = require("../../../model-config/policyConfig");
const policyService = require("../service/PolicyService");
const { HttpStatusCode } = require("axios");
const { v4 } = require("uuid");
const { validateUuid } = require("../../../utils/uuid");
const { checkJwtHS256 } = require("../../../middleware/authService");
class PolicyController {
  constructor() {
    this.PolicyService = policyService;
  }

  async createPolicy(settingsConfig,req,res,next){
      try {
      const logger = settingsConfig.logger;
      logger.info(`[POLICY_CONTROLLER] : Inside createPolicy`);
      const{}=req.body
  //  const user=await this.newUserService.getUserByUsername(settingsConfig,username)
  //  if(user.length != 0){
  //     throw new Error("username Already Taken")
  // }
      const data =await this.PolicyService.createPolicy(settingsConfig,req.body)
      res.status(HttpStatusCode.Ok).json(data)
      } catch (error) {
          next(error)
      }
  }

  async getAllPolicy(settingsConfig, req, res, next) {
    try {
      const logger = settingsConfig.logger;
      const queryParams = req.query;
      logger.info(`[POLICY_CONTROLLER] : Inside getAllPolicy`);
      const { rows, count } = await this.PolicyService.getAllPolicy(
        settingsConfig,
        queryParams
      );
      res.set("X-Total-Count", count);
      res.status(HttpStatusCode.Ok).json(rows);
    } catch (error) {
      next(error);
    }
  }

  async getPolicyById(settingsConfig, req, res, next) {
    try {
      const logger = settingsConfig.logger;
      logger.info(`[POLICY_CONTROLLER] : Inside getPolicyById`);
      const { policyId } = req.params;
      validateUuid(policyId);
      const rows = await this.PolicyService.getPolicyById(
        settingsConfig,
        policyId,
        req.params
      );
      res.set("X-Total-Count", 1);
      res.status(HttpStatusCode.Ok).json(rows);
    } catch (error) {
      next(error);
    }
  }

  async updatePolicy(settingsConfig, req, res, next) {
    try {
      const logger = settingsConfig.logger;
      logger.info(`[UserController] : Inside updatePolicy`);

      const { policyId } = req.params;

      const policy = await this.PolicyService.getPolicyById(
        settingsConfig,
        policyId,
        req.query
      );
      if (policy.length == 0) {
        throw new Error("policy Not Found!");
      }

      const [policyToBeUpdated] = await this.PolicyService.updatePolicy(
        settingsConfig,
        policyId,
        req.body
      );

      if (policyToBeUpdated == 0) {
        throw new Error("Could Not Update policy");
      }
      res.status(HttpStatusCode.Ok).json("policy updated sucessfully");
      return;
    } catch (error) {
      next(error);
    }
  }

  async deletePolicy(settingsConfig, req, res, next) {
    try {
      const logger = settingsConfig.logger;
      logger.info(`[POLICY_CONTROLLER] : Inside deletePolicy`);
      const { policyId } = req.params;

      await this.PolicyService.deletePolicy(
        settingsConfig,
        policyId,
        req.query
      );
      res.status(HttpStatusCode.Ok).json("policy Deleted Successfully");
    } catch (error) {
      next(error);
    }
  }
}
module.exports = new PolicyController();
