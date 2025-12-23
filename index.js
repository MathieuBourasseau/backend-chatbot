import express from 'express'
import 'dotenv/config'

// Express server configuration
const app = express();
const PORT= process.env.PORT || 3000

// Testing if the server is running
app.listen(PORT, () => {
    console.log(`Server is listening on the port : ${PORT}`)
})