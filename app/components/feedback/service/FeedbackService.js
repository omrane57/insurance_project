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
            body.contactDate = new Date()
            body.customerId = "16435211-3424-4819-b7c7-0604b3459719"
            const data = await feedbackConfig.model.create(body, { transaction: t });
            await t.commit();
            return data;
        }
        catch (error) {
            await t.rollback();
            throw error;
        }
    }
}

module.exports = FeedbackService