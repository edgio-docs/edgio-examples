import dotenv from 'dotenv'

dotenv.config()

const AWS = require('aws-sdk')

AWS.config.update({
  region: 'us-east-1',
  credentials: {
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_KEY,
  },
})

const client = new AWS.DynamoDB.DocumentClient()

export default async function listUsers() {
  return new Promise((resolve, reject) => {
    const params = {
      TableName: 'edgio-poc-users',
      Select: 'ALL_ATTRIBUTES',
    }

    client.scan(params, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data.Items)
      }
    })
  })
}
