import listUsers from './listUsers'
import { Router } from '@edgio/core/router'

export default new Router().get('/', ({ compute, send, setResponseHeader }) => {
  compute(async (req, res) => {
    const users = await listUsers()
    setResponseHeader('content-type', 'application/json')
    send(JSON.stringify(users), 200)
  })
})
