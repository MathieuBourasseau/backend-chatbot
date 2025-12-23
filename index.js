import express from 'express'
import 'dotenv/config'

const app = express();
const PORT= process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`Server is listening on the port : ${PORT}`)
})