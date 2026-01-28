import { Router } from "express";
import { chatRouter } from "./chat.router.js";
import { userRouter } from "./user.router.js";

export const apiRouter = Router();

// Router to handle user requests 
apiRouter.use(userRouter);

// Router to handle chat requests 
apiRouter.use(chatRouter);

