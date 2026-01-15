import { Router } from "express";
import { chatController } from "../controllers/chat.controller.js";
import { checkChat, checkFirstMessage } from "../middlewares/checkChat.js";



export const chatRouter = Router();

//  ROUTE TO GET ALL CHATS
chatRouter.get('/chats', chatController.getAll);

// ROUTE TO GET THE MESSAGES FROM A SPECIFIC CHAT
chatRouter.get('chats/:id', chatController.getChatById);

// ROUTE TO CREATE A NEW CHAT WITH A TITLE
chatRouter.post('/chats', checkFirstMessage, chatController.createChat);

// ROUTE TO CONTINUE AN EXISTING DISCUSSION
chatRouter.post('/chats/:chatId/messages', checkChat, chatController.addMessage);
