const planConfig = require("../../../model-config/planConfig");
const { startTransaction } = require("../../../sequelize/transaction");
const { preloadAssociations } = require('../../../sequelize/association')
const {
    parseFilterQueries,
    parseLimitAndOffset,
    parseSelectFields,
} = require("../../../utils/request");
const { v4 } = require("uuid");



class PlanService {
    constructor() { }

    //Get All Plans
    async getAllPlans(settingsConfig, insuranceTypeId, queryParams) {
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
                ...parseFilterQueries(queryParams, planConfig.filter, { insurance_type_id: insuranceTypeId }),
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
    async getAllPlansById(settingsConfig, insuranceTypeId, planId, queryParams) {
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
                ...parseFilterQueries(queryParams, planConfig.filter, { id: planId, insurance_type_id: insuranceTypeId }),
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
    async createPlan(settingsConfig, insuranceTypeId, body) {
        const t = await startTransaction();
        try {
            const logger = settingsConfig.logger;
            logger.info(`[PlanService] : Inside createPlan`);

            body.id = v4()
            body.status = true
            body.insuranceTypeId = insuranceTypeId
            console.log(body)
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