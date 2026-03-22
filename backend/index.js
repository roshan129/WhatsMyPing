const { createApp } = require('./app')

const startServer = ({ port = process.env.PORT || 4001 } = {}) => {
  const app = createApp()
  return app.listen(port, () => {
    console.log(`Backend server listening on port ${port}`)
  })
}

if (require.main === module) {
  startServer()
}

module.exports = {
  createApp,
  startServer,
}
