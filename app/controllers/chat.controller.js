import { Chat, Message } from "../models/index.models.js"
import 'dotenv/config'
import { checkMessagesSchema } from "../schemas/chat.schema.js";

export const chatController = {

    // --- METHOD TO GET ALL THE CHATS ---
    getAll: async (req, res) => {

        try {
            const chats = await Chat.findAll();
            res.json(chats)
        } catch (error) {
            res.status(500).json({ error: "Erreur lors de la récupération des discussions." })
        }
    },

    // --- METHOD TO GET A CHAT BY ITS ID --- 
    getChatById: async (req, res) => {

        try {

            // Get the ID from the URL
            const { id } = req.params;

            // Check in the database if this chat exists
            const chat = await Chat.findByPk(id);
            if (!chat) {
                return res.status(404).json({ error: "Ce chat n'existe pas." });
            }

            // Get all the messages from this chat 
            const allMessages = await Message.findAll({
                where: { chat_id: id },
                order: [['createdAt', 'ASC']],
            })

            return res.status(200).json(allMessages);

        } catch (error) {
            console.error("Erreur lors de la recherche du chat.", error);
            return res.status(500).json({ error: "Une erreur est survenue pour trouver ce chat." });
        }
    },

    // --- METHOD TO CREATE A NEW CHAT ---
    createChat: async (req, res) => {

        try {

            const { firstMessage, user_id } = req.body; // Catch first message and user id from the body request

            // FETCH TO MISTRAL TO GENERATE A TITLE AND A CHAT ID

            const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
                method: 'POST', // method to send content
                headers: {
                    'Content-type': 'application/json', // JSON content 
                    'Authorization': `Bearer ${process.env.MISTRAL_API_KEY}` // API key required to use Mistral 
                },
                body: JSON.stringify({
                    model: "mistral-small-latest",
                    messages: [
                        {
                            role: "system",
                            content: "Tu es un assistant spécialisé dans la synthèse. Ta seule tâche est de générer un titre court (3 à 5 mots maximum) basé sur le message de l'utilisateur. Ne réponds pas au message, donne uniquement le titre sans ponctuation."
                        },
                        {
                            role: "user",
                            content: `${firstMessage}`
                        }
                    ]
                })
            })

            const data = await response.json();
            const chatTitle = data.choices[0].message.content;

            // Create a new chat with the chat title generated before and the user id
            const newChat = await Chat.create({
                name: chatTitle,
                user_id: user_id,
            });

            // Create the message bounded to the chat
            const newMessage = await Message.create({
                content: firstMessage,
                role: "user",
                chat_id: newChat.id
            });

            // FETCH TO GET MISTRAL RESPONSE
            const aiAnswer = await fetch('https://api.mistral.ai/v1/chat/completions', {
                method: "POST",
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': `Bearer ${process.env.MISTRAL_API_KEY}`,
                },
                body: JSON.stringify({
                    model: "mistral-small-latest",
                    messages: [
                        {
                            role: "system",
                            content: "Tu es un assistant qui répond avec le plus de précision et d'honnêteté possible aux questions posées par l'utilisateur."
                        },
                        {
                            role: "user",
                            content: `${firstMessage}`
                        }
                    ]
                })
            })

            const rawAiAnswer = await aiAnswer.json();
            const aiResponse = rawAiAnswer.choices[0].message.content;

            // Create the AI response in the database
            const newAnswer = await Message.create({
                role: "assistant",
                content: aiResponse,
                chat_id: newChat.id
            })

            // Send back the chat title and the AI response
            return res.status(201).json({
                chat: newChat,
                userMessage: newMessage,
                aiReply: newAnswer
            })

        } catch (error) {
            console.error("Erreur lors de la création du chat:", error);
            res.status(500).json({ error: "Impossible de créer le chat." })
        }
    },

    // --- METHOD TO ADD MESSAGE TO AN EXISTING CHAT ---
    addMessage: async (req, res) => {

        try {

            // Get the ID of the chat from the URL
            const { id } = req.params;

            // Checking the chat ID 
            const currentChat = await Chat.findByPk(id);
            if (!currentChat) {
                return res.status(400).json({ error: "Chat introuvable." })
            };

            // Get the new user message from the body 
            const { newUserMessage } = req.body;

            // Create the new user message in the database 
            const newMessage = await Message.create({
                role: "user",
                content: newUserMessage,
                chat_id: id,
            });

            // Get the previous messages of the chat
            const previousMessages = await Message.findAll({
                where: { chat_id: id },
                order: [['createdAt', 'ASC']]
            });

            // Prepare the history messages for Mistral 
            const historyMessages = previousMessages.map(msg => ({
                role: msg.role,
                content: msg.content,
            }));

            // FETCH THE HISTORY MESSAGES TO MISTRAL 
            const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                    "Authorization": `Bearer ${process.env.MISTRAL_API_KEY}`,
                },
                body: JSON.stringify({
                    model: "mistral-small-latest",
                    messages: [
                        {
                            role: "system",
                            content: "Tu es un assistant qui répond avec le plus de précision et d'honnêteté possible aux questions posées par l'utilisateur."
                        },
                        ...historyMessages // We send to mistral all the messages from the chat
                    ]
                })
            });

            // GET THE ANSWER FROM MISTRAL API
            const data = await response.json();
            const aiResponse = data.choices[0].message.content;

            // SAVE MISTRAL ANSWER IN THE DATABASE 
            const newAnswer = await Message.create({
                role: "assistant",
                content: aiResponse,
                chat_id: id,
            });

            return res.status(201).json({
                user_message: newMessage,
                aiReply: newAnswer,
            })

        } catch (error) {
            console.error("Erreur lors de l'ajout du message au chat actuel.", error);
            return res.status(500).json({ error: "Impossible d'ajouter le message." })
        }
    },

}