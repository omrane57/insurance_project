const { v4 } = require("uuid");
const PlanService = require("../service/PlanService");
const { HttpStatusCode } = require("axios");
const planConfig = require("../../../model-config/planConfig");
const { BadRequest } = require("throw.js");
const uuidV4Regex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89aAbB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;

class PlanController {
    constructor() {
        this.planservice = new PlanService()
    }

    //Get All Plans
    async getAllPlans(settingsConfig, req, res, next) {
        try {
            const logger = settingsConfig.logger;
            logger.info(`[ContactController] : Inside getAllContactdetails`);


            const queryParams = req.query
            let insuranceTypeId = req.params.insuranceTypeId
            const { count, rows } = await this.planservice.getAllPlans(settingsConfig, insuranceTypeId, queryParams)
            res.set('X-Total-Count', count)
            res.status(HttpStatusCode.Ok).json(rows)
            return
        } catch (error) {
            next(error)
        }
    }

    //Get Plan By Id
    async getPlanById(settingsConfig, req, res, next) {
        try {
            const logger = settingsConfig.logger;
            logger.info(`[ContactController] : Inside getContactdetailById`);

            const insuranceTypeId = req.params.insuranceTypeId
            const planId = req.params.planId


            const plan = await this.planservice.getAllPlansById(settingsConfig, insuranceTypeId, planId, req.query)
            res.status(HttpStatusCode.Ok).json(plan)
            return
        } catch (error) {
            next(error)
        }
    }

    //Create Plan
    // async createPlan(settingsConfig, req, res, next) {
    //     try {
    //         const logger = settingsConfig.logger;
    //         logger.info(`[PlanController] : Inside createPlan`);
    //         const { insuranceTypeId } = req.params
    //         if (!insuranceTypeId) {
    //             throw new BadRequest("Please enter insurance Id")
    //         }
    //         if (!uuidV4Regex.test(insuranceTypeId)) {
    //             const error = new Error('Invalid insuranceTypeId. Must be a valid UUID v4.');
    //             error.statusCode = HttpStatusCode.BadRequest;
    //             throw error;
    //         }
    //         const newplan = await this.planservice.createPlan(settingsConfig, insuranceTypeId, req.body)
    //         res.status(HttpStatusCode.Created).json(newplan)
    //         return
    //     } catch (error) {
    //         next(error)
    //     }
    // }
    async createPlan(settingsConfig, req, res, next) {
        try {
            const logger = settingsConfig.logger;
            logger.info(`[PlanController] : Inside createPlan`);

            // Extract the insuranceTypeId from the request parameters
            const { insuranceTypeId } = req.params;

            // Validate insuranceTypeId
            if (!insuranceTypeId) {
                throw new BadRequest("Please enter insurance Id");
            }
            if (!uuidV4Regex.test(insuranceTypeId)) {
                const error = new Error('Invalid insuranceTypeId. Must be a valid UUID v4.');
                error.statusCode = HttpStatusCode.BadRequest;
                throw error;
            }

            // Validate req.body (Check if all fields are present and not null)
            // const requiredFields = ['field1', 'field2'];
            // for (const field of requiredFields) {
            //     if (req.body[field] === null || req.body[field] === undefined) {
            //         const error = new Error(`Please enter all fields`);
            //         error.statusCode = HttpStatusCode.BadRequest;
            //         throw error;
            //     }
            // }

            // Call the planservice to create a new plan
            const newPlan = await this.planservice.createPlan(settingsConfig, insuranceTypeId, req.body);

            // Respond with a 201 Created status and the newly created plan in JSON format
            res.status(HttpStatusCode.Created).json(newPlan);

            // Exit the function
            return;
        } catch (error) {
            // If validation or any other error occurs, pass it to the next middleware/handler
            next(error);
        }
    }


    //Update Plan
    async updatePlan(settingsConfig, req, res, next) {
        try {
            const logger = settingsConfig.logger;
            logger.info(`[PlanController] : Inside Updateplan`);

            const insuranceTypeId = req.params.insuranceTypeId
            const planId = req.params.planId
            const plan = await this.planservice.getAllPlansById(settingsConfig, insuranceTypeId, planId, req.query)
            if (plan.length == 0) {
                throw new Error("Plan Not Found!")
            }
            const planUpdate = await this.planservice.updatePlan(settingsConfig, planId, req.body)
            res.status(HttpStatusCode.Ok).json("Plan Updated")
            return
        } catch (error) {
            next(error)
        }
    }


    //Delete plan
    async deletePlan(settingsConfig, req, res, next) {
        try {
            const logger = settingsConfig.logger;
            logger.info(`[PlanController] : Inside deletePlan`);

            const insuranceTypeId = req.params.insuranceTypeId
            const planId = req.params.planId
            const plan = await this.planservice.getAllPlansById(settingsConfig, insuranceTypeId, planId, req.query)
            if (plan.length == 0) {
                throw new Error("Plan Not Found!")
            }
            const planDeleted = await this.planservice.deletePlan(settingsConfig, planId)
            res.status(HttpStatusCode.Ok).json("Plan Deleted")
            return
        } catch (error) {
            next(error)
        }
    }


}

module.exports = new PlanController()