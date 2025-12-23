import Joi from "joi";

// Validation schema for identifier 
export const identifierSchema = Joi.object({
    identifier: Joi.string().trim().min(3).max(50).required(), // Identifier must be a string with at least 3 characters and max 50 characters
});