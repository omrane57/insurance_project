const cityConfig = require("../../../model-config/cityConfig");
const {startTransaction}=require("../../../sequelize/transaction")
const bcrypt = require('bcrypt');
const { parseLimitAndOffset, unmarshalBody, parseSelectFields, parseFilterQueries }=require('../../../utils/request');
const { tokencreation } = require("../../../middleware/authService");
const {preloadAssociations}=require('../../../sequelize/association');
const { v4 } = require("uuid");
class CityService{
    constructor(){

    }
   
      async createCity(settingsConfig, body,stateId) {
        const t = await startTransaction();
        try {
       
          const logger = settingsConfig.logger;
          logger.info(`[CityService] : Inside createCity`);
          body.id = v4();
          body.status=true;
          body.stateId=stateId
          const data = await cityConfig.model.create(body, { transaction: t });
          await t.commit();
          return data;
        } catch (error) {
          await t.rollback();
          throw error;
        }
      } 
    async deleteCity(settingsConfig,cityId,stateId,queryParams){
        const t= await startTransaction() 
        try {
         
        const logger = settingsConfig.logger;
        logger.info(`[CityService] : Inside deleteCity`);
        
   const data= await cityConfig.model.destroy({where:{id:cityId}})
        t.commit()
        return data
        } catch (error) {
            t.rollback()
            throw error
        }
    }

    async getAllCity(settingsConfig,queryParams,stateId){
        const t= await startTransaction() 
        try {
            const selectArray={
              id:cityConfig.fieldMapping.id,
              cityName:cityConfig.fieldMapping.cityName,
              status:cityConfig.fieldMapping.status,
              stateId:cityConfig.fieldMapping.stateId    
            }
            const attributeToReturn=Object.values(selectArray)
            const includeQuery = queryParams.include || [];
        const logger = settingsConfig.logger;
        logger.info(`[CityService] : Inside getAllCity`);
        const data=await cityConfig.model.findAndCountAll({ transaction: t,
          ...parseFilterQueries(queryParams, cityConfig.filter,{[cityConfig.fieldMapping.stateId]:stateId}),
          attributes: attributeToReturn,
            // ...parseFilterQueries(queryParams, cityConfig.filter),
            attributes: attributeToReturn,
            ...parseLimitAndOffset(queryParams) 
        })
       if(data==null)
{
   throw new Error("Record Does Not Exists")
}       
        t.commit()
        return data
        } catch (error) {
            t.rollback()
            throw error
        }
    }
    async getCity(settingsConfig,cityId,stateId,queryParams){
        const t= await startTransaction() 
        try {
            const attributeToReturn={
              id:cityConfig.fieldMapping.id,
              cityName:cityConfig.fieldMapping.cityName,
              status:cityConfig.fieldMapping.status,
              stateId:cityConfig.fieldMapping.stateId   
            }
            // const attributeToReturn=Object.values(selectArray)
            let selectArray = parseSelectFields(queryParams, attributeToReturn);
    
            if (!selectArray) {
              selectArray = Object.values(attributeToReturn);
            }
        const logger = settingsConfig.logger;
        logger.info(`[City_SERVICE] : Inside getCity`);
        const data = await cityConfig.model.findOne({
            where: { id: cityId,stateId:stateId },
            attributes: selectArray,
            transaction: t,
            
          });
if(data==null)
        {
   throw new Error("city Does Not Exists With Given Id")

}       
        t.commit()
        return data
        } catch (error) {
          console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>",error);
            t.rollback()
            throw error
        }
    }

async updateCity(settingsConfig, cityId,stateId, body) {
    const t = await startTransaction();
    try {
      const logger = settingsConfig.logger;
      logger.info(`[CITY_SERVICE] : Inside C`);
      let cityToBeUpdate = await cityConfig.model.update(body, {
        where: { id: cityId,stateId:stateId },
        transaction: t,
      });
   
      t.commit();

      return cityToBeUpdate;
   
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }
}

const cityService=new CityService()
module.exports=cityService