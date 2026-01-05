import { Router } from "express";
import { chatController } from "../controllers/chat.controller.js";

export const chatRouter = Router();

// Route to get all the chats
chatRouter.get('/chats', chatController.getAll);
