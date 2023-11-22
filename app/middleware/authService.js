const jsonwebtoken = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");
const { log } = require("winston");
require("dotenv").config();
function checkJwtHS256(settingsConfig, req, res, next) {
  try {
    const logger = settingsConfig.logger;
    logger.info(`[AUTH_SERVICE] : Inside checkJWTHS256`);

    const secretKey = process.env.AUTH_CLIENT_SECRET;

    let token = req?.headers[process.env.AUTH_CLIENT_NAME]

    if (token==undefined) {
    
      token = req.cookies[process.env.AUTH_CLIENT_NAME]
    
    }
    
    return jsonwebtoken.verify(token, secretKey);
  } catch (error) {
    
    throw error;
  }
}


function isAdmin(settingsConfig, req, res, next) {
  try {
    const logger = settingsConfig.logger;
    logger.info(`[AUTH_SERVICE] : Inside IsAdmin`);
    const payload = checkJwtHS256(settingsConfig, req, res, next)
    if (payload.role != "Admin") {
      throw new Error("You are Not Admin")
    }
    next()
  } catch (error) {
    next(error)
  }
}
function isEmployee(settingsConfig, req, res, next) {
  try {
    const logger = settingsConfig.logger;
    logger.info(`[AUTH_SERVICE] : Inside IsEmployee`);
    const payload = checkJwtHS256(settingsConfig, req, res, next)
    if (payload.role != "Employee") {
      throw new Error("You are Not Employee")
    }
    next()
  } catch (error) {
    next(error)
  }
}
function isCustomer(settingsConfig, req, res, next) {
  try {
    const logger = settingsConfig.logger;
    logger.info(`[AUTH_SERVICE] : Inside IsCustomer`);
    const payload = checkJwtHS256(settingsConfig, req, res, next)
    if (payload.role != "Customer") {
      throw new Error("You are Not Customer")
    }
    next()
  } catch (error) {
    next(error)
  }
}
function isAgent(settingsConfig, req, res, next) {
  try {
    const logger = settingsConfig.logger;
    logger.info(`[AUTH_SERVICE] : Inside IsAgent`);
    const payload = checkJwtHS256(settingsConfig, req, res, next)
    if (payload.role != "Agent") {
      throw new Error("You are Not Agent")
    }
    next()
  } catch (error) {
    next(error)
  }
}
function tokencreation(payload) {
  const token = jsonwebtoken.sign(JSON.stringify(payload), process.env.AUTH_CLIENT_SECRET)
  return token

}
function tokencreation(payload) {
  const token = jsonwebtoken.sign(JSON.stringify(payload), process.env.AUTH_CLIENT_SECRET)
  return token

}
function tokencreation(payload) {
  const token = jsonwebtoken.sign(JSON.stringify(payload), process.env.AUTH_CLIENT_SECRET)
  return token

}

module.exports = {
  checkJwtHS256,
  isAdmin,
  isCustomer,
  isEmployee,
  isAgent,

  tokencreation
};




