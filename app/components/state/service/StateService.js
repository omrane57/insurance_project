const stateConfig = require("../../../model-config/stateConfig");
const {startTransaction}=require("../../../sequelize/transaction")
const bcrypt = require('bcrypt');
const { parseLimitAndOffset, unmarshalBody, parseSelectFields, parseFilterQueries }=require('../../../utils/request');
const { tokencreation } = require("../../../middleware/authService");
const {preloadAssociations}=require('../../../sequelize/association');
const { v4 } = require("uuid");
class StateService{
    constructor(){

    }
   
      async createState(settingsConfig, body) {
        const t = await startTransaction();
        try {
          const logger = settingsConfig.logger;
          logger.info(`[StateService] : Inside createState`);
          body.id = v4();
          body.status=true;
          
          const data = await stateConfig.model.create(body, { transaction: t });
          await t.commit();
          return data;
        } catch (error) {
          await t.rollback();
          throw error;
        }
      } 
    async deleteState(settingsConfig,stateId,queryParams){
        const t= await startTransaction() 
        try {
        const logger = settingsConfig.logger;
        logger.info(`[stateService] : Inside deleteState`);
        const stateExitence=await this.getState(settingsConfig,stateId,queryParams)
      
       if(stateExitence==null)
{
   throw new Error("state Does Not Exists")
}       
   const data= await stateConfig.model.destroy({where:{id:stateId}})
        t.commit()
        return data
        } catch (error) {
            t.rollback()
            throw error
        }
    }

    async getAllstate(settingsConfig,queryParams){
        const t= await startTransaction() 
        try {
            const selectArray={
              id:stateConfig.fieldMapping.id,
              stateName:stateConfig.fieldMapping.stateName,
              status:stateConfig.fieldMapping.status

                
            }
            const attributeToReturn=Object.values(selectArray)
            const includeQuery = queryParams.include || [];
        const logger = settingsConfig.logger;
        logger.info(`[Employee_SERVICE] : Inside getAllEmployee`);
        const data=await stateConfig.model.findAndCountAll({ transaction: t,
            ...parseFilterQueries(queryParams, stateConfig.filter),
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
    async getState(settingsConfig,stateId,queryParams){
        const t= await startTransaction() 
        try {
            const attributeToReturn={
              id:stateConfig.fieldMapping.id,
              stateName:stateConfig.fieldMapping.stateName,
              status:stateConfig.fieldMapping.status
                
            }
         
            // const attributeToReturn=Object.values(selectArray)
            let selectArray = parseSelectFields(queryParams, attributeToReturn);

            if (!selectArray) {
              selectArray = Object.values(attributeToReturn);
            }
        const logger = settingsConfig.logger;
        logger.info(`[STATE_SERVICE] : Inside getState`);
        const data = await stateConfig.model.findOne({
            where: { id: stateId },
            attributes: selectArray,
            transaction: t,
            
          });
if(data==null)
        {
   throw new Error("state Does Not Exists With Given Id")

}       
        t.commit()
        return data
        } catch (error) {
            t.rollback()
            throw error
        }
    }

async updateState(settingsConfig, stateId, body) {
    const t = await startTransaction();
    try {
      const logger = settingsConfig.logger;
      logger.info(`[STATE_SERVICE] : Inside updateState`);
      let stateToBeUpdate = await stateConfig.model.update(body, {
        where: { id: stateId },
        transaction: t,
      });
   
      t.commit();

      return stateToBeUpdate;
   
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }
}

const stateService=new StateService()
module.exports=stateService