const { validateUuid } = require("../utils/uuid");

const db = require("../../models");
const { validateStringLength } = require("../utils/string");
const { Op } = require("sequelize");

class AgentCustomerDetailsConfig {
  constructor() {
    this.fieldMapping = Object.freeze({
      id: "id",
      customerName: "customerName",
      insuranceScheme: "insuranceScheme",
      commissionAmount: "commissionAmount",
      date: "date",
      agentId: "agentId",
      date: "date",
      withdrawStatus: "withdrawStatus",
    });
    //   this.association=Object.freeze({
    //     accountFilter:'accountFilter',
    // })
    this.model = db.agentscustomeraccountdetail;
    this.modelName = db.agentscustomeraccountdetail.name;
    this.tableName = db.agentscustomeraccountdetail.tableName;
    this.filter = Object.freeze({
      id: (id) => {
        validateUuid(id);
        return {
          [this.fieldMapping.id]: {
            [Op.eq]: id,
          },
        };
      },
      customerName: (customerName) => {
        validateUuid(customerName);
        return {
          [this.fieldMapping.customerName]: {
            [Op.like]: `%${customerName}%`,
          },
        };
      },
      insuranceScheme: (insuranceScheme) => {
        return {
          [this.fieldMapping.insuranceScheme]: {
            [Op.like]: `%${insuranceScheme}%`,
          },
        };
      },
      date: (date) => {
        return {
          [this.fieldMapping.date]: {
            [Op.like]: `%${date}%`,
          },
        };
      },
      agentId: (agentId) => {
        return {
          [this.fieldMapping.agentId]: {
            [Op.eq]: agentId,
          },
        };
      },
      withdrawStatus: (withdrawStatus) => {
        return {
          [this.fieldMapping.withdrawStatus]: {
            [Op.eq]: withdrawStatus,
          },
        };
      },
    });
  }
}
const agentCustomerDetailsConfig = new AgentCustomerDetailsConfig();
module.exports = agentCustomerDetailsConfig;
