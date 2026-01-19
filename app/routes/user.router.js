import { Router } from "express";
import { checkIdentifier } from "../middlewares/checkIdentifier.js"
import { userController } from "../controllers/user.controller.js";

// Create the router
export const userRouter = Router();

// Route to register user 
userRouter.post('/signup', userController.registerUser );

// Route to log a user 
userRouter.post('/login', userController.logUser);
