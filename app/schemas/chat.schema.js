import Joi from "joi";

// Validation schema for the first message
export const firstMessageSchema = Joi.object({
    firstMessage: Joi.string().trim().min(2).required(),
    user_id: Joi.number().integer().positive().required()
})

// Validation schema for the messages 
export const checkMessagesSchema = Joi.object({
    newUserMessage: Joi.string().trim().min(1).required(),
})

// Validation of the ID in the URL 
export const checkIdSchema = Joi.object({
    id: Joi.number().integer().positive().required(),
})
