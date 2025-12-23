import { Router } from "express";
import { chatController } from "../controllers/chat.controller.js";
import { checkIdentifier } from "../middlewares/checkIdentifier.js";
import { userController } from "../controllers/user.controller.js";

export const apiRouter = Router();

// Route to get all the chats
apiRouter.get('/chats', chatController.getAll);

// Route to identify the user 
apiRouter.get('/user/:identifier', checkIdentifier, userController.getOrCreate)
