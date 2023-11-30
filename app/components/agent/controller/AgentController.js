const { validate } = require("uuid");
const nodemailer = require("nodemailer");
const { HttpStatusCode } = require("axios");
const { v4 } = require("uuid");
const { validateUuid } = require("../../../utils/uuid");
const { checkJwtHS256 } = require("../../../middleware/authService");
const agentService = require("../service/agentService");
class AgentController {
  constructor() {
    this.newAgentService = agentService;
  }
  async createAgent(settingsConfig, req, res, next) {
    try {
      const logger = settingsConfig.logger;
      logger.info(`[Agent_CONTROLLER] : Inside createAgent`);
      console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1");
      const employeeId =req.params
      const newBody=JSON.parse(req.body.data)
      if(!req.files){
        throw new Error("Please,Upload The Photo")
      }
      const {
        agentName,
        username,
        password,
        email,
        agentAddress,
        qualification
      } = newBody;
      newBody.employeeId=employeeId.employeeId

      const requiredFields = [ "agentName",
        "username",
        "password",
        "email",
        "agentAddress",
        "qualification",
        "employeeId"
      ];
      for (const field of requiredFields) {
          if (newBody[field] === null || newBody[field] === undefined) {
           throw new Error("Please enter all fields");
           
      }}
   if(typeof agentName !="string",
    typeof username !="string",
    typeof password !="string",
    typeof email !="string",
    typeof agentAddress !="string",
    typeof qualification !="string"){
 throw new Error("Invalid Data")
    }
       newBody.role="Agent"
       newBody.status="true"
       const newAgentName="Agent"+username
      const agent = await this.newAgentService.getAgentByUsername(
        settingsConfig,
        newAgentName
      );
      if (agent.length != 0) {
        throw new Error(
          "username Already Taken,Please Try With Another Username"
        );
      }
      const data = await this.newAgentService.createAgent(
        settingsConfig,
        newBody,req.files
      );
      res.status(HttpStatusCode.Ok).json(await data);
    } catch (error) {
      next(error);
    }
  }
  async deleteAgent(settingsConfig, req, res, next) {
    try {
      const logger = settingsConfig.logger;
      logger.info(`[Agent_CONTROLLER] : Inside deleteAgent`);
      const { agentId } = req.params;
      const agent = await this.newAgentService.getAgentById(
        settingsConfig,
        agentId,
        req.params
      );
      if (agent == null) {
        throw new Error("Agent With The Given Id Does Not Exits");
      }
      await this.newAgentService.deleteAgent(settingsConfig, agentId);
      res.set("X-Total-Count", 0);
      res.status(HttpStatusCode.Ok).json("Agent Deleted Successfully");
    } catch (error) {
      next(error);
    }
  }
  async getAllAgent(settingsConfig, req, res, next) {
    try {
      const logger = settingsConfig.logger;
      const queryParams = req.query;
      logger.info(`[Agent_CONTROLLER] : Inside getAllAgent`);
      const { rows, count } = await this.newAgentService.getAllAgent(
        settingsConfig,
        queryParams
      );
      res.set("X-Total-Count", count);
      res.status(HttpStatusCode.Ok).json(await rows);
    } catch (error) {
      next(error);
    }
  }

  async getAgentById(settingsConfig, req, res, next) {
    try {
      const logger = settingsConfig.logger;
      logger.info(`[Agent_CONTROLLER] : Inside getAgentById`);
      const { agentId } = req.params;

      const data = await this.newAgentService.getAgentById(
        settingsConfig,
        agentId,
        req.params
      );
      res.set("X-Total-Count", 1);
      res.status(HttpStatusCode.Ok).json(await data);
    } catch (error) {
      next(error);
    }
  }
  async updateAgent(settingsConfig, req, res, next) {
    try {
      const logger = settingsConfig.logger;
      logger.info(`[Agent_CONTROLLER] : Inside updateAgent`);

      const { agentId } = req.params;
      if(typeof agentId !="string")
      {
        throw new Error("Invalid Agent Id")
      }
      const agent = await this.newAgentService.getAgentById(
        settingsConfig,
        agentId,
        req.query
      );
      if (agent.length == 0) {
        throw new Error("Agent Not Found!");
      }

      const [agentToBeUpdated] = await this.newAgentService.updateAgent(
        settingsConfig,
        agentId,
        req.body
      );

      if (agentToBeUpdated == 0) {
        throw new Error("Could Not Update The Agent");
      }
      res.status(HttpStatusCode.Ok).json("Agent updated sucessfully");
      return;
    } catch (error) {
      next(error);
    }
  }
}
module.exports = new AgentController();
