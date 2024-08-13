const path = require('path')
const express = require('express')

const PORT = process.env.PORT || 3000

const app = express()
app.use(express.static(path.join(__dirname, 'static'), {
  extensions: ['html']
}))

app.listen(PORT, () => {
  `Express server running on port ${PORT}.`
})
