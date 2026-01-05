import { Router } from "express";
import { checkIdentifier } from "../middlewares/checkIdentifier.js"
import { userController } from "../controllers/user.controller.js";

export const userRouter = Router();

// Route to identify the user 
userRouter.get('/user/:identifier', checkIdentifier, userController.getOrCreate)