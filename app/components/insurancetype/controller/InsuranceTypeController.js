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
            const {rows,count} = await this.insuranceservice.getAllInsuranceType(settingsConfig,req.query)
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
            let newBody = JSON.parse(req.body.data);
            const {insuranceName}=newBody
            const requiredFields = ["insuranceName"];
            for (const field of requiredFields) {
                if (newBody[field] === null || newBody[field] === undefined) {
                 throw new Error("Please enter all fields");
                 
            }}
                if (typeof insuranceName != "string") {
                    throw new Error("invalid input")
                }
            const insurance = await this.insuranceservice.getInsuranceTypeByName(settingsConfig,insuranceName)
  
            if (insurance.length != 0) {
                throw new BadRequest("Insurance Type Already Exist")
            }
            const InsuranceType = await this.insuranceservice.createInsuranceType(settingsConfig, newBody,req.files);
            
            res.status(HttpStatusCode.Created).json(InsuranceType.insuranceName);
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
            const user = await this.insuranceservice.getAllInsuranceTypeById(settingsConfig, insuranceTypeId,req.query)
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

            const InsuranceType = await this.insuranceservice.getAllInsuranceTypeById(settingsConfig, insuranceTypeId,req.query)
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