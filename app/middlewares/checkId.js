import Joi from "joi";
import { checkIdSchema } from "../schemas/chat.schema.js";

export function checkId (req, res, next) {
    
    try {
        Joi.attempt(req.params, checkIdSchema);
        next();

    } catch (error) {
        return res.status(400).json({ error: "l'ID est invalide."})
    }
}