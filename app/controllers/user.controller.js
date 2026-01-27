import { User } from "../models/index.models.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import 'dotenv/config'

export const userController = {

    // --- METHOD TO REGISTER USER ---

    registerUser: async (req, res) => {

        try {

            // Create dynamic variable 
            let avatarUrl;

            // Catch email and password from the body request
            const { email, username, password } = req.body;

            // If the user put an avatar
            if (req.file) {

                // Elements to create url 
                const protocol = req.protocol;
                const host = req.get('host');
                const filename = req.file.filename;

                avatarUrl = `${protocol}://${host}/uploads/${filename}`;

            } else {
                // If there is no avatar
                avatarUrl = null;
            }


            // Create user
            const user = await User.create({
                email,
                username,
                password,
                avatar: avatarUrl,
            })

            // Return all information except password 
            return res.status(201).json({
                id: user.id,
                email: user.email,
                username: user.username,
                avatar: avatarUrl,
                message: "Inscription réussie !"
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
            const { username, password, rememberMe } = req.body;

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
            const payload = { id: user.id, email: user.email, username: user.username, avatar: user.avatar };

            // Define expiration token options 
            let tokenExpiration;

            if (rememberMe) {
                tokenExpiration = '30d'
            } else {
                tokenExpiration = '1h'
            }

            // Create the token
            const token = jwt.sign(payload, process.env.SECRET, { expiresIn: tokenExpiration });

            return res.status(200).json({
                message: "Connexion réussie !",
                token,
                user: payload
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Un problème est survenu du côté du serveur..." })
        }
    },

    // --- METHOD TO CHECK THE TOKEN SENT FROM THE FRONT --- 
    checkToken: async (req, res) => {

        try {

            const authHeader = req.get('Authorization'); // Get the token in headers

            if (!authHeader) return res.status(401).json({ error: "Non autorisé" }); // Stop if there is no token

            const token = authHeader.split(' ')[1]; // Get only the token without string 'bearer'

            const checkToken = jwt.verify(token, process.env.SECRET); // Verify the token with the secret

            // Sent back JSON object 
            return res.status(200).json({
                user: {
                    id: checkToken.id,
                    username: checkToken.username,
                    avatar: checkToken.avatar
                }
            });

        } catch (error) {
            console.error("Erreur lors de la vérification du token :", error);
            return res.status(401).json({ error: "Token invalide ou expiré" });
        }
    }
}
