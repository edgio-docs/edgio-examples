import MistralClient from '@mistralai/mistralai'

const apiKey = process.env.MISTRAL_API_KEY || ''

export const client = new MistralClient(apiKey)