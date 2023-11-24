const { validateUuid } = require('../utils/uuid')
const db = require("../../models")
const { validateStringLength } = require('../utils/string')
const { Op, Sequelize } = require("sequelize")

class PaymentDetailConfig {
    constructor() {
        this.fieldMapping = Object.freeze({
            id: "id",
            installationDate: "installationDate",
            installationAmount: "installationAmount",
            paymentDate: "paymentDate",
            paymentStatus: "paymentStatus",
            paymentMethod: "paymentMethod",
            agentId: "agentId",
            policyId: "policyId"
        })
        //   this.association=Object.freeze({
        //     accountFilter:'accountFilter',
        // })    
        this.model = db.paymentdetail
        this.modelName = db.paymentdetail.name
        this.tableName = db.paymentdetail.tableName



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
const paymentDetailConfig = new PaymentDetailConfig()
module.exports = paymentDetailConfig