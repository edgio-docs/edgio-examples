import { client } from "./client.js"

const chatStreamResponse = await client.chatStream({
  model: 'mistral-tiny',
  messages: [{
    role: 'user',
    content: 'What is the best cheese?'
  }],
});

console.log('Chat Stream:');
for await (const chunk of chatStreamResponse) {
  if (chunk.choices[0].delta.content !== undefined) {
    const streamText = chunk.choices[0].delta.content
    process.stdout.write(streamText)
  }
}