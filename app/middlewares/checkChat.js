import Joi from "joi"
import { chatSchema } from "../schemas/chat.schema.js";

export function checkChat(req, res, next) {

    try {

        // Checking the first message sent and the user id 
        Joi.attempt(req.body, chatSchema);
        next();

    } catch (error) {
        return res.status(400).json({ error: "Le premier message est trop court pour générer un titre. ❌"})
    }
}