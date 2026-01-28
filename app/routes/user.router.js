import { Router } from "express";
import { userController } from "../controllers/user.controller.js";
import multerConfig from "../middlewares/multer-config.js";


// Create the router
export const userRouter = Router();

// Route to register user 
userRouter.post('/signup', multerConfig, userController.registerUser);

// Route to log a user 
userRouter.post('/login', userController.logUser);

// Route to check user token
userRouter.get('/me', userController.checkToken)

// Route to send an email to change password
userRouter.post('/forgot-password', userController.forgotPassword);

// Route to reset the password
userRouter.post('/reset-password/:token', userController.resetPassword);