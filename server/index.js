import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import cardsRouter from './routes/cards.js'
import bouquetsRouter from './routes/bouquets.js'
import usersRouter from './routes/users.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json())

app.use('/api/cards', cardsRouter)
app.use('/api/bouquets', bouquetsRouter)
app.use('/api/users', usersRouter)

app.get('/api/health', (req, res) => res.json({ status: 'Florabox is alive 🌸' }))

app.listen(PORT, () => {
  console.log(`🌿 Florabox server running on http://localhost:${PORT}`)
})
