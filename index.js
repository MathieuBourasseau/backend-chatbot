import express from 'express'
import 'dotenv/config'
import { sequelize } from './app/models/sequelize.client.js';
import { ApiRouter } from './app/routes/api.router.js';

// Express server configuration
const app = express();
const PORT = process.env.PORT || 3000

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

startServer();

app.use(express.json()); // Transform JSON data from the front in javascript object usable in controller

// API ROUTE
app.use(ApiRouter);
