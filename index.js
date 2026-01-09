import express from 'express'
import 'dotenv/config'
import { sequelize } from './app/models/sequelize.client.js';
import { apiRouter } from './app/routes/api.router.js';
import cors from 'cors';

// Express server configuration
const app = express();
const PORT = process.env.PORT || 3000

// CORS policy authorization
app.use(cors({ origin: 'http://localhost:5173'}));

// Transform JSON data from the front in javascript object usable in controller
app.use(express.json()); 

// Testing that the database is working before launching the server 
async function startServer() {
    try {
        await sequelize.authenticate();
        console.log('Connection to database has been established successfully. ✅');

        // Testing if the server is running
        app.listen(PORT, () => {
            console.log(`Server is listening on the port : ${PORT}`)
        })

    } catch (error) {
        console.error('Unable to connect to the database. ❌')
    }
}

// API ROUTE
app.use('/api', apiRouter);

startServer();


