const { validateUuid } = require('../utils/uuid')
const db = require("../../models")
const { validateStringLength } = require('../utils/string')
const { Op, Sequelize } = require("sequelize")

class InsuranceTypeConfig {
    constructor() {
        this.fieldMapping = Object.freeze({
            id: "id",
            insuranceName: "insuranceName",
            status: "status"
        })
        //   this.association=Object.freeze({
        //     accountFilter:'accountFilter',
        // })    
        this.model = db.insurancetype
        this.modelName = db.insurancetype.name
        this.tableName = db.insurancetype.tableName

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
const insuranceTypeConfig = new InsuranceTypeConfig()
module.exports = insuranceTypeConfig