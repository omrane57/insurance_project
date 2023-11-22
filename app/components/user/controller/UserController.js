const { validate } = require("uuid");
const employeeService=require("../../employee/service/EmployeeService")
const userService = require("../service/UserService");
const { HttpStatusCode } = require("axios");
const { v4 } = require('uuid');
const { validateUuid } = require("../../../utils/uuid");
const { checkJwtHS256 } = require("../../../middleware/authService");
class UserController {
    constructor() {
        this.newuserService = userService
        this.newemployeeService=employeeService
        // this.newagentService=agentService
        // this.newcustomerService=customerServices
    }
    async login(settingsConfig, req, res, next) {
        try {
            const logger = settingsConfig.logger;
            logger.info(`[login_CONTROLLER] : Inside login`);
            const { username, password, role } = req.body;
            const queryParams = req.query
         
            if (typeof username != "string" || typeof role != "string" || typeof password != "string") {
                throw new Error("Invalid input")
            }
            if (role == "employee") {
                const emp = await this.newemployeeService.getEmpByUsername(settingsConfig, username)
                if (emp.length == 0) {
                    throw new Error("invalid username")
                }
                const [token, employee] = await this.newuserService.loginForEmployee(settingsConfig, req.body, queryParams);
                res.set(process.env.AUTH_CLIENT_NAME, token)
                res.cookie(process.env.AUTH_CLIENT_NAME, token);
                return res.status(200).json(employee);
            }
            // if (role == "Customer") {
            //     const emp = await this.newemployeeService.getEmpByUsername(settingsConfig, username)
            //     if (emp.length == 0) {
            //         throw new Error("invalid username")
            //     }
            //     const [token, customer] = await this.newuserService.loginForCustomer(settingsConfig, req.body, queryParams);
            //     res.set(process.env.AUTH_CLIENT_NAME, token)
            //     res.cookie(process.env.AUTH_CLIENT_NAME, token);
            //     return res.status(200).json(customer);
            // }
            // if (role == "Agent") {
            //     const emp = await this.newemployeeService.getEmpByUsername(settingsConfig, username)
            //     if (emp.length == 0) {
            //         throw new Error("invalid username")
            //     }
            //     const [token, agent] = await this.newuserService.loginForAgent(settingsConfig, req.body, queryParams);
            //     res.set(process.env.AUTH_CLIENT_NAME, token)
            //     res.cookie(process.env.AUTH_CLIENT_NAME, token);
            //     return res.status(200).json(agent);
            // }
        } catch (error) {
            next(error);
        }
    }

    async logout(settingsConfig, req, res, next) {
        try {
            const logger = settingsConfig.logger;
            logger.info(`[login_CONTROLLER] : Inside logout`);

            res.cookie(process.env.AUTH_CLIENT_NAME, "", { expires: new Date(Date.now()) });
            res.status(HttpStatusCode.Ok).json("Logout sucessfully")
        } catch (error) {
            next(error)
        }
    }

    async resetPassword(settingsConfig, req, res, next) {
        try {
            const logger = settingsConfig.logger;
            logger.info(`[login_CONTROLLER] : Inside resetPassword`);

            const { oldPassword, newPassword,username } = req.body
            const payload = checkJwtHS256(settingsConfig, req, res, next)
     
            if (payload.role == "employee") {

                if (payload.username != username) {

                    throw new Error("invalid username")
                }
                const passwordReset = await this.newuserService.resetPasswordForEmployee(settingsConfig, payload.username, oldPassword, newPassword)
           
                if (passwordReset == 0) {
                    throw new Error("cannot update password")
                }
                res.status(HttpStatusCode.Ok).json("password reset sucessfully")
                return
            }
            // if (payload.role == "Agent") {

            //     if (payload.username != username) {

            //         throw new Error("invalid username")
            //     }
            //     const passwordReset = await this.newuserService.resetPasswordForAgent(settingsConfig, payload.username, oldPassword, newPassword)
            //     if (passwordReset == 0) {
            //         throw new Error("cannot update password")
            //     }
            //     res.status(HttpStatusCode.Ok).json("password reset sucessfully")
            //     return
            // }
            // if (payload.role == "Customer") {

            //     if (payload.username != username) {

            //         throw new Error("invalid username")
            //     }
            //     const passwordReset = await this.newuserService.resetPasswordForAgent(settingsConfig, payload.username, oldPassword, newPassword)
            //     if (passwordReset == 0) {
            //         throw new Error("cannot update password")
            //     }
            //     res.status(HttpStatusCode.Ok).json("password reset sucessfully")
            //     return
            // }

        } catch (error) {
            next(error)
        }
    }





}
module.exports = new UserController()