const { UUID } = require("sequelize");
const insuranceTypeConfig = require("../../../model-config/insuranceTypeConfig");
const { startTransaction } = require("../../../sequelize/transaction");
const { v4 } = require("uuid");
const fs = require('fs/promises');
const { parseLimitAndOffset, unmarshalBody, parseSelectFields, parseFilterQueries } = require('../../../utils/request');
function generateUniqueFileName(originalFileName) {

    const timestamp = Date.now();
    const uniqueIdentifier = Math.random().toString(36).substring(7);
    const fileExtension = originalFileName.split('.').pop(); // Get the file extension
    return `${timestamp}-${uniqueIdentifier}.${fileExtension}`;
}
const uploadImage = async (file) => {


    try {
        // Check if image file is included
        if (file) {
          let dynamicDirectory;
          dynamicDirectory = 'D:/insurance_final_project/uploadimages/insurance/insurancephoto';
          const uniqueFileName = generateUniqueFileName(file.image.name);
          await fs.mkdir(dynamicDirectory, { recursive: true });
          const finalFileLocation = `${dynamicDirectory}/${uniqueFileName}`;
          await fs.writeFile(finalFileLocation, file.image.data);
          if (file.image.mimetype != 'image/jpeg') {
          throw  new Error('Invalid file type. Only JPEG files are allowed.');
  
        } 
            // Access the file location and name
            const fileLocation = finalFileLocation; // File path
            const fileName = uniqueFileName; // File name
  
            return { "fileLocation": fileLocation, "fileName": fileName };
        } else {
            return { error: 'Image file is required.' };
        }
    } catch (error) {
        throw error;
    }
  };
class InsuranceTypeService {
    constructor() { }

    //Get Insuranse By Name
    async getInsuranceTypeByName(settingsConfig, insuranceName) {
        const t = await startTransaction();
        try {
            const logger = settingsConfig.logger;
            logger.info(`[getInsuranceTypeByName] : Inside getInsuranceTypeByName`);

            const data = await insuranceTypeConfig.model.findAll({
                transaction: t,
                where: { insuranceName: insuranceName },
                paranoid: false
            });
            await t.commit();
            return data;
        } catch (error) {
            await t.rollback();
            throw error;
        }
    }

    //Get All Insurance
    async getAllInsuranceType(settingsConfig,queryParams) {
        const t = await startTransaction();
        try {
            const data = await insuranceTypeConfig.model.findAndCountAll({ transaction: t, ...parseFilterQueries(queryParams, insuranceTypeConfig.filter),...parseLimitAndOffset(queryParams) })
            await t.commit();
            return data;
        }
        catch (error) {
            await t.rollback();
            throw error;
        }

    }

    //Get InsuranceType By Id
    async getAllInsuranceTypeById(settingsConfig, insuranceTypeId) {
        const t = await startTransaction();
        try {
          const logger = settingsConfig.logger;
          logger.info(`[inSuranceService] : Inside getinSuranceByUsername`);
          const data = await insuranceTypeConfig.model.findOne({
            where: { id: insuranceTypeId },
            paranoid:false,
            transaction: t,
          });
          return data
          await t.commit();
          return data;
        } catch (error) {
          await t.rollback();
          throw error;
        }

    }

    //Create InsuranceType
    async createInsuranceType(settingsConfig, body,file) {
        const t = await startTransaction();
        const logger = settingsConfig.logger;
        logger.info(`[inSuranceService] : Inside createInsuranceType`);
        try {

            
            body.id = v4()
            body.status = true
            const fileResult = await uploadImage(file);
            body.insuranceImg=fileResult.fileLocation
            const data = await insuranceTypeConfig.model.create(body, { transaction: t });
            await t.commit();
            return data;
        }
        catch (error) {
            await t.rollback();
            throw error;
        }
    }

    //Update InsuranceType
    async updateInsuranceType(settingsConfig, insuranceTypeId, body) {
        const t = await startTransaction();
        try {
            const logger = settingsConfig.logger;
            logger.info(`[InsuranceType] : Inside UpdateInsuranceType`);
            let a = await insuranceTypeConfig.model.update(body, {
                where: { id: insuranceTypeId },
                transaction: t,
            });
            console.log(a);
            t.commit();

            return a;

        } catch (error) {
            await t.rollback();
            throw error;
        }
    }

    //Delete InsuranceType
    async deleteInsuranceType(settingsConfig, insuranceTypeId) {
        const t = await startTransaction();
        try {
            const logger = settingsConfig.logger;
            logger.info(`[InsuranceType] : Inside deleteInsuranceType`);

            let deleted = await insuranceTypeConfig.model.destroy({
                where: { id: insuranceTypeId },
                transaction: t,
            });
            await t.commit();
            return deleted;
        } catch (error) {
            await t.rollback();
            throw error;
        }
    }


}

module.exports = InsuranceTypeService