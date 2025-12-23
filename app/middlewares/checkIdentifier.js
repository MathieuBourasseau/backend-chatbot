import Joi from "joi"
import { identifierSchema } from "../schemas/identifier.schema.js"

export function checkIdentifier (req, res, next) {

    try {

        //Checking that identifier is good with the schema define with Joi
        Joi.attempt(req.params, identifierSchema);
        next();

    } catch (error) {
        return res.status(400).json({ error: "L'identifiant n'est pas bon. ❌"})
    }
}