import { KJUR, KEYUTIL } from 'jsrsasign'
import { Buffer } from 'buffer'

// Set up some polyfills to allow this code to run locally and when deployed:
global.process = global.process || { env: {} }
const fromBase64 = (str) => Buffer.from(str, 'base64').toString()

export async function handleHttpRequest(request, context) {
  Object.assign(process.env, context.environmentVars)

  // Extract the toke and any other objects from the request.
  const { token, ...other } = await request.json()

  // Split out the header and payload from the cleartext token and determine the right algorithm to use.
  const [header, payload] = token.split('.')
  const { alg } = JSON.parse(fromBase64(header))

  let validationComponent = null
  let valid = false
  const resp = { valid }

  try {
    // For HSxxx algorithms, the validation requires a plaintext secret key.
    // For RSxxx, ESxxx, and PSxxx algorithms, a public key is required instead.
    // The public key is expected to be part of the request payload and be named pubKey;
    // the secret key SHOULD NOT be part of the payload.
    if (/^HS/i.test(alg)) {
      validationComponent = process.env.JWT_SECRET
    } else if (/^[REP]S/i.test(alg)) {
      validationComponent = KEYUTIL.getKey(other.pubKey)
    } else {
      return new Response('Invalid JWT alg specified.', { status: 401 })
    }

    valid = KJUR.jws.JWS.verifyJWT(token, validationComponent, { alg: [alg] })
    if (valid === true) {
      // Only parse the payload if the signature is valid.
      const decodedPayload = JSON.parse(fromBase64(payload))
      Object.assign(resp, { valid, alg, payload: decodedPayload })
    }
  } catch (e) {
    // Handle exceptions here.
  }

  return new Response(JSON.stringify(resp), {
    status: valid ? 200 : 401
  })
}
