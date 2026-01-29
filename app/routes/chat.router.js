import { Router } from "express";
import { chatController } from "../controllers/chat.controller.js";
import { checkChat, checkFirstMessage } from "../middlewares/checkChat.js";
import { checkId } from "../middlewares/checkId.js";
import { authenticateToken } from "../middlewares/auth.js";

export const chatRouter = Router();

// Use middleware to check token and user
chatRouter.use(authenticateToken);

//  ROUTE TO GET ALL CHATS
chatRouter.get('/chats', chatController.getAll);

// ROUTE TO GET THE MESSAGES FROM A SPECIFIC CHAT
chatRouter.get('/chats/:id/messages', checkId, chatController.getChatById);

// ROUTE TO CREATE A NEW CHAT WITH A TITLE
chatRouter.post('/chats', checkFirstMessage, chatController.createChat);

// ROUTE TO ADD A MESSAGE IN AN EXISTING DISCUSSION
chatRouter.post('/chats/:id/messages', checkChat, chatController.addMessage);
