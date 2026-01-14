import Joi from "joi"
import { chatSchema } from "../schemas/chat.schema.js";

// Middleware to check the first message of chat
export function checkFirstMessage(req, res, next) {

    try {

        // Checking the first message sent and the user id 
        Joi.attempt(req.body, chatSchema);
        next();

    } catch (error) {
        return res.status(400).json({ error: "Le premier message est trop court pour générer un titre. ❌"})
    }
};

// Middleware to check the chat messages
export function checkChat(req, res, next) {

    try {
        Joi.attempt()
    } catch (error) {
        
    }
}