import Joi from "joi";

// Validation schema for the first message
export const firstMessageSchema = Joi.object({
    firstMessage: Joi.string().trim().min(2).required(),
    user_id: Joi.number().integer().positive().required()
})

// Validation schema to identify the chat id
export const checkChatId = Joi.object({
    chat_id: Joi.number().integer().positive().required()
})

// Validation schema for the messages 
export const checkMessagesSchema = Joi.object({
    userMessage: Joi.string().trim().min(1).required(),
})

