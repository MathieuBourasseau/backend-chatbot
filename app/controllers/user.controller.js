import { User } from "../models/index.models.js"

export const userController = {

    getOrCreate: async (req, res) => {

        try {

            // Catch the identifier from the request
            const { identifier } = req.params;

            // Find or create new identifier in the DB
            const [user, created ] = await User.findOrCreate({
                where: { identifier }, // Where to search in the DB
                defaults: { identifier } // Which identifier to create if it is not existing in the DB
            });
            
            return res.status(created ? 201 : 200).json(user) // Response with json object 

        } catch (error) {
            console.error(error);
            return res.status(500).json({ error : "Un problème est survenu du côté du serveur..."})
        }
    }
}