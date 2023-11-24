const taxConfig = require("../../../model-config/taxConfig");
const {startTransaction}=require("../../../sequelize/transaction")
const bcrypt = require('bcrypt');
const { parseLimitAndOffset, unmarshalBody, parseSelectFields, parseFilterQueries }=require('../../../utils/request');
const { tokencreation } = require("../../../middleware/authService");
const {preloadAssociations}=require('../../../sequelize/association');
const { v4 } = require("uuid");
class StateService{
    constructor(){

    }
   
      async createTax(settingsConfig, body) {
        const t = await startTransaction();
        try {
          const logger = settingsConfig.logger;
          logger.info(`[TaxService] : Inside createTax`);
          body.id = v4();
         
          
          const data = await taxConfig.model.create(body, { transaction: t });
          await t.commit();
          return data;
        } catch (error) {
          
          await t.rollback();
          throw error;
        }
      } 
    async deleteTax(settingsConfig,taxId,queryParams){
        const t= await startTransaction() 
        try {
        const logger = settingsConfig.logger;
        logger.info(`[TaxService] : Inside deleteState`);
     
   const data= await taxConfig.model.destroy({where:{id:taxId}})
        t.commit()
        return data
        } catch (error) {
            t.rollback()
            throw error
        }
    }

    async getAllTax(settingsConfig,queryParams){
        const t= await startTransaction() 
        try {
            const selectArray={
              id:taxConfig.fieldMapping.id,
              taxPercentage:taxConfig.fieldMapping.taxPercentage   
            }
            const attributeToReturn=Object.values(selectArray)
            const includeQuery = queryParams.include || [];
        const logger = settingsConfig.logger;
        logger.info(`[TaxService] : Inside getAllTax`);
        const data=await taxConfig.model.findAndCountAll({ transaction: t,
            ...parseFilterQueries(queryParams, taxConfig.filter),
            attributes: attributeToReturn,
            ...parseLimitAndOffset(queryParams) 
        })
       if(data==null)
{
   throw new Error("tax Does Not Exists")
}       
        t.commit()
        return data
        } catch (error) {
            t.rollback()
            throw error
        }
    }
    async getTax(settingsConfig,taxId,queryParams){
        const t= await startTransaction() 
        try {
            const attributeToReturn={
              id:taxConfig.fieldMapping.id,
              taxPercentage:taxConfig.fieldMapping.taxPercentage,
          
                
            }
         
            // const attributeToReturn=Object.values(selectArray)
            let selectArray = parseSelectFields(queryParams, attributeToReturn);

            if (!selectArray) {
              selectArray = Object.values(attributeToReturn);
            }
        const logger = settingsConfig.logger;
        logger.info(`[TaxService] : Inside getTax`);
        const data = await taxConfig.model.findOne({
            where: { id: taxId },
            attributes: selectArray,
            transaction: t,
            
          });
if(data==null)
        {
   throw new Error("tax Does Not Exists With Given Id")

}       
        t.commit()
        return data
        } catch (error) {
            t.rollback()
            throw error
        }
    }

async updateTax(settingsConfig, stateId, body) {
    const t = await startTransaction();
    try {
      const logger = settingsConfig.logger;
      logger.info(`[TaxService] : Inside updateState`);
      let stateToBeUpdate = await taxConfig.model.update(body, {
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