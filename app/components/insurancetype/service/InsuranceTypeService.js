const { UUID } = require("sequelize");
const insuranceTypeConfig = require("../../../model-config/insuranceTypeConfig");
const { startTransaction } = require("../../../sequelize/transaction");
const { v4 } = require("uuid");
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
    async getAllInsuranceType(settingsConfig) {
        const t = await startTransaction();
        try {
            const data = await insuranceTypeConfig.model.findAndCountAll({ transaction: t })
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
            const data = await insuranceTypeConfig.model.findAndCountAll({ transaction: t, id: insuranceTypeId })
            await t.commit();
            return data;
        }
        catch (error) {
            await t.rollback();
            throw error;
        }

    }

    //Create InsuranceType
    async createInsuranceType(settingsConfig, body) {
        const t = await startTransaction();
        try {
            body.id = v4()
            body.status = true
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