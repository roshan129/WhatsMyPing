const express = require('express')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(express.json())

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' })
})

app.get('/api/ping', (req, res) => {
  res.status(200).json({
    message: 'pong',
    serverTime: Date.now(),
  })
})

const PORT = process.env.PORT || 4001

app.listen(PORT, () => {
  console.log(`Backend server listening on port ${PORT}`)
})

