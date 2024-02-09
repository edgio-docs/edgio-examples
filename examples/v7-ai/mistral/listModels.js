import { client } from "./client.js"

const listModelsResponse = await client.listModels()
const listModels = listModelsResponse.data
console.log('Models: ')
listModels.forEach((model) => {
  console.log(" -", model.id)
})