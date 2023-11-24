const { validate } = require("uuid");
const nodemailer = require("nodemailer");
const { HttpStatusCode } = require("axios");
const { v4 } = require("uuid");
const { validateUuid } = require("../../../utils/uuid");
const { checkJwtHS256 } = require("../../../middleware/authService");
const customerService = require("../service/CustomerService");
class CustomerController {
  constructor() {
    this.newCustomerService = customerService;
  }
  async createCustomer(settingsConfig, req, res, next) {
    try {
      const logger = settingsConfig.logger;
      logger.info(`[Customer_CONTROLLER] : Inside createCustomer`);
      let newBody=JSON.parse(req.body.data)
      if(!req.files){
        throw new Error("Please,Upload The Photo")
      }
      const {
        customerName,
        username,
        password,
        email,
        dob,
        address,
        state,
        city,
        pincode,
        mobileno,
        nominee,
        nomineeRelation,
        agentId,
      } = newBody;
      const birthDate = new Date(dob);

      if (isNaN(birthDate.getTime())) {
        console.error("Invalid date format. Please use YYYY-MM-DD.");
        return null;
      }

      const today = new Date();
      let calculatedAge = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        calculatedAge--;
      }
      newBody.age = calculatedAge;
      newBody.role="Customer"
      const newUsername="Cust" + username

      if( typeof customerName !="string",
        typeof  username !="string",
        typeof  password !="string",
        typeof  email !="string",
        typeof  dob !="string",
        typeof  address !="string",
        typeof state !="string",
        typeof city !="string",
        typeof pincode !="string",
        typeof mobileno !="string",
        typeof nominee !="string",
        typeof nomineeRelation !="string"
        ){
            throw new Error("invalid input");

        }
        if(req.files.image==null){
          
        }
       if (agentId != undefined && typeof agentId != "string") {
        throw new Error("invalid input");
      }

      const customer = await this.newCustomerService.getCustomerByUsername(
        settingsConfig,
        newUsername
      );
      if (customer.length != 0) {
        throw new Error(
          "username Already Taken,Please Try With Another Username"
        );
      }
      const data = await this.newCustomerService.createCustomer(
        settingsConfig,
        newBody,
        req.files
      );
      res.status(HttpStatusCode.Ok).json(await data);
    } catch (error) {
      next(error);
    }
  }
  async deleteCustomer(settingsConfig, req, res, next) {
    try {
      const logger = settingsConfig.logger;
      logger.info(`[Customer_CONTROLLER] : Inside deleteCustomer`);
      const { custId } = req.params;
      const customer = await this.newCustomerService.getCustomerById(
        settingsConfig,
        custId,
        req.params
      );
      if (customer == null) {
        throw new Error("Customer With The Given Id Does Not Exits");
      }
      await this.newCustomerService.deleteCustomer(settingsConfig, custId);
      res.set("X-Total-Count", 0);
      res.status(HttpStatusCode.Ok).json("Customer Deleted Successfully");
    } catch (error) {
      next(error);
    }
  }
  async getAllCustomer(settingsConfig, req, res, next) {
    try {
      const logger = settingsConfig.logger;
      const queryParams = req.query;
      logger.info(`[Customer_CONTROLLER] : Inside getAllCustomer`);
      const { rows, count } = await this.newCustomerService.getAllCustomer(
        settingsConfig,
        queryParams
      );
      res.set("X-Total-Count", count);
      res.status(HttpStatusCode.Ok).json(await rows);
    } catch (error) {
      next(error);
    }
  }

  async getCustomerById(settingsConfig, req, res, next) {
    try {
      const logger = settingsConfig.logger;
      logger.info(`[Customer_CONTROLLER] : Inside getCustomerById`);
      const { custId } = req.params;
      if(typeof custId!="string"){
        throw new Error("Invalid CustomerId")
      }
      const data = await this.newCustomerService.getCustomerById(
        settingsConfig,
        custId,
        req.params
      );
      res.set("X-Total-Count", 1);
      res.status(HttpStatusCode.Ok).json(await data);
    } catch (error) {
      next(error);
    }
  }
  async updateCustomer(settingsConfig, req, res, next) {
    try {
      const logger = settingsConfig.logger;
      logger.info(`[Customer_CONTROLLER] : Inside updateCustomer`);

      const { custId } = req.params;

      const cust = await this.newCustomerService.getCustomerById(
        settingsConfig,
        custId,
        req.query
      );
      if (cust.length == 0) {
        throw new Error("Customer Not Found!");
      }

      const [custToBeUpdated] = await this.newCustomerService.updateCustomer(
        settingsConfig,
        custId,
        req.body
      );

      if (custToBeUpdated == 0) {
        throw new Error("Could Not Update The Customer");
      }
      res.status(HttpStatusCode.Ok).json("Customer updated sucessfully");
      return;
    } catch (error) {
      next(error);
    }
  }
}
module.exports = new CustomerController();
