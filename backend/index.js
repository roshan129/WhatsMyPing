const { createApp } = require('./app')

const PORT = process.env.PORT || 4001
const app = createApp()

app.listen(PORT, () => {
  console.log(`Backend server listening on port ${PORT}`)
})
