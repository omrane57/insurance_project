const { validateUuid } = require("../utils/uuid");

const db = require("../../models");
const { validateStringLength } = require("../utils/string");
const { Op } = require("sequelize");

class PolicyConfig {
  constructor() {
    this.fieldMapping = Object.freeze({
      id: "id",
      insuranceType: "insuranceType",
      planName: "planName",
      dateCreated: "dateCreated",
      maturityDate: "maturityDate",
      primimumType: "primimumType",
      totalPremimumAmount: "totalPremimumAmount",
      profitRatio: "profitRatio",
      sumAssured: "sumAssured",
      requestStatus: "requestStatus",
      customer_id: "customer_id",
      agent_id: "agent_id",
      plan_id: "plan_id",
      aadharMetadata: "aadharMetadata",
      panMetadata: "panMetadata",
    });

    this.model = db.policy;
    this.modelName = db.policy.name;
    this.tableName = db.policy.tableName;
    this.filter = Object.freeze({
      id: (id) => {
        validateUuid(id);
        return {
          [this.fieldMapping.id]: {
            [Op.eq]: id,
          },
        };
      },
    });
  }
}
const policyConfig = new PolicyConfig();
module.exports = policyConfig;
