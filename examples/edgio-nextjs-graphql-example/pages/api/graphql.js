import { ApolloServer } from 'apollo-server-micro'
import Cors from 'micro-cors'
import { typeDefs } from '../../graphql/schema'
import { resolvers } from '../../graphql/resolvers'

const cors = Cors()
const server = new ApolloServer({ typeDefs, resolvers })
const startServer = server.start()

export default cors(async function handler(req, res) {
  if (req.method == 'OPTIONS') {
    res.end()
    return false
  }

  await startServer
  await server.createHandler({ path: '/api/graphql' })(req, res)
})

export const config = {
  api: {
    bodyParser: false,
  },
}
