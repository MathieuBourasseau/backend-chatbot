import { User } from "../models/index.models.js"

export const userController = {

    // --- METHOD TO REGISTER USER ---

    registerUser: async (req, res) => {

        try {

            // Catch email and password from the body request
            const { email, password } = req.body;

            // Create user
            const user = await User.create({
                email,
                password,
            })
            
            // Return only id and email
            return res.status(201).json({
                id: user.id, 
                email: user.email
            }) // Response with json object 

        } catch (error) {
            console.error(error);
            return res.status(500).json({ error : "Un problème est survenu du côté du serveur..."})
        }
    }
}