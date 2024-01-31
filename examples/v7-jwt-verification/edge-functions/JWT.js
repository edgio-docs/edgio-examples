import { Buffer } from 'buffer'
import * as Base64 from 'crypto-js/enc-base64url'
import { HmacSHA256, HmacSHA384, HmacSHA512 } from 'crypto-js'

const base64decode = (str) => Buffer.from(str, 'base64').toString()

const hashLibraries = {
  HS256: HmacSHA256,
  HS384: HmacSHA384,
  HS512: HmacSHA512,
}

export class JWT {
  // JWT validation process:
  // 1. Split the token by '.' to get the header (json), payload (json), and signature (string).
  // 2. Calculate a signature using the algorithm in the header (hardcoded here) to join the header and payload with a
  //    '.', and hash it using a secret value
  // 3. Compare the calculated signature with the one from the token. If they match, the token is valid. If not, the
  //    token has been tampered with.

  constructor(token, secret) {
    const [ header_base64, payload_base64, origSignature ] = token.split('.')

    this.header_base64 = header_base64
    this.payload_base64 = payload_base64

    this.header = JSON.parse(base64decode(header_base64))
    this.payload = JSON.parse(base64decode(payload_base64))
    
    this.origSignature = origSignature
    
    this.hasher = hashLibraries[this.header.alg]
    this.secret = secret
  }

  validate() {
    console.log(`validating token using ${this.header.alg} algorithm.`)
    const calculatedSignature = Base64.stringify(
      this.hasher(
        `${this.header_base64}.${this.payload_base64}`,
        this.secret
      )
    )
    return calculatedSignature === this.origSignature
  }

  payloadObject() {
    return this.payload
  }

  algUsed() {
    return this.header.alg
  }
}