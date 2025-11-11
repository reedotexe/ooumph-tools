# Edge Runtime JWT Authentication Fix

## Problem
The Next.js middleware runs in the Edge Runtime, which doesn't support Node.js built-in modules like `crypto`. The `jsonwebtoken` library depends on Node.js `crypto` module, causing this error:

```
Error: The edge runtime does not support Node.js 'crypto' module.
```

## Solution
Created two separate JWT utility implementations:

### 1. `lib/auth.ts` - Node.js Runtime (for API Routes)
- Uses `jsonwebtoken` library
- Works in API routes which run in Node.js runtime
- Used by:
  - `/api/auth/signup`
  - `/api/auth/login`
  - `/api/auth/me`
  - `/api/profile/onboarding`

### 2. `lib/auth-edge.ts` - Edge Runtime (for Middleware)
- Uses `jose` library (Edge Runtime compatible)
- Works in Next.js middleware which runs in Edge Runtime
- Used by:
  - `middleware.ts`

## Key Differences

### Node.js Runtime (`lib/auth.ts`)
```typescript
import jwt from 'jsonwebtoken'

export const verifyToken = (token: string): JWTPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload
  } catch (error) {
    return null
  }
}
```

### Edge Runtime (`lib/auth-edge.ts`)
```typescript
import { jwtVerify } from 'jose'

export const verifyTokenEdge = async (token: string): Promise<JWTPayload | null> => {
  try {
    const secret = new TextEncoder().encode(JWT_SECRET)
    const { payload } = await jwtVerify(token, secret)
    return payload as JWTPayload
  } catch (error) {
    return null
  }
}
```

## Important Notes

1. **Edge Runtime functions are async** - `jose` functions are Promise-based
2. **Secret key encoding** - Edge Runtime requires `Uint8Array` instead of string
3. **API routes don't need changes** - They run in Node.js runtime, can use `jsonwebtoken`
4. **Middleware updated** - Now uses `verifyTokenEdge` from `lib/auth-edge.ts`

## Files Modified

- ✅ Created `lib/auth-edge.ts` - Edge Runtime compatible JWT utilities
- ✅ Updated `middleware.ts` - Uses `verifyTokenEdge` instead of `verifyToken`
- ✅ Added `/onboarding` to protected routes in middleware
- ℹ️ No changes needed to API routes (they work fine with existing `lib/auth.ts`)

## Testing

To verify the fix works:
1. Sign in to the application
2. Navigate to any protected route (e.g., `/seo-audit`)
3. Middleware should successfully verify JWT token
4. No Edge Runtime errors should appear in console

## Dependencies

Both implementations require these packages (already installed):
- `jsonwebtoken` - For Node.js runtime
- `jose` - For Edge Runtime
- `bcryptjs` - For password hashing (works in both runtimes)
