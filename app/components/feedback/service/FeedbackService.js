const { v4 } = require("uuid");
const feedbackConfig = require("../../../model-config/feedbackConfig");
const { startTransaction } = require("../../../sequelize/transaction");

class FeedbackService {
    constructor() { }

    async getAllFeedback(settingsConfig) {
        const t = await startTransaction();
        try {
            const data = await feedbackConfig.model.findAndCountAll({ transaction: t })
            await t.commit();
            return data;
        }
        catch (error) {
            await t.rollback();
            throw error;
        }

    }

    async createFeedback(settingsConfig, body) {
        const t = await startTransaction();
        try {
            body.id = v4()
            
            const data = await feedbackConfig.model.create(body, { transaction: t });
            await t.commit();
            return data;
        }
        catch (error) {
            await t.rollback();
            throw error;
        }
    }
    async getFeedBackById(settingsConfig,feedBackId,queryParams){
        const t= await startTransaction() 
        try {
           
            // const attributeToReturn=Object.values(selectArray)
    
         
        const logger = settingsConfig.logger;
        logger.info(`[FeedBack_SERVICE] : Inside getFeedBackById`);
        const data = await feedbackConfig.model.findOne({
            where: { id: feedBackId},
            transaction: t,
            
          });
    if(data==null)
        {
    throw new Error("FeedBack Does Not Exists With Given Id")
    
    }       
        t.commit()
        return data
        } catch (error) {
            t.rollback()
            throw error
        }
    }
    
  async updateFeedback(settingsConfig, feedBackId, body) {
    const t = await startTransaction();
    try {
      const logger = settingsConfig.logger;
      logger.info(`[feedbackService] : Inside updatePolicy`);
      let feedbackToBeUpdate = await feedbackConfig.model.update(body, {
        where: { id: feedBackId },
        transaction: t,
      });

      t.commit();

      return feedbackToBeUpdate;
    } catch (error) {
    //   await t.rollback();
      throw error;
    }
  }
    
    
}

module.exports = FeedbackService