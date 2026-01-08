import { Chat, Message } from "../models/index.models.js"
import 'dotenv/config'

export const chatController = {

    // Method to get all the chats
    getAll: async (req, res) => {

        try {
            const chats = await Chat.findAll();
            res.json(chats)
        } catch (error) {
            res.status(500).json({ error: "Erreur lors de la récupération des discussions." })
        }
    },

    // Method to create a new chat 
    createChat: async (req, res) => {

        try {

            const { firstMessage, user_id } = req.body; // Catch first message and user id from the body request

            // Fetch to mistral 

            const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
                method: 'POST', // method to send content
                headers: {
                    'Content-type' : 'application/json', // JSON content 
                    'Authorization' : `Bearer ${process.env.MISTRAL_API_KEY}` // API key required to use Mistral 
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
            })

            // Create the message bounded to the chat
            const newMessage = await Message.create({
                content: firstMessage,
                role: "user",
                chat_id: newChat.id
            })

            return res.status(201).json(newChat)

        } catch (error) {
            console.error("Erreur lors de la création du chat:", error);
            res.status(500).json({ error: "Impossible de créer le chat."})
        }
    }
}