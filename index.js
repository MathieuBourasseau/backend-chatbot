import express from 'express'
import 'dotenv/config'
import { sequelize } from './app/models/sequelize.client.js';

// Express server configuration
const app = express();
const PORT= process.env.PORT || 3000

// Testing if the server is running
app.listen(PORT, () => {
    console.log(`Server is listening on the port : ${PORT}`)
})

// Test to see if the connection to the database works
try {
    await sequelize.authenticate();
    console.log('Connection to database has been established successfully. ✅')
} catch (error) {
    console.error('Unable to connect to the database. ❌')
}