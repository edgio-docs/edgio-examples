// server.js

import express from 'express'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import { CohereClient } from 'cohere-ai'

dotenv.config()

const app = express()
const port = process.env.PORT || 3001

// Initialize Cohere client
const cohere = new CohereClient({
  token: process.env.COHERE_API_TOKEN,
})

// Middleware
app.use(bodyParser.json())

// POST endpoint for text summarization
app.post('/summarize', async (req, res) => {
  const { text } = req.body
  if (!text) {
    return res.status(400).send({ error: 'Text is required for summarization.' })
  }

  try {
    const summary = await cohere.summarize({
      text: text,
      // Additional parameters can be passed here
    })
    
    console.log(summary)
    res.json(`Summary: ${summary.summary}`)
    // console.log("\nFull JSON Output:\n\n", summary)
  } catch (error) {
    console.error('Error summarizing text:', error)
    res.status(500).send({ error: 'Failed to summarize text.' })
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})