const FeedbackService = require("../service/FeedbackService");
const { HttpStatusCode } = require("axios");
class FeedBackController {
    constructor() {
        this.feedbackservice = new FeedbackService()
    }

    async getAllFeedback(settingsConfig, req, res, next) {
        try {
            const logger = settingsConfig.logger;
            logger.info(`[Feedback_CONTROLLER] : Inside getAllFeedback`);
            const data = await this.feedbackservice.getAllFeedback(settingsConfig)
            // res.set('X-Total-Count', count)
            res.status(HttpStatusCode.Ok).json(data)
        }
        catch (error) {
            next(error)
        }
    }

    async createFeedback(settingsConfig, req, res, next) {
        try {
            const logger = settingsConfig.logger;
            logger.info(`[FeedbackController] : Inside createFeedback`);
            const newFeedback = await this.feedbackservice.createFeedback(settingsConfig, req.body)
            res.status(HttpStatusCode.Created).json(newFeedback)
            return
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new FeedBackController()