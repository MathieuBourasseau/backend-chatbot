import { User, Chat, Message } from "../app/models/index.models.js"
import { sequelize } from "../app/models/sequelize.client.js";

try {
    console.log("🌱 Début du seeding...");

    // User creation
    const testUser = await User.create({
        identifier: "testeur-2025",
    });

    // First conversation created 
    const firstChat = await Chat.create({
        name: "Ma première discussion",
        user_id: testUser.id
    });

    // adding message to this conversation
    await Message.bulkCreate([
        {
            content: "Bonjour ! Comment peux-tu m'aider aujourd'hui ?",
            role: "user",
            chat_id: firstChat.id
        },
        {
            content: "Bonjour ! Je suis ton assistant Mistral. Je suis prêt à répondre à toutes tes questions.",
            role: "assistant",
            chat_id: firstChat.id
        }
    ]);

    console.log("Seeding terminé avec succès ! ✅");
} catch (error) {
    console.error("Erreur lors du seeding ❌ :", error);
} finally {
    await sequelize.close();
}