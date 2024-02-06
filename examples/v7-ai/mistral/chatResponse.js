import { client } from "./client.js"

const chatResponse = await client.chat({
  model: 'mistral-tiny',
  messages: [{
    role: 'user',
    content: 'What is the best cheese?'
  }],
})

console.log('Chat:', chatResponse.choices[0].message.content)