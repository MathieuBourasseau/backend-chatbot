import { Router } from "express";
import { userController } from "../controllers/user.controller.js";
import multerConfig from "../middlewares/multer-config.js";


// Create the router
export const userRouter = Router();

// Route to register user 
userRouter.post('/signup', multerConfig, userController.registerUser);

// Route to log a user 
userRouter.post('/login', userController.logUser);
