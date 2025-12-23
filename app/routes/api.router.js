import { Router } from "express";
import { chatController } from "../controllers/chat.controller.js";

export const ApiRouter = Router();

// Route to get all the chats
ApiRouter.get('/api/chats', chatController.getAll);
