import { User } from "../models/index.models.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import 'dotenv/config'

export const userController = {

    // --- METHOD TO REGISTER USER ---

    registerUser: async (req, res) => {

        try {

            // Catch email and password from the body request
            const { email, username, password } = req.body;

            // Create user
            const user = await User.create({
                email,
                username,
                password,
            })

            // Return all information except password 
            return res.status(201).json({
                id: user.id,
                email: user.email,
                username: user.username,
                message:"Inscription réussie !"
            }) // Response with json object 

        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Un problème est survenu du côté du serveur..." })
        }
    },

    // --- METHOD TO LOG USER --- 

    logUser: async (req, res) => {

        try {

            // 1. FIND USER :
            // Get data from the body request 
            const { username, password } = req.body;

            // Find the user in the DB with the email
            const user = await User.findOne({
                where: { username }
            });

            // Check if the user exists 
            if (!user) {
                return res.status(404).json({ error: "Erreur, l'utilisateur n'existe pas." })
            };

            //2. VERIFY THE HASHED PASSWORD : 
            const isValid = await bcrypt.compare(password, user.password);
            if (!isValid) {
                return res.status(400).json({ error: "Mot de passe invalide. " })
            }

            //3. GENERATE A JWT : (headers, payload, options)
            // User information to save in the token 
            const payload = { id: user.id, email: user.email, username: user.username };

            // Create the token
            const token = jwt.sign(payload, process.env.SECRET, { expiresIn: 24 * 60 * 60 });

            return res.status(200).json({
                message: "Connexion réussie !",
                token,
                user: payload
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Un problème est survenu du côté du serveur..." })
        }
    }
}
