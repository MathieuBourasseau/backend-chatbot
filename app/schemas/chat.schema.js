import Joi from "joi";

// Validation schema for chat
export const chatSchema = Joi.object({
    firstMessage: Joi.string().trim().min(2).required(),
    user_id: Joi.number().integer().positive().required()
})