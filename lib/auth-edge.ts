import { jwtVerify, SignJWT } from 'jose'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'
const JWT_EXPIRES_IN = '7d' // Token expires in 7 days

// Convert secret string to Uint8Array for jose
const getSecretKey = () => new TextEncoder().encode(JWT_SECRET)

export interface JWTPayload {
  userId: string
  email: string
  name: string
  iat?: number
  exp?: number
}

/**
 * Generate JWT token (Edge Runtime compatible)
 */
export const generateTokenEdge = async (payload: Omit<JWTPayload, 'iat' | 'exp'>): Promise<string> => {
  const secret = getSecretKey()
  
  return await new SignJWT(payload as any)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRES_IN)
    .sign(secret)
}

/**
 * Verify JWT token (Edge Runtime compatible)
 */
export const verifyTokenEdge = async (token: string): Promise<JWTPayload | null> => {
  try {
    const secret = getSecretKey()
    const { payload } = await jwtVerify(token, secret)
    
    return {
      userId: payload.userId as string,
      email: payload.email as string,
      name: payload.name as string,
      iat: payload.iat,
      exp: payload.exp,
    }
  } catch (error) {
    console.error('[Auth] Token verification failed:', error)
    return null
  }
}
