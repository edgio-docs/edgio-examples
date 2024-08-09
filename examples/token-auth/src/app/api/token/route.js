import { NextResponse } from 'next/server'
import { ECToken, encrypt } from '@edgio/ectoken'

export const dynamic = 'force-dynamic'

export async function GET(request) {
  const key = process.env.NEXT_PUBLIC_PRIMARY_TOKEN_KEY
  const newToken = new ECToken()
  const ts = Math.floor(new Date().getTime() / 1000) + 180  // Valid for 3m
  newToken.addValue('ec_expire', ts)
  const token = await encrypt(key, newToken)
  const resp = {
    expires_at: ts,
    token
  }
  return NextResponse.json(resp)
}