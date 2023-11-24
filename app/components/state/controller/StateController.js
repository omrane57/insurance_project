const { validate } = require("uuid");
const nodemailer = require('nodemailer')
const stateService = require("../service/StateService");
const { HttpStatusCode } = require("axios");
const { v4 } = require('uuid');
const { validateUuid } = require("../../../utils/uuid");
const { checkJwtHS256 } = require("../../../middleware/authService");
class StateController {
    constructor() {
        this.newStateService = stateService
    }
    async createState(settingsConfig, req, res, next) {
        try {
            const logger = settingsConfig.logger;
            logger.info(`[STATE_CONTROLLER] : Inside createState`);
            const { stateName } = req.body;
            const requiredFields = [ "stateName"
        ];
       for (const field of requiredFields) {
           if (req.body[field] === null || req.body[field] === undefined) {
            throw new Error("Please enter all fields");
            
       }}
            if (typeof stateName != "string") {
                throw new Error("Invalid stateName")
            }
            const state = await this.newStateService.createState(settingsConfig, req.body);
            return res.status(200).json(state);
        } catch (error) {
            next(error);
        }
    }
    async deleteState(settingsConfig, req, res, next) {
        try {
            const logger = settingsConfig.logger;
            logger.info(`[STATE_CONTROLLER] : Inside deleteState`);
            const { stateId } = req.params

            await this.newStateService.deleteState(settingsConfig, stateId, req.query)
            res.set('X-Total-Count', 0)
            res.status(HttpStatusCode.Ok).json("Employee Deleted Successfully")
        } catch (error) {
            next(error)
        }
    }
    async getAllState(settingsConfig, req, res, next) {
        try {
            const logger = settingsConfig.logger;
            const queryParams = req.query
            logger.info(`[state_CONTROLLER] : Inside getAllState`);
            const { rows, count } = await this.newStateService.getAllstate(settingsConfig, queryParams)
            res.set('X-Total-Count', count)
            res.status(HttpStatusCode.Ok).json(await rows)
        } catch (error) {
            next(error)
        }
    }

    async getState(settingsConfig, req, res, next) {
        try {
            const logger = settingsConfig.logger;
            logger.info(`[EMPLOYEE_CONTROLLER] : Inside getState`);
            const { stateId } = req.params

            const data = await this.newStateService.getState(settingsConfig, stateId, req.params)
            res.set('X-Total-Count', 1)
            res.status(HttpStatusCode.Ok).json(await data)
        } catch (error) {
            next(error)
        }
    }
    async updateState(settingsConfig, req, res, next) {
        try {
            const logger = settingsConfig.logger;
            logger.info(`[STATE_CONTROLLER] : Inside updateState`);

            const { stateId } = req.params

            const state = await this.newStateService.getState(settingsConfig, stateId, req.query)
            if (state.length == 0) {
                throw new Error("State Not Found!")
            }

            const [stateToBeUpdated] = await this.newStateService.updateState(settingsConfig, stateId, req.body)

            if (stateToBeUpdated == 0) {
                throw new Error("Could Not Update state")
            }
            res.status(HttpStatusCode.Ok).json("state updated sucessfully")
            return
        } catch (error) {
            next(error)
        }
    }

}
module.exports = new StateController()