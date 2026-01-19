import { User } from "../models/index.models.js";
import 'bcrypt';

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
    },

    // --- METHOD TO LOG USER --- 

    logUser: async (req, res) => {

       try {

         // 1. FIND USER :
        // Get data from the body request 
        const { email, password } = req.body;

        // Find the user in the DB with the email
        const user = await User.findOne({
            where: { email }
        });

        // Check if the user exists 
        if(!user){
            return res.status(404).json({ error: "Erreur, l'utilisateur n'existe pas."})
        };

        //2. VERIFY THE HASHED PASSWORD : 
        const isValid = await bcrypt.compare(password, user.password);
        if(!isValid){
            return res.status(400).json({ error: "Mot de passe invalide. "})
        }

        //3. GENERATE A JWT : 
        

       } catch (error) {
        
       }
    }
}