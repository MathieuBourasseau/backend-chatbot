import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {

    // Catch the authorization in headers request
    const authHeader = req.headers['authorization'];
    
    // Split the authorization to keep only the token
    const token = authHeader && authHeader.split(' ')[1];

    // If token does not exist we stop the request
    if (!token) {
        return res.status(401).json({ error: "Accès refusé. Token manquant." });
    }

    // Checking if the token is valid
    jwt.verify(token, process.env.SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: "Token invalide ou expiré." });
        }

        // We put the user from the request to let access in controllers
        req.user = user;
        
        next();
    });
};