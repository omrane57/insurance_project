const planConfig = require("../../../model-config/planConfig");
const { startTransaction } = require("../../../sequelize/transaction");
const { preloadAssociations } = require('../../../sequelize/association')
const {
    parseFilterQueries,
    parseLimitAndOffset,
    parseSelectFields,
} = require("../../../utils/request");
const { v4 } = require("uuid");

const fs = require('fs/promises');
function generateUniqueFileName(originalFileName) {

    const timestamp = Date.now();
    const uniqueIdentifier = Math.random().toString(36).substring(7);
    const fileExtension = originalFileName.split('.').pop(); // Get the file extension
    return `${timestamp}-${uniqueIdentifier}.${fileExtension}`;
}
const uploadImage = async (file) => {


    try {
       
        if (file) {
          let dynamicDirectory;
          dynamicDirectory = 'D:/insurance_final_project/uploadimages/plan/planphoto';
          const uniqueFileName = generateUniqueFileName(file.image.name);
          
          await fs.mkdir(dynamicDirectory, { recursive: true });
          const finalFileLocation = `${dynamicDirectory}/${uniqueFileName}`;
          await fs.writeFile(finalFileLocation, file.image.data);
          if (file.image.mimetype != 'image/jpeg') {
          throw  new Error('Invalid file type. Only JPEG files are allowed.');
  
        } 
            const fileLocation = finalFileLocation; 
            const fileName = uniqueFileName; 
  
            return { "fileLocation": fileLocation, "fileName": fileName };
        } else {
            return { error: 'Image file is required.' };
        }
    } catch (error) {
        throw error;
    }
  };

class PlanService {
    constructor() { }
    async getPlanTypeByName(settingsConfig, planName) {
        const t = await startTransaction();
        try {
            const logger = settingsConfig.logger;
            logger.info(`[getInsuranceTypeByName] : Inside getInsuranceTypeByName`);

            const data = await planConfig.model.findAll({
                transaction: t,
                where: { planName: planName },
                paranoid: false
            });
            await t.commit();
            return data;
        } catch (error) {
            await t.rollback();
            throw error;
        }
    }
    //Get All Plans
    async getAllPlans(settingsConfig,queryParams) {
        const t = await startTransaction();
        try {
            const logger = settingsConfig.logger;
            logger.info(`[PlanService] : Inside getAllPlans`);

            const includeQuery = queryParams.include || []
            let associations = []
            const attributesToReturn = {
                id: planConfig.fieldMapping.id,
                policyTermMin: planConfig.fieldMapping.policyTermMin,
                policyTermMax: planConfig.fieldMapping.policyTermMax,
                minAge: planConfig.fieldMapping.minAge,
                maxAge: planConfig.fieldMapping.maxAge,
                minInvestmentAmount: planConfig.fieldMapping.minInvestmentAmount,
                maxInvestmentAmount: planConfig.fieldMapping.maxInvestmentAmount,
                profitRatio: planConfig.fieldMapping.profitRatio,
                commissionAmount: planConfig.fieldMapping.commissionAmount,
                status: planConfig.fieldMapping.status,
                insuranceTypeId: planConfig.fieldMapping.insuranceTypeId

            };
            let selectArray = parseSelectFields(queryParams, attributesToReturn);
            if (!selectArray) {
                selectArray = Object.values(attributesToReturn);
            }
            const { count, rows } = await planConfig.model.findAndCountAll({
                transaction: t,
                ...parseFilterQueries(queryParams, planConfig.filter),
                attributes: selectArray,
                ...parseLimitAndOffset(queryParams),
                ...preloadAssociations(associations)
            });
            await t.commit();
            return { count, rows };
        } catch (error) {
            await t.rollback();
            throw error;
        }
    }

    //Get Plans By Id
    async getAllPlansById(settingsConfig,planId, queryParams) {
        const t = await startTransaction();
        try {
            const logger = settingsConfig.logger;
            logger.info(`[PlanService] : Inside getAllPlans`);

            const includeQuery = queryParams.include || []
            let associations = []
            const attributesToReturn = {
                id: planConfig.fieldMapping.id,
                policyTermMin: planConfig.fieldMapping.policyTermMin,
                policyTermMax: planConfig.fieldMapping.policyTermMax,
                minAge: planConfig.fieldMapping.minAge,
                maxAge: planConfig.fieldMapping.maxAge,
                minInvestmentAmount: planConfig.fieldMapping.minInvestmentAmount,
                maxInvestmentAmount: planConfig.fieldMapping.maxInvestmentAmount,
                profitRatio: planConfig.fieldMapping.profitRatio,
                commissionAmount: planConfig.fieldMapping.commissionAmount,
                status: planConfig.fieldMapping.status,
                insuranceTypeId: planConfig.fieldMapping.insuranceTypeId,
                insuranceType: planConfig.fieldMapping.insuranceType,
                plaName: planConfig.fieldMapping.planName

         
            };
            let selectArray = parseSelectFields(queryParams, attributesToReturn);
            if (!selectArray) {
                selectArray = Object.values(attributesToReturn);
            }
            const { count, rows } = await planConfig.model.findAndCountAll({
                transaction: t,
                ...parseFilterQueries(queryParams, planConfig.filter, { id: planId}),
                attributes: selectArray,
                ...parseLimitAndOffset(queryParams),
                ...preloadAssociations(associations)
            });
            await t.commit();
            return { count, rows };
        } catch (error) {
            await t.rollback();
            throw error;
        }
    }

    //create plan
    async createPlan(settingsConfig, insuranceTypeId, body,file) {
        
        const t = await startTransaction();
        try {
            const logger = settingsConfig.logger;
            logger.info(`[PlanService] : Inside createPlan`);
            const fileResult = await uploadImage(file);
            body.id = v4()
            body.status = true
            body.insuranceTypeId = insuranceTypeId
            body.planImg=fileResult.fileLocation
           
            const data = await planConfig.model.create(body, { transaction: t })

            await t.commit();
            return data;
        } catch (error) {
            await t.rollback();
            throw error;
        }
    }

    //Update Plan
    async updatePlan(settingsConfig, planId, body) {
        const t = await startTransaction();
        try {
            const logger = settingsConfig.logger;
            logger.info(`[PlanService] : Inside updateplan`);

            let update = await planConfig.model.update(body, {
                where: {
                    id: planId,
                },
                transaction: t
            });
            await t.commit()
            return update;

        } catch (error) {
            await t.rollback();
            throw error;
        }
    }

    //Delete plan
    async deletePlan(settingsConfig, planId) {
        const t = await startTransaction();
        try {
            const logger = settingsConfig.logger;
            logger.info(`[PlanService] : Inside deleteplan`);

            let deleted = await planConfig.model.destroy({
                where: {
                    id: planId,
                },
                transaction: t
            });
            await t.commit()
            return deleted;

        } catch (error) {
            await t.rollback();
            throw error;
        }
    }

}

module.exports = PlanService