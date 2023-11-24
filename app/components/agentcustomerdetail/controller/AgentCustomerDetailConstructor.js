const { validate } = require("uuid");
const nodemailer = require("nodemailer");
const { HttpStatusCode } = require("axios");
const { v4 } = require("uuid");
const { validateUuid } = require("../../../utils/uuid");
const { checkJwtHS256 } = require("../../../middleware/authService");

const agentCustomerDetail = require("../service/agentCustomerDetailService");
class AgentCustomerDetailConstructor {
  constructor() {
    this.newAgentCustomerDetailService = agentCustomerDetail;
  }
  async createAgentCustomerDetail(settingsConfig, req, res, next) {
    try {
      const logger = settingsConfig.logger;
      logger.info(`[AgentCustomerDetail_CONTROLLER] : Inside createAgentCustomerDetail`);
      const {
        customerName,
        insuranceScheme,
        commissionAmount,
  
      } = req.body;
      const requiredFields = [  "customerName",
        "insuranceScheme",
        "commissionAmount"];
    for (const field of requiredFields) {
        if (req.body[field] === null || req.body[field] === undefined) {
         throw new Error("Please enter all fields");
         
    }}
      const date=new Date()
      const newDate=date.getDate()+"/"+date.getMonth()+"/"+date.getFullYear()
      req.body.date=newDate
      const{agentId}=req.params     
       if (
        typeof customerName != "string" ||
        typeof insuranceScheme != "string" ||
        typeof commissionAmount != "number"
     
        
      ) {
        throw new Error("invalid input");
      }
       req.body. withdrawStatus=false
       req.body.agentId=agentId
      const data = await this.newAgentCustomerDetailService.createAgentCustomerDetail(
        settingsConfig,
        req.body
      );
      res.status(HttpStatusCode.Ok).json(await data);
    } catch (error) {
      next(error);
    }
  }
  async deleteAgentCustomerDetail(settingsConfig, req, res, next) {
    try {
      const logger = settingsConfig.logger;
      logger.info(`[AgentCustomerDetailId_CONTROLLER] : Inside deleteAgentCustomerDetailIdt`);
      const { agentCustomerDetailId } = req.params;
      const agent = await this.newAgentCustomerDetailService.getAgentCustomerDetailById(
        settingsConfig,
        agentCustomerDetailId,
        req.params
      );
      if (agent == null) {
        throw new Error("AgentCustomerDetailId With The Given Id Does Not Exits");
      }
      await this.newAgentCustomerDetailService.deleteAgentCustomerDetail(settingsConfig,agentCustomerDetailId);
      res.set("X-Total-Count", 0);
      res.status(HttpStatusCode.Ok).json("AgentCustomerDetail Deleted Successfully");
    } catch (error) {
      next(error);
    }
  }
  async getAllAgentCustomerDetail(settingsConfig, req, res, next) {
    try {
      const logger = settingsConfig.logger;
      const queryParams = req.query;
      logger.info(`[AgentCustomerDetail_CONTROLLER] : Inside getAllAgentCustomerDetail`);
      const { rows, count } = await this.newAgentCustomerDetailService.getAgentCustomerDetail(
        settingsConfig,
        queryParams
      );
      res.set("X-Total-Count", count);
      res.status(HttpStatusCode.Ok).json(await rows);
    } catch (error) {
      next(error);
    }
  }

  async getAgentCustomerDetailById(settingsConfig, req, res, next) {
    try {
      const logger = settingsConfig.logger;
      logger.info(`[AgentCustomerDetail_CONTROLLER] : Inside getAgentCustomerDetailById`);
      const { agentCustomerDetailById } = req.params;

      const data = await this.newAgentCustomerDetailService.getAgentCustomerDetailById(
        settingsConfig,
        agentCustomerDetailById,
        req.params
      );
      res.set("X-Total-Count", 1);
      res.status(HttpStatusCode.Ok).json(await data);
    } catch (error) {
      next(error);
    }
  }
  async updateAgentCustomerDetail(settingsConfig, req, res, next) {
    try {
      const logger = settingsConfig.logger;
      logger.info(`[AgentCustomerDetail_CONTROLLER] : Inside updateAgentCustomerDetail`);

      const { agentCustomerDetailById } = req.params;

      const agent = await this.newAgentCustomerDetailService.updateAgentCustomerDetail(
        settingsConfig,
        agentCustomerDetailById,
        req.query
      );
      if (agent.length == 0) {
        throw new Error("AgentCustomerDetail Not Found!");
      }

      const [agentCustomerDetailToBeUpdated] = await this.newAgentCustomerDetailService.updateAgentCustomerDetail(
        settingsConfig,
        agentCustomerDetailById,
        req.body
      );

      if (agentCustomerDetailToBeUpdated == 0) {
        throw new Error("Could Not Update The AgentCustomerDetail");
      }
      res.status(HttpStatusCode.Ok).json("AgentCustomerDetail updated sucessfully");
      return;
    } catch (error) {
      next(error);
    }
  }
}
module.exports = new AgentCustomerDetailConstructor();
