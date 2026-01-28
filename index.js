import express from 'express';
import 'dotenv/config';
import { sequelize } from './app/models/sequelize.client.js';
import { apiRouter } from './app/routes/api.router.js';
import cors from 'cors';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 10000;

// Configuration Sécurisée
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// ROUTE DE TEST (Pour vérifier que le serveur est vivant)
app.get('/api/health', (req, res) => {
    res.json({ status: "OK", message: "Le serveur répond parfaitement !" });
});

// Tes routes
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
app.use('/api', apiRouter);

async function startServer() {
    try {
        await sequelize.authenticate();
        console.log('Database connected ✅');
        await sequelize.sync();
        app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
    } catch (error) {
        console.error('Database connection error ❌', error);
    }
}

startServer();