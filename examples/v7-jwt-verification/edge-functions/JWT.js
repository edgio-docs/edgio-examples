import { Buffer } from 'buffer';
import * as Base64 from 'crypto-js/enc-base64url';
import { HmacSHA256, HmacSHA384, HmacSHA512 } from 'crypto-js';

// Function to decode base64 strings
const base64decode = (str) => Buffer.from(str, 'base64').toString();

// Hashing functions mapped to JWT algorithms
const hashLibraries = {
  HS256: HmacSHA256,
  HS384: HmacSHA384,
  HS512: HmacSHA512,
};

export class JWT {
  constructor(token, secret) {
    const [header_base64, payload_base64, origSignature] = token.split('.');

    this.header_base64 = header_base64;
    this.payload_base64 = payload_base64;

    try {
      // Decode header and payload from base64
      this.header = JSON.parse(base64decode(header_base64));
      this.payload = JSON.parse(base64decode(payload_base64));
    } catch (e) {
      // Invalid payload or header, initialize empty objects
      this.header = {};
      this.payload = {};
    }

    this.origSignature = origSignature;
    this.hasher = hashLibraries[this.header.alg];
    this.secret = secret;
  }

  // Validates the JWT token
  validate() {
    try {
      const calculatedSignature = Base64.stringify(
        this.hasher(`${this.header_base64}.${this.payload_base64}`, this.secret)
      );
      return calculatedSignature === this.origSignature;
    } catch (e) {
      return false;
    }
  }

  // Returns the payload object
  payloadObject() {
    return this.payload;
  }

  // Returns the algorithm used in JWT
  algUsed() {
    return this.header.alg;
  }
}
