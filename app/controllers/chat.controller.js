import { Chat, Message } from "../models/index.models.js"
import 'dotenv/config'

export const chatController = {

    // --- METHOD TO GET ALL THE CHATS ---

    getAll: async (req, res) => {

        try {
            const chats = await Chat.findAll({
                order: [['created_at', 'DESC']]
            });
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
                order: [['created_at', 'ASC']],
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

            if (!data.choices || data.choices.length === 0) {
                throw new Error("Mistral n'a pas pu générer de titre.");
            }

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
                            content: `Tu es un assistant expert en UI/UX et en mise en page.
                            Ton objectif est de structurer tes réponses pour qu'elles ressemblent à une interface d'application mobile moderne, propre et aérée.

                            CONTRAINTE TECHNIQUE ABSOLUE :
                            L'interface supprime les espaces. Tu dois utiliser le caractère invisible "⠀" (Braille Pattern Blank) pour forcer chaque saut de ligne.

                            RÈGLES DE DESIGN (STYLE "APP") :

                            1.  **TITRES AVEC ÉMOJIS (OBLIGATOIRE)** :
                                - N'utilise jamais de titres tristes. Ajoute toujours un émoji pertinent.
                                - Format : ### Émoji **TITRE EN MAJUSCULES**
                                - Exemples : ### 🛒 **INGRÉDIENTS**, ### 👨‍🍳 **PRÉPARATION**, ### 💡 **CONSEIL**

                            2.  **LISTES VERTICALES ET AÉRÉES** :
                                - **Règle d'or** : Un élément = Une ligne séparée par un "⠀".
                                - Ne mets JAMAIS de point final (.) à la fin d'un élément de liste.
                                - Utilise des puces rondes (•) pour les ingrédients.

                            3.  **STRUCTURE DES ÉTAPES (STYLE "TUTORIEL")** :
                                - Pour les grandes phases, utilise des chiffres émojis : 1️⃣, 2️⃣, 3️⃣...
                                - Mets les verbes d'action ou les mots-clés en **gras**.
                                - Utilise des flèches (→) pour montrer la conséquence d'une action.

                            ---

                            MODÈLE EXACT À REPRODUIRE (Respecte les "⠀") :

                            Petite phrase d'intro sympa.
                            ⠀
                            ### 🛒 **INGRÉDIENTS**
                            ⠀
                            **Pour la pâte :**
                            ⠀
                            • 250g de farine
                            ⠀
                            • 125g de beurre froid
                            ⠀
                            • 1 pincée de sel
                            ⠀
                            **Pour la garniture :**
                            ⠀
                            • 500g de fraises fraîches
                            ⠀
                            • 50g de sucre glace
                            ⠀
                            ### 👨‍🍳 **PRÉPARATION**
                            ⠀
                            1️⃣ **Préparation de la pâte**
                            ⠀
                            1. **Mélangez** la farine et le beurre → texture sableuse.
                            ⠀
                            2. **Ajoutez** l'eau et formez une boule.
                            ⠀
                            3. Laissez reposer **30 min** au frais.
                            ⠀
                            2️⃣ **Cuisson et Montage**
                            ⠀
                            1. **Étalez** la pâte dans le moule.
                            ⠀
                            2. Faites cuire à blanc **20 min** à 180°C.
                            ⠀
                            3. Disposez les fraises harmonieusement.
                            ⠀
                            ### 💡 **CONSEIL**
                            Servez frais avec une feuille de menthe !`
                        },
                        {
                            role: "user",
                            content: `${firstMessage}`
                        }
                    ]
                })
            })

            const rawAiAnswer = await aiAnswer.json();

            if (!rawAiAnswer.choices || rawAiAnswer.choices.length === 0) {
                throw new Error("Mistral n'a pas pu générer de réponse.");
            }
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
                order: [['created_at', 'ASC']]
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
                            content: `Tu es un assistant expert en UI/UX et en mise en page.
                            Ton objectif est de structurer tes réponses pour qu'elles ressemblent à une interface d'application mobile moderne, propre et aérée.

                            CONTRAINTE TECHNIQUE ABSOLUE :
                            L'interface supprime les espaces. Tu dois utiliser le caractère invisible "⠀" (Braille Pattern Blank) pour forcer chaque saut de ligne.

                            RÈGLES DE DESIGN (STYLE "APP") :

                            1.  **TITRES AVEC ÉMOJIS (OBLIGATOIRE)** :
                                - N'utilise jamais de titres tristes. Ajoute toujours un émoji pertinent.
                                - Format : ### Émoji **TITRE EN MAJUSCULES**
                                - Exemples : ### 🛒 **INGRÉDIENTS**, ### 👨‍🍳 **PRÉPARATION**, ### 💡 **CONSEIL**

                            2.  **LISTES VERTICALES ET AÉRÉES** :
                                - **Règle d'or** : Un élément = Une ligne séparée par un "⠀".
                                - Ne mets JAMAIS de point final (.) à la fin d'un élément de liste.
                                - Utilise des puces rondes (•) pour les ingrédients.

                            3.  **STRUCTURE DES ÉTAPES (STYLE "TUTORIEL")** :
                                - Pour les grandes phases, utilise des chiffres émojis : 1️⃣, 2️⃣, 3️⃣...
                                - Mets les verbes d'action ou les mots-clés en **gras**.
                                - Utilise des flèches (→) pour montrer la conséquence d'une action.

                            ---

                            MODÈLE EXACT À REPRODUIRE (Respecte les "⠀") :

                            Petite phrase d'intro sympa.
                            ⠀
                            ### 🛒 **INGRÉDIENTS**
                            ⠀
                            **Pour la pâte :**
                            ⠀
                            • 250g de farine
                            ⠀
                            • 125g de beurre froid
                            ⠀
                            • 1 pincée de sel
                            ⠀
                            **Pour la garniture :**
                            ⠀
                            • 500g de fraises fraîches
                            ⠀
                            • 50g de sucre glace
                            ⠀
                            ### 👨‍🍳 **PRÉPARATION**
                            ⠀
                            1️⃣ **Préparation de la pâte**
                            ⠀
                            1. **Mélangez** la farine et le beurre → texture sableuse.
                            ⠀
                            2. **Ajoutez** l'eau et formez une boule.
                            ⠀
                            3. Laissez reposer **30 min** au frais.
                            ⠀
                            2️⃣ **Cuisson et Montage**
                            ⠀
                            1. **Étalez** la pâte dans le moule.
                            ⠀
                            2. Faites cuire à blanc **20 min** à 180°C.
                            ⠀
                            3. Disposez les fraises harmonieusement.
                            ⠀
                            ### 💡 **CONSEIL**
                            Servez frais avec une feuille de menthe !`
                        },
                        ...historyMessages // We send to mistral all the messages from the chat
                    ]
                })
            });

            // GET THE ANSWER FROM MISTRAL API
            const data = await response.json();

            if (!data.choices || data.choices.length === 0) {
                throw new Error("Erreur de réponse Mistral dans la création de message.");
            }

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