const { HttpStatusCode } = require("axios");
const InsuranceTypeService = require("../service/InsuranceTypeService");
const { BadRequest } = require("throw.js");
const { uuid } = require("uuid");


class InsuranceTypeController {
    constructor() {
        this.insuranceservice = new InsuranceTypeService()
    }

    //Get All InsuranceType
    async getAllInsuranceType(settingsConfig, req, res, next) {
        try {
            const logger = settingsConfig.logger;
            logger.info(`[InsuranceType_CONTROLLER] : Inside getAllInsuranceType`);
            const {rows,count} = await this.insuranceservice.getAllInsuranceType(settingsConfig)
            res.set('X-Total-Count', count)
            res.status(HttpStatusCode.Ok).json(rows)
        }
        catch (error) {
            next(error)
        }
    }

    //Create InsuranceType
    async createInsuranceType(settingsConfig, req, res, next) {
        try {
            const logger = settingsConfig.logger;
            logger.info("[InsuranceType_CONTROLLER] : Inside createInsuranceType");

            // Validate request body
            const requestBody = req.body;
            if (!requestBody || typeof requestBody !== "object") {
                const error = new Error("Invalid request body");
                error.statusCode = HttpStatusCode.BadRequest;
                throw error;
            }


            if (!requestBody.insuranceName || typeof requestBody.insuranceName !== "string") {
                const error = new Error("Invalid insuranceName");
                error.statusCode = HttpStatusCode.BadRequest;
                throw error;
            }

            if (/\d/.test(requestBody.insuranceName)) {
                const error = new Error("Insurance name cannot contain numbers");
                error.statusCode = HttpStatusCode.BadRequest;
                throw error;
            }

            const insuranceName = await this.insuranceservice.getInsuranceTypeByName(settingsConfig, req.body.insuranceName)
            if (insuranceName.length != 0) {
                throw new BadRequest("Insurance Type Already Exist")
            }
            const InsuranceType = await this.insuranceservice.createInsuranceType(settingsConfig, requestBody);
            res.status(HttpStatusCode.Created).json(InsuranceType);
        } catch (error) {
            next(error);
        }
    }

    //Update InsuranceType
    async updateInsuranceType(settingsConfig, req, res, next) {
        try {
            const logger = settingsConfig.logger;
            logger.info(`[InsuranceTypeController] : Inside updateInsuranceType`);

            const { insuranceTypeId } = req.params
            const user = await this.insuranceservice.getAllInsuranceTypeById(settingsConfig, insuranceTypeId)
            if (user.length == 0) {
                throw new Error("User Not Found!")
            }

            const [userToBeUpdated] = await this.insuranceservice.updateInsuranceType(settingsConfig, insuranceTypeId, req.body)
            console.log(userToBeUpdated);
            // if (userToBeUpdated == 0) {
            //     throw new Error("Could Not Update user")
            // }
            res.status(HttpStatusCode.Ok).json("user updated sucessfully")
            return
        } catch (error) {
            next(error)
        }
    }

    //Delete Insurance Type
    async deleteInsuranceType(settingsConfig, req, res, next) {
        try {
            const logger = settingsConfig.logger;
            logger.info(`[InsuranceTypeController] : Inside deleteInsuranceType`);

            const { insuranceTypeId } = req.params

            const InsuranceType = await this.insuranceservice.getAllInsuranceTypeById(settingsConfig, insuranceTypeId)
            if (InsuranceType.length == 0) {
                throw new Error(" Not Found!")
            }
            const InsuranceTypeDeleted = await this.insuranceservice.deleteInsuranceType(settingsConfig, insuranceTypeId)
            res.status(HttpStatusCode.Ok).json(" Deleted Sucessfully")
        }
        catch (error) {
            next(error)
        }
    }


}

module.exports = new InsuranceTypeController()