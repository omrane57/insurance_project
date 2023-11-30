const { validateUuid } = require("../utils/uuid");

const db = require("../../models");
const { validateStringLength } = require("../utils/string");
const { Op } = require("sequelize");

class CustomerConfig {
  constructor() {
    this.fieldMapping = Object.freeze({
      id: "id",
      customerName: "customerName",
      role: "role",
      username: "username",
      password: "password",
      email: "email",
      dob: "dob",
      state: "state",
      city: "city",
      pincode: "pincode",
      mobileno: "mobileno",
      nominee: "nominee",
      nomineeRelation: "nomineeRelation",
      address:'address',
      agentId: "agentId",
      img:"customerImgUrl"
    });
    //   this.association=Object.freeze({
    //     accountFilter:'accountFilter',
    // })
    this.model = db.customerdetail;
    this.modelName = db.customerdetail.name;
    this.tableName = db.customerdetail.tableName;
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
        return {
          [this.fieldMapping.customerName]: {
            [Op.like]: `%${customerName}%`,
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
            [Op.like]: `${role}`,
          },
        };
      },
      dob: (dob) => {
        return {
          [this.fieldMapping.dob]: {
            [Op.like]: `${dob}`,
          },
        };
      },
      state: (state) => {
        return {
          [this.fieldMapping.state]: {
            [Op.like]: `${state}`,
          },
        };
      },
      city: (city) => {
        return {
          [this.fieldMapping.city]: {
            [Op.like]: `${city}`,
          },
        };
      },
      pincode: (pincode) => {
        return {
          [this.fieldMapping.pincode]: {
            [Op.like]: `${pincode}`,
          },
        };
      },
      mobileno: (mobileno) => {
        validateStringLength(mobileno, "Phone Number", 10, 10);
        return {
          [this.fieldMapping.mobileno]: {
            [Op.like]: `${mobileno}`,
          },
        };
      },
      nominee: (nominee) => {
        return {
          [this.fieldMapping.nominee]: {
            [Op.like]: `${nominee}`,
          },
        };
      },
      nomineeRelation: (nomineeRelation) => {
        return {
          [this.fieldMapping.nomineeRelation]: {
            [Op.like]: `${nomineeRelation}`,
          },
        };
      },
      age: (age) => {
        return {
          [this.fieldMapping.age]: {
            [Op.eq]: age,
          },
        };
      },
      agentId: (agentId) => {
        validateUuid(agentId);

        return {
          [this.fieldMapping.agentId]: {
            [Op.eq]: agentId,
          },
        };
      },
    });
  }
}
const customerConfig = new CustomerConfig();
module.exports = customerConfig;
