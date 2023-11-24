const { validateUuid } = require("../utils/uuid");

const db = require("../../models");
const { validateStringLength } = require("../utils/string");
const { Op } = require("sequelize");

class AgentConfig {
  constructor() {
    this.fieldMapping = Object.freeze({
      id: "id",
      agentName: "agentName",
      role: "role",
      username: "username",
      password: "password",
      email: "email",
      agentAddress: "agentAddress",
      qualification: "qualification",
      status: "status",
      employeeId: "employeeId",
    });
    //   this.association=Object.freeze({
    //     accountFilter:'accountFilter',
    // })
    this.model = db.agent;
    this.modelName = db.agent.name;
    this.tableName = db.agent.tableName;
    this.filter = Object.freeze({
      id: (id) => {
        validateUuid(id);
        return {
          [this.fieldMapping.id]: {
            [Op.eq]: id,
          },
        };
      },
      employeeId: (employeeId) => {
        validateUuid(employeeId);
        return {
          [this.fieldMapping.employeeId]: {
            [Op.eq]: employeeId,
          },
        };
      },
      agentName: (agentName) => {
        return {
          [this.fieldMapping.agentName]: {
            [Op.like]: `%${agentName}%`,
          },
        };
      },
      agentAddress: (agentAddress) => {
        return {
          [this.fieldMapping.agentAddress]: {
            [Op.like]: `%${agentAddress}%`,
          },
        };
      },
      qualification: (qualification) => {
        return {
          [this.fieldMapping.qualification]: {
            [Op.like]: `%${qualification}%`,
          },
        };
      },
      status: (status) => {
        return {
          [this.fieldMapping.status]: {
            [Op.eq]: status,
          },
        };
      },
      email: (email) => {
        return {
          [this.fieldMapping.email]: {
            [Op.like]: `%${email}`,
          },
        };
      },
      username: (username) => {
        return {
          [this.fieldMapping.username]: {
            [Op.like]: `%${username}%`,
          },
        };
      },
      password: (password) => {
        return {
          [this.fieldMapping.password]: {
            [Op.like]: `%${password}%`,
          },
        };
      },
      role: (role) => {
        return {
          [this.fieldMapping.role]: {
            [Op.like]:`${role}`,
          },
        };
      },
    });
  }
}
const agentConfig = new AgentConfig();
module.exports = agentConfig;
