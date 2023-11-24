const { validateUuid } = require('../utils/uuid')
const db = require("../../models")
const { validateStringLength } = require('../utils/string')
const { Op, Sequelize } = require("sequelize")

class FeedbackConfig {
    constructor() {
        this.fieldMapping = Object.freeze({
            id: "id",
            customerName: "customerName",
            title: "title",
            message: "message",
            contactDate: "contactDate",
            reply: "reply",
            customerId: "customerId",
            policyId: "policyId"
        })

        this.model = db.feedback
        this.modelName = db.feedback.name
        this.tableName = db.feedback.tableName



        this.filter = Object.freeze({
            id: (id) => {

                validateUuid(id)
                return {
                    [this.fieldMapping.id]: {
                        [Op.eq]: id,
                    },
                };
            },
        })
    }
}
const feedbackConfig = new FeedbackConfig()
module.exports = feedbackConfig