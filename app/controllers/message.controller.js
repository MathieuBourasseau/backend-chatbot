import { Message, User } from "../models/index.models.js";
import 'dotenv/config';


export const messageController = {

    // Method to answer to the user
    answer: async(req, res) => {

        try {
            // Get content and chat id from the body request
        const { content, chat_id } = req.body;

        // Save the new message sent from the user
        const newMessage = await Message.create({
            content: content,
            chat_id: chat_id,
            role: "user"
        });

        const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
            method: 'POST', // method to add content
            headers: {
                'Content-type' : 'application/json', //JSON content
                'Authorization' : `Bearer ${process.env.MISTRAL_API_KEY}` // API KEY required to make Mistral works
            },
            body: JSON.stringify({
                model: "mistral-small-latest",
                messages: [
                    {
                        role: "system",
                        content: "Tu es un assistant utile et amical qui répond aux questions de l'utilisateur de manière précise." 
                    },
                    {
                        role: "user",
                        content: content,
                    }
                ]
            }) 
        })

        const data = await response.json();
        const answer = data.choices[0].message.content;

        // Create Mistral answer 
        const iaMessage = await Message.create({
            content: answer,
            chat_id: chat_id,
            role: "assistant",
        });

        return res.status(201).json(iaMessage); // Send Mistral answer to the front

        } catch (error) {
            console.error("Erreur lors de la réponse de Mistral."),
            res.status(500).json({ error : "Impossible d'obtenir la réponse de mistral."})
        }
    }
}