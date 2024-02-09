import MistralClient from "@mistralai/mistralai"

export const doChatStream = async function() {
  const apiKey = document.getElementById("apiKey").value
  const chat = document.getElementById("chat").value
  const client = new MistralClient(apiKey)
  document.getElementById("output").innerHTML = ""
  document.getElementById("error").innerHTML = ""
  try {
    const chatStreamResponse = await client.chatStream({
      model: 'mistral-tiny',
      messages: [{role: 'user', content: chat}],
    })
    for await (const chunk of chatStreamResponse) {
      if (chunk.choices[0].delta.content !== undefined) {
        let streamText = chunk.choices[0].delta.content
        streamText = streamText.replace(/(?:\r\n|\r|\n)/g, '<br>')
        document.getElementById("output").innerHTML += streamText
      }
    }
  }
  catch (e) {
    document.getElementById("error").innerHTML += e
  }
}