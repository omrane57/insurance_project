const { validate } = require("uuid");
const cityService = require("../service/CityService");
const { HttpStatusCode } = require("axios");
const { v4 } = require('uuid');
class CityController {
    constructor() {
        this.newCityService = cityService
    }
    async createCity(settingsConfig, req, res, next) {
        try {
            const logger = settingsConfig.logger;
            logger.info(`[CITY_CONTROLLER] : Inside createCity`);
            const{stateId}=req.params;
            const { cityName } = req.body;
            const requiredFields = [ "cityName"
           ];
          for (const field of requiredFields) {
              if (req.body[field] === null || req.body[field] === undefined) {
               throw new Error("Please enter all fields");
               
          }}
            if (typeof cityName != "string") {
                throw new Error("Invalid cityName")
            }
            const state = await this.newCityService.createCity(settingsConfig, req.body,stateId);
            return res.status(200).json(state);
        } catch (error) {
            next(error);
        }
    }
    async deleteCity(settingsConfig, req, res, next) {
        try {
            const logger = settingsConfig.logger;
            logger.info(`[CITY_CONTROLLER] : Inside deleteState`);
            const { cityId,stateId } = req.params
            const cityExitence=await this.newCityService.getCity(settingsConfig,cityId,stateId,req.query)
      
            if(cityExitence==null)
     {
        throw new Error("city Does Not Exists")
     }       
            await this.newCityService.deleteCity(settingsConfig, cityId,stateId,req.query)
            res.set('X-Total-Count', 0)
            res.status(HttpStatusCode.Ok).json("city Deleted Successfully")
        } catch (error) {
            next(error)
        }
    }
    async getAllCity(settingsConfig, req, res, next) {
        try {
            const logger = settingsConfig.logger;
            const queryParams = req.query
            logger.info(`[CITY_CONTROLLER] : Inside getAllCity`);
            const{stateId}=req.params;

            const { rows, count } = await this.newCityService.getAllCity(settingsConfig, queryParams,stateId)
            res.set('X-Total-Count', count)
            res.status(HttpStatusCode.Ok).json(await rows)
        } catch (error) {
            next(error)
        }
    }

    async getCity(settingsConfig, req, res, next) {
        try {
            const logger = settingsConfig.logger;
            logger.info(`[CITY_CONTROLLER] : Inside getCity`);
            const { cityId,stateId} = req.params
            const queryParams=req.query

            const data = await this.newCityService.getCity(settingsConfig,cityId,stateId,queryParams)
            res.set('X-Total-Count', 1)
            res.status(HttpStatusCode.Ok).json(await data)
        } catch (error) {
            next(error)
        }
    }
    async updateCity(settingsConfig, req, res, next) {
        try {
            const logger = settingsConfig.logger;
            logger.info(`[CITY_CONTROLLER] : Inside updateCity`);

            const { cityId,stateId } = req.params
 
            const city = await this.newCityService.getCity(settingsConfig, cityId,stateId, req.query)
            if (city.length == 0) {
                throw new Error("city Not Found!")
            }

            const [cityToBeUpdated] = await this.newCityService.updateCity(settingsConfig, cityId,stateId, req.body)

            if (cityToBeUpdated == 0) {
                throw new Error("Could Not Update city")
            }
            res.status(HttpStatusCode.Ok).json("city updated sucessfully")
            return
        } catch (error) {
            next(error)
        }
    }

}
module.exports = new CityController()