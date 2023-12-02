const { checkJwtHS256 } = require("../../../middleware/authService");
const customerService = require("../../customer/service/CustomerService");
const FeedbackService = require("../service/FeedbackService");
const { HttpStatusCode } = require("axios");
class FeedBackController {
  constructor() {
    this.feedbackservice = new FeedbackService();
    this.customerService = customerService;
  }

  async getAllFeedback(settingsConfig, req, res, next) {
    try {
      const logger = settingsConfig.logger;
      logger.info(`[Feedback_CONTROLLER] : Inside getAllFeedback`);
      const data = await this.feedbackservice.getAllFeedback(settingsConfig);
      // res.set('X-Total-Count', count)
      res.status(HttpStatusCode.Ok).json(data);
    } catch (error) {
      next(error);
    }
  }
  async getFeedbackByPolicyId(settingsConfig,req,res,next){
    try {
      const logger = settingsConfig.logger;
      logger.info(`[Feedback_CONTROLLER] : Inside getFeedbackByPolicyId`);
      const{policyId}=req.params
      const data = await this.feedbackservice.getFeedbackByPolicyId(settingsConfig,policyId);
      res.status(HttpStatusCode.Ok).json(data);
    } catch (error) {
      next(error);
    }
  }

  async createFeedback(settingsConfig, req, res, next) {
    try {
      const logger = settingsConfig.logger;
      logger.info(`[FeedbackController] : Inside createFeedback`);
      const { message, title,policyId} = req.body;
      const requiredFields = ["message", "title","policyId"];
      for (const field of requiredFields) {
        if (req.body[field] === null || req.body[field] === undefined) {
          throw new Error("Please enter all fields");
        }
      }
      if (typeof title != "string" || typeof message != "string") {
        throw new Error("invalid input");
      }

      const payload = checkJwtHS256(settingsConfig, req, res, next);
      const customer = await this.customerService.getCustomerByUsername(
        settingsConfig,
        payload.username
      );
      req.body.customerName=customer[0].customerName
      req.body.customerId=customer[0].id
      const date=new Date()
      const newDate=date.getDate()+"/"+date.getMonth()+"/"+date.getFullYear()
      req.body.contactDate=newDate
      req.body.reply='pending...'
      const newFeedback = await this.feedbackservice.createFeedback(settingsConfig, req.body)
      res.status(HttpStatusCode.Created).json(newFeedback);
      return;
    } catch (error) {
      next(error);
    }
  }
  async updateFeedBack(settingsConfig, req, res, next) {
    try {
      const logger = settingsConfig.logger;
      logger.info(`[UserController] : Inside updateFeedBack`);

      const { feedbackId } = req.params;
      const {reply}=req.body
  
      const requiredFields = ["reply"];
      for (const field of requiredFields) {
          if (req.body[field] === null || req.body[field] === undefined) {
           throw new Error("Please enter all fields");
           
      }}
      if(typeof reply!="string"){
        throw new Error("Invalid Type of Input")
      }
      const feedback = await this.feedbackservice.getFeedBackById(
        settingsConfig,
        feedbackId,
        req.query
      );
      if (feedback.length == 0) {
        throw new Error("feedback Not Found!");
      }

      const [feedbackToBeUpdated] = await this.feedbackservice.updateFeedback(
        settingsConfig,
        feedbackId,
        req.body
      );

      if (feedbackToBeUpdated == 0) {
        throw new Error("Could Not Reply to feedback");
      }
      res.status(HttpStatusCode.Ok).json("Replied To Feedback");
      return;
    } catch (error) {
      next(error);
    }
  }

}

module.exports = new FeedBackController();
