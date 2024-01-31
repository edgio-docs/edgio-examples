import { JWT } from './JWT.js'

export async function handleHttpRequest(request, context) {
  const token = await request.text()
  const secret = context.environmentVars['JWT_SECRET'] || ''
  const resp = {
    valid: false
  }

  const jwt = new JWT(token, secret)
  const isValid = jwt.validate()
  if (isValid) {
    resp.valid = true
    resp.payload = jwt.payloadObject()
    resp.alg = jwt.algUsed()
  }

  return new Response(JSON.stringify(resp), {
    status: isValid ? 200 : 403
  })
}