import { Router } from "express";
import { chatController } from "../controllers/chat.controller.js";

export const apiRouter = Router();

// Route to get all the chats
apiRouter.get('/chats', chatController.getAll);

// Route to identify the user 
apiRouter.get('/user/:id, userController.getOrCreate')
