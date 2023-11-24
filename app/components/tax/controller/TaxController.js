const { validate } = require("uuid");
const nodemailer = require('nodemailer')
const taxService = require("../service/TaxService");
const { HttpStatusCode } = require("axios");
const { v4 } = require('uuid');
const { validateUuid } = require("../../../utils/uuid");
const { checkJwtHS256 } = require("../../../middleware/authService");
class TaxController {
    constructor() {
        this.newTaxService = taxService
    }
    async createTax(settingsConfig, req, res, next) {
        try {
            const logger = settingsConfig.logger;
            logger.info(`[TAX_CONTROLLER] : Inside createTax`);
            const {taxPercentage } = req.body;
            const requiredFields = [ "taxPercentage"
        ];
       for (const field of requiredFields) {
           if (req.body[field] === null || req.body[field] === undefined) {
            throw new Error("Please enter all fields");
            
       }}
            const state = await this.newTaxService.createTax(settingsConfig, req.body);
            return res.status(200).json(state);
        } catch (error) {
            next(error);
        }
    }
    async deleteTax(settingsConfig, req, res, next) {
        try {
            const logger = settingsConfig.logger;
            logger.info(`[TAX_CONTROLLER] : Inside deleteState`);
            const { taxId } = req.params
            const queryParams=req.query
            const taxExitence=await this.newTaxService.getTax(settingsConfig,taxId,queryParams)
      
            if(taxExitence==null)
     {
        throw new Error("tax Does Not Exists")
     }       
            await this.newTaxService.deleteTax(settingsConfig, taxId, req.query)
            res.set('X-Total-Count', 0)
            res.status(HttpStatusCode.Ok).json("Tax Deleted Successfully")
        } catch (error) {
            console.log(error);
            next(error)
        }
    }
    async getAllTax(settingsConfig, req, res, next) {
        try {
            const logger = settingsConfig.logger;
            const queryParams = req.query
            logger.info(`[TAX_CONTROLLER] : Inside getAllTax`);
            const { rows, count } = await this.newTaxService.getAllTax(settingsConfig, queryParams)
            res.set('X-Total-Count', count)
            res.status(HttpStatusCode.Ok).json(await rows)
        } catch (error) {
            next(error)
        }
    }

    async getTax(settingsConfig, req, res, next) {
        try {
            const logger = settingsConfig.logger;
            logger.info(`[TAX_CONTROLLER] : Inside getTax`);
            const { taxId } = req.params
            const queryParams=req.query

            const data = await this.newTaxService.getTax(settingsConfig,taxId,queryParams)
            res.set('X-Total-Count', 1)
            res.status(HttpStatusCode.Ok).json(await data)
        } catch (error) {
            next(error)
        }
    }
    async updateTax(settingsConfig, req, res, next) {
        try {
            const logger = settingsConfig.logger;
            logger.info(`[TAX_CONTROLLER] : Inside updateTax`);

            const { taxId } = req.params
 
            const tax = await this.newTaxService.getTax(settingsConfig, taxId, req.query)
            if (tax.length == 0) {
                throw new Error("tax Not Found!")
            }

            const [stateToBeUpdated] = await this.newTaxService.updateTax(settingsConfig, taxId, req.body)

            if (stateToBeUpdated == 0) {
                throw new Error("Could Not Update tax")
            }
            res.status(HttpStatusCode.Ok).json("tax updated sucessfully")
            return
        } catch (error) {
            next(error)
        }
    }

}
module.exports = new TaxController()