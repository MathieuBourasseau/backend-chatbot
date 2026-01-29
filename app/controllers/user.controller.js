import { User } from "../models/index.models.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import 'dotenv/config'
import crypto from 'crypto'
import nodemailer from "nodemailer"
import 'dotenv/config'
import e from "cors";

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

            // Verify if user already exists 
            const existingUser = await User.findOne( { where: {email} });

            if(existingUser){
                return res.status(401).json({ error : "Cette adresse mail existe déjà."})
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
    },

    // --- METHOD TO GENERATE A MAIL FOR FORGOT PASSWORD ---
    forgotPassword: async (req, res) => {
        try {
            const { email } = req.body;
            const user = await User.findOne({ where: { email } });

            if (!user) {
                return res.status(404).json({ error: "Utilisateur introuvable" });
            }

            const resetToken = crypto.randomBytes(20).toString('hex');
            const resetExpires = Date.now() + 3600000;

            await user.update({
                reset_token: resetToken,
                reset_expires: resetExpires
            });

            // Transporter configuration
            const transporter = nodemailer.createTransport({
                host: process.env.EMAIL_HOST,
                port: parseInt(process.env.EMAIL_PORT) || 587,
                secure: false, 
                auth: {
                    user: process.env.EMAIL_ID,
                    pass: process.env.EMAIL_PASS,
                },
                tls: {
                    rejectUnauthorized: false 
                }
            });

            const resetUrl = `${process.env.FRONTEND_URL}reset-password/${resetToken}`;

            await transporter.sendMail({
                // On s'assure que le FROM est identique à l'USER validé sur Brevo
                from: `"Chatbot Support" <${process.env.EMAIL_USER}>`,
                to: user.email,
                subject: "Réinitialisation de votre mot de passe",
                html: `
                <h1>Bonjour ${user.username},</h1>
                <p>Vous avez demandé à réinitialiser votre mot de passe.</p>
                <p>Ce lien est valable pendant 1 heure :</p>
                <a href="${resetUrl}" style="padding: 10px; background: blue; color: white; text-decoration: none; border-radius: 5px;">Réinitialiser mon mot de passe</a>
                <p>Si vous n'êtes pas à l'origine de cette demande, ignorez ce mail.</p>
            `
            });

            return res.status(200).json({ message: "Un email de récupération a été envoyé !" });

        } catch (error) {
            console.error("Détails de l'erreur SMTP:", error);
            return res.status(500).json({ error: "Problème de réinitialisation de mot de passe" });
        }
    },

    // --- METHOD TO RESET PASSWORD --- 
    resetPassword: async (req, res) => {

        try {
            // Get token from url 
            const { token } = req.params;

            // Get password from body
            const { password } = req.body;

            // Find user with the token
            const user = await User.findOne({
                where: { reset_token: token }
            });

            if (!user) {
                return res.status(401).json({ error: "Interdiction de changer de mot passe" });
            };

            // Verify if the token has not expired
            if (Date.now() > user.reset_expires) {
                return res.status(401).json({ error: "Le token a expiré" });
            }

            // update new password
            user.password = password;
            user.reset_token = null;
            user.reset_expires = null;

            // save password
            await user.save();

            return res.status(200).json({ message: "Mot de passe modifié" });

        } catch (error) {

            console.error("Erreur lors de la modification du mot de passe", error);
            return res.status(500).json({ error: "Erreur lors du changement de mot de passe." });

        }
    }
};
