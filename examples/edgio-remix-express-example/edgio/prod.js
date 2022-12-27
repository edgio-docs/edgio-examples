module.exports = async (port) => {
  process.env.PORT = port
  await import('../server.js')
}
