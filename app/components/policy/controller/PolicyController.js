const { validate } = require("uuid");
const nodemailer = require("nodemailer");
const policyConfig = require("../../../model-config/policyConfig");
const policyService = require("../service/PolicyService");
const { HttpStatusCode } = require("axios");
const { v4 } = require("uuid");
const { validateUuid } = require("../../../utils/uuid");
const { checkJwtHS256 } = require("../../../middleware/authService");
const PlanService = require("../../plan/service/PlanService");
const customerService = require("../../customer/service/CustomerService");
const PaymentDetailService = require("../../paymentdetail/service/PaymentDetailService");
class PolicyController {
  constructor() {
    this.PolicyService = policyService;
    this.planService = new PlanService();
    this.customerService = customerService;
    this.paymentService = new PaymentDetailService();
  }

  async createPolicy(settingsConfig, req, res, next) {
    try {
      // const logger = settingsConfig.logger;
      // logger.info(`[POLICY_CONTROLLER] : Inside createPolicy`);
      const { amount, years, typeofpremimum, paymentMethod } = req.body;
      const { planId } = req.params;
      const policyIds = v4();
      req.body.id = policyIds;
      const requiredFields = [
        "amount",
        "years",
        "typeofpremimum",
        "paymentMethod",
      ];
      for (const field of requiredFields) {
        if (req.body[field] === null || req.body[field] === undefined) {
          throw new Error("Please enter all fields");
        }
      }
      if (
        typeof amount != "number" ||
        typeof years != "number" ||
        typeof typeofpremimum != "string" ||
        typeof paymentMethod != "string"
      ) {
        throw new Error("invalid input");
      }
      validateUuid(planId);
      const { rows, count } = await this.planService.getAllPlansById(
        settingsConfig,
        planId,
        req.query
      );
      if (rows.length == 0) {
        throw new Error("Plan Not Found");
      }

      req.body.insuranceType = rows[0].insuranceType;
      req.body.planName = rows[0].planName;
      req.body.profitRatio = rows[0].profitRatio;
      req.body.requestStatus = false;
      if (
        typeofpremimum != "quaterly" &&
        typeofpremimum != "yearly" &&
        typeofpremimum != "half-yearly" &&
        typeofpremimum != "monthly"
      ) {
        throw new Error("Invalid Premimum Type");
      }
      req.body.primimumType = typeofpremimum;
      if (
        amount < rows[0].minInvestmentAmount ||
        amount > rows[0].maxInvestmentAmount
      ) {
        throw new Error(
          "Invalid Amount,Please Read The Terms Of The Policy Carefully"
        );
      }
      const sumAssured = amount * rows[0].profitRatio + amount;
      req.body.sumAssured = sumAssured;
      const payload = checkJwtHS256(settingsConfig, req, res, next);
      const customer = await this.customerService.getCustomerByUsername(
        settingsConfig,
        payload.username
      );
      req.body.customerId = customer[0].id;
      req.body.planId = planId;
      const customerAge = customer[0].age;
      if (customerAge < rows[0].minAge && customerAge < rows[0].maxAge) {
        throw new Error("You are Not Eligible To Apply For This Policy");
      }
      if (rows[0].status == false) {
        throw new Error("You are Not Eligible To Apply For This Policy");
      }
      if (years < rows[0].policyTermMin || years < rows[0].policyTermMax) {
        throw new Error(
          "Invalid Year,Please Read The Policy Term and Condition CareFully"
        );
      }
      let installationAmount;
      const premimumYearly = amount / years;
      if (typeofpremimum == "yearly") {
        req.body.totalPremimumAmount = premimumYearly;
        installationAmount = premimumYearly;
      }
      if (typeofpremimum == "quaterly") {
        req.body.totalPremimumAmount = premimumYearly / 4;
        installationAmount = premimumYearly / 4;
      }
      if (typeofpremimum == "half-yearly") {
        req.body.totalPremimumAmount = premimumYearly / 2;
        installationAmount = premimumYearly / 2;
      }
      if (typeofpremimum == "monthly") {
        req.body.totalPremimumAmount = premimumYearly / 12;
        installationAmount = premimumYearly / 12;
      }
      const date = new Date();
      const newDate =
        date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear();
      let startDate = new Date(date);

      let maturityDate = new Date(startDate);
      maturityDate.setFullYear(startDate.getFullYear() + years);
      req.body.date = newDate;
      const newMaturityDate =
        maturityDate.getDate() +
        "/" +
        maturityDate.getMonth() +
        "/" +
        maturityDate.getFullYear();
      req.body.maturityDate = newMaturityDate;
      const data = await this.PolicyService.createPolicy(
        settingsConfig,
        req.body
      );
      let paymentBody={};
      paymentBody.paymentStatus = true;
      paymentBody.paymentMethod = paymentMethod;
      paymentBody.installationAmount = installationAmount;
      paymentBody.installationNo = 0;
      
      let currentdate = date.getDate();
      let currentMonth = date.getMonth();
      let currentYear = date.getFullYear();
      paymentBody.installationDate =
        currentYear + "-" + currentMonth + "-" + currentdate;
      paymentBody.paymentDate =
        currentYear + "-" + currentMonth + "-" + currentdate;
      await this.paymentService.createPaymentDetail(
        settingsConfig,
        policyIds,
        paymentBody
      );

      //  installment1
      switch (typeofpremimum) {
        case "yearly": {
          paymentBody.paymentDate=null

          let finalDate;
      paymentBody.paymentStatus = false;
      paymentBody.paymentMethod = paymentMethod;
      paymentBody.installationAmount = installationAmount;

          const totalInstallments = years * 1;
          for (let i = 0; i < totalInstallments; i++) {
            paymentBody.installationNo=i+1

            currentYear = currentYear + 1;
            finalDate = currentYear + "-" + currentMonth + "-" + currentdate;
            // instllments
            paymentBody.installationDate =finalDate
            await this.paymentService.createPaymentDetail(
              settingsConfig,
              policyIds,
              paymentBody
            );
          }

          break;
        }
        case "monthly": {
          paymentBody.paymentDate=null

          let finalDate;
          paymentBody.paymentStatus = false;
          paymentBody.paymentMethod = paymentMethod;
          paymentBody.installationAmount = installationAmount;
          const totalInstallments = years * 12;
          for (let i = 0; i < totalInstallments-1; i++) {
            paymentBody.installationNo=i+1

            if (currentMonth == 12) {
              currentYear = currentYear + 1;
              currentMonth = 1;
              finalDate = currentYear + "-" + currentMonth + "-" + currentdate;
              // instllments
              paymentBody.installationDate =finalDate
            await this.paymentService.createPaymentDetail(
              settingsConfig,
              policyIds,
              paymentBody
            );
            } else {
              currentMonth = currentMonth + 1;
              finalDate = currentYear + "-" + currentMonth + "-" + currentdate;
              // instllments
              paymentBody.installationDate =finalDate
            await this.paymentService.createPaymentDetail(
              settingsConfig,
              policyIds,
              paymentBody
            );
            }
          }

          break;
        }
        case "quaterly": {
          paymentBody.paymentDate=null

          let finalDate;
          paymentBody.paymentStatus = false;
          paymentBody.paymentMethod = paymentMethod;
          paymentBody.installationAmount = installationAmount;
          const totalInstallments = years * 4;
          for (let i = 0; i < totalInstallments-1; i++) {
            paymentBody.installationNo=i+1

            const addmonth = currentMonth + 4;
            if (addmonth > 12) {
              currentMonth = addmonth - 12;
              currentYear = currentYear + 1;
              finalDate = currentYear + "-" + currentMonth + "-" + currentdate;
              // installments
              paymentBody.installationDate =finalDate
            await this.paymentService.createPaymentDetail(
              settingsConfig,
              policyIds,
              paymentBody
            );
            } else {
              currentMonth = currentMonth + 3;

              finalDate = currentYear + "-" + currentMonth + "-" + currentdate;
              // installments
              paymentBody.installationDate =finalDate
            await this.paymentService.createPaymentDetail(
              settingsConfig,
              policyIds,
              paymentBody
            );
            }
          }
          break;
        }
        case "half-yearly": {
          paymentBody.paymentDate=null

          let finalDate;
          paymentBody.paymentStatus = false;
          paymentBody.paymentMethod = paymentMethod;
          paymentBody.installationAmount = installationAmount;
          const totalInstallments = years * 2;
          for (let i = 0; i < totalInstallments-1; i++) {
            paymentBody.installationNo=i+1

            const addmonth = currentMonth + 6;
            if (addmonth > 12) {
              currentMonth = addmonth - 12;
              currentYear = currentYear + 1;
              finalDate = currentYear + "-" + currentMonth + "-" + currentdate;
              // installments
              paymentBody.installationDate =finalDate
            await this.paymentService.createPaymentDetail(
              settingsConfig,
              policyIds,
              paymentBody
            );
            } else {
              currentMonth = currentMonth + 6;

              finalDate = currentYear + "-" + currentMonth + "-" + currentdate;
              // installments
              paymentBody.installationDate =finalDate
            await this.paymentService.createPaymentDetail(
              settingsConfig,
              policyIds,
              paymentBody
            );
            }
          }
          break;
        }
      }

      res.status(HttpStatusCode.Ok).json(data);
    } catch (error) {
      next(error);
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
