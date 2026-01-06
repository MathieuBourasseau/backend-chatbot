import { Chat } from "../models/index.models.js"

export const chatController = {

    // Method to get all the chats
    getAll : async (req, res) => {

        try {
            const chats = await Chat.findAll();
            res.json(chats)
        } catch (error) {
            res.status(500).json({ error: "Erreur lors de la récupération des discussions."})
        }
    },

    // Method to create a new chat 
    createChat: async (req, res) => {

        try {
            
            const { firstMessage, user_id } = req.body;

        } catch (error) {
            
        }
    }
}