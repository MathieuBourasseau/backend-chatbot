import { User } from "./User.model.js";
import { Chat } from "./Chat.model.js";
import { Message } from "./Message.model.js";

// Define relationships between the models : 

// Relation between User and Chat 
User.hasMany(Chat, {
    foreignKey: "user_id",
    as: "chats"
});

Chat.belongsTo(User, {
    foreignKey: "user_id",
    as: "user"
});

// Relation between Chat and Message
Chat.hasMany(Message, {
    foreignKey: "chat_id",
    as: "messages"
});

Message.belongsTo(Chat, {
    foreignKey: "chat_id",
    as: "chat"
})

export { User, Chat, Message };