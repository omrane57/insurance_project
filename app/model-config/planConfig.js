const { validateUuid } = require('../utils/uuid')
const db = require("../../models")
const { validateStringLength } = require('../utils/string')
const { Op, Sequelize } = require("sequelize")

class PlanConfig {
    constructor() {
        this.fieldMapping = Object.freeze({
            id: "id",
            policyTermMin: "policyTermMin",
            policyTermMax: "policyTermMax",
            minAge: "minAge",
            maxAge: "maxAge",
            minInvestmentAmount: "minInvestmentAmount",
            maxInvestmentAmount: "maxInvestmentAmount",
            profitRatio: "profitRatio",
            commissionAmount: "commissionAmount",
            status: "status",
            insuranceTypeId: "insuranceTypeId"


        })
        //   this.association=Object.freeze({
        //     accountFilter:'accountFilter',
        // })    
        this.model = db.plan
        this.modelName = db.plan.name
        this.tableName = db.plan.tableName

        // this.columnMapping = Object.freeze({
        //     id: this.model.rawAttributes[this.fieldMapping.id].field,
        //     insuranceName: this.model.rawAttributes[this.fieldMapping.insuranceName].field,
        //     status: this.model.rawAttributes[this.fieldMapping.status].field,

        // })


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
const planConfig = new PlanConfig()
module.exports = planConfig