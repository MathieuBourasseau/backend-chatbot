import { Chat } from "../models/index.models.js"

export const chatController = {

    getAll : async (req, res) => {

        try {
            const chats = await Chat.findAll();
            res.json(chats)
        } catch (error) {
            res.status(500).json({ error: "Erreur lors de la récupération des discussions."})
        }
    }
}