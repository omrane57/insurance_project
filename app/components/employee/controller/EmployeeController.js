const { validate } = require("uuid");
const nodemailer = require('nodemailer')
const employeeService = require("../service/EmployeeService");
const { HttpStatusCode } = require("axios");
const { v4 } = require('uuid');
const { validateUuid } = require("../../../utils/uuid");
const { checkJwtHS256 } = require("../../../middleware/authService");
class EmployeeController {
    constructor() {
        this.newEmployeeService = employeeService
    }
    async createEmployee(settingsConfig, req, res, next) {
        try {
            const logger = settingsConfig.logger;
            logger.info(`[EMPLOYEE_CONTROLLER] : Inside createEmployee`);
            const { employeeName, role, username, password, email } = req.body
            if (typeof employeeName != "string" || typeof role != "string" || typeof username != "string" || typeof password != "string" || typeof email != "string") {
                throw new Error("invalid input")
            }
            const user = await this.newEmployeeService.getEmpByUsername(settingsConfig, username)
            if (user.length != 0) {
                throw new Error("username Already Taken")
            }
            const data = await this.newEmployeeService.createEmployee(settingsConfig, req.body)
            res.status(HttpStatusCode.Ok).json(await data)
        } catch (error) {
            next(error)
        }
    }
    async createAdmin(settingsConfig, req, res, next) {
        try {
            const logger = settingsConfig.logger;
            logger.info(`[EMPLOYEE_CONTROLLER] : Inside createAdmin`);
            const { employeeName, role, username, password, email } = req.body
            if (typeof employeeName != "string" || typeof role != "string" || typeof username != "string" || typeof password != "string" || typeof email != "string") {
                throw new Error("invalid input")
            }
            const user = await this.newEmployeeService.getEmpByUsername(settingsConfig, username)
            if (user.length != 0) {
                throw new Error("username Already Taken")
            }
            const data = await this.newEmployeeService.createAdmin(settingsConfig, req.body)
            res.status(HttpStatusCode.Ok).json(await data)
        } catch (error) {
            next(error)
        }
    }

 

    async deleteEmployee(settingsConfig, req, res, next) {
        try {
            const logger = settingsConfig.logger;
            logger.info(`[EMPLOYEE_CONTROLLER] : Inside deleteEmployee`);
            const { empId } = req.params

            await this.newEmployeeService.deleteEmployee(settingsConfig, empId, req.query)
            res.set('X-Total-Count', 0)
            res.status(HttpStatusCode.Ok).json("Employee Deleted Successfully")
        } catch (error) {
            next(error)
        }
    }
    async getAllEmployee(settingsConfig, req, res, next) {
        try {
            const logger = settingsConfig.logger;
            const queryParams = req.query
            logger.info(`[EMPLOYEE_CONTROLLER] : Inside getAllEmployee`);
            const { rows, count } = await this.newEmployeeService.getAllEmpoyee(settingsConfig, queryParams)
            res.set('X-Total-Count', count)
            res.status(HttpStatusCode.Ok).json(await rows)
        } catch (error) {
            next(error)
        }
    }

    async getEmp(settingsConfig, req, res, next) {
        try {
            const logger = settingsConfig.logger;
            logger.info(`[EMPLOYEE_CONTROLLER] : Inside getEmp`);
            const { empId } = req.params

            const data = await this.newEmployeeService.getEmployee(settingsConfig, empId, req.params)
            res.set('X-Total-Count', 1)
            res.status(HttpStatusCode.Ok).json(await data)
        } catch (error) {
            next(error)
        }
    }
    async updateEmployee(settingsConfig, req, res, next) {
        try {
            const logger = settingsConfig.logger;
            logger.info(`[EMPLOYEE_CONTROLLER] : Inside updateEmployee`);

            const { empId } = req.params

            const emp = await this.newEmployeeService.getEmployee(settingsConfig, empId, req.query)
            if (emp.length == 0) {
                throw new Error("Emp Not Found!")
            }

            const [empToBeUpdated] = await this.newEmployeeService.updateEmployee(settingsConfig, empId, req.body)

            if (empToBeUpdated == 0) {
                throw new Error("Could Not Update user")
            }
            res.status(HttpStatusCode.Ok).json("employee updated sucessfully")
            return
        } catch (error) {
            next(error)
        }
    }

}
module.exports = new EmployeeController()