# Onboarding Data Not Saving - Fix Applied

## Problem
User completed the entire onboarding form but the data wasn't saving to the database. The system kept asking the user to fill out the details again.

## Root Cause
The MongoDB schema had `required: true` constraints on nested fields within an optional `profile` object. This created a validation conflict:
- The `profile` field itself was optional (`default: null`)
- But nested fields like `companyName`, `businessDescription`, etc. were marked as required
- When Mongoose tried to validate the update with `runValidators: true`, it failed silently

## Fixes Applied

### 1. Schema Validation Fixed (`lib/db.ts`)
**Before:**
```typescript
const userProfileSchema = new mongoose.Schema({
  companyName: { type: String, required: true },  // ❌ Required in optional parent
  businessDescription: { type: String, required: true },
  industry: { type: String, required: true },
  targetAudience: { type: String, required: true },
  // ...
})
```

**After:**
```typescript
const userProfileSchema = new mongoose.Schema({
  companyName: { type: String },  // ✅ No required constraint
  businessDescription: { type: String },
  industry: { type: String },
  targetAudience: { type: String },
  // ...
})
```

**Why:** Nested fields in an optional parent object can't have `required: true`. The validation should happen at the API level instead.

### 2. Enhanced Logging (`lib/db.ts`)
Added detailed logging to the `update` method:
```typescript
console.log('[DB] Updating user:', id)
console.log('[DB] Updates:', JSON.stringify(updates, null, 2))
// ... update logic ...
console.log('[DB] User updated successfully')
```

This helps debug future issues.

### 3. Disabled Mongoose Validators for Updates
Changed from `runValidators: true` to `runValidators: false`:
```typescript
const user = await UserModel.findByIdAndUpdate(
  id,
  { $set: updates },
  { new: true, runValidators: false }  // ✅ Disabled for nested updates
)
```

**Why:** Mongoose validators don't work well with nested object updates. API-level validation is more reliable.

### 4. Enhanced API Logging (`app/api/profile/onboarding/route.ts`)
Added comprehensive logging:
```typescript
console.log('[Onboarding] POST request received')
console.log('[Onboarding] Token verified for user:', decoded.email)
console.log('[Onboarding] Profile data received:', Object.keys(profileData))
console.log('[Onboarding] Profile updated successfully')
console.log('[Onboarding] Profile onboardingCompleted:', updatedUser.profile?.onboardingCompleted)
```

### 5. Frontend Logging (`app/onboarding/page.tsx`)
Added logging to track the submission flow:
```typescript
console.log('[Onboarding Frontend] Submitting data:', formData)
console.log('[Onboarding Frontend] Response status:', response.status)
console.log('[Onboarding Frontend] Response data:', data)
```

### 6. User Refresh After Onboarding (`app/onboarding/page.tsx`)
Added `refreshUser()` call to ensure auth context updates:
```typescript
if (response.ok) {
  await refreshUser()  // ✅ Refresh user data
  router.push('/')
}
```

**Why:** The auth context needs to be refreshed so that `user.profile.onboardingCompleted` is updated, preventing the user from being redirected back to onboarding.

## Validation Strategy

### API Level (Where it belongs)
✅ Required field validation in `/api/profile/onboarding`
✅ Checks for: `companyName`, `businessDescription`, `industry`, `targetAudience`
✅ Returns clear error messages

### Schema Level (Simplified)
✅ Basic type validation only
✅ No `required` constraints on nested optional fields
✅ Default values where appropriate

## Testing the Fix

### Step 1: Clear Previous Attempts
If you have a user account that got stuck, the data should now save properly. Try completing onboarding again.

### Step 2: Check Browser Console
After submitting onboarding, you should see:
```
[Onboarding Frontend] Submitting data: {...}
[Onboarding Frontend] Response status: 200
[Onboarding Frontend] Success! Refreshing user data...
```

### Step 3: Check Server Console
The terminal running Next.js should show:
```
[Onboarding] POST request received
[Onboarding] Token verified for user: your-email@example.com
[Onboarding] Profile data received: [ 'companyName', 'businessDescription', ... ]
[DB] Updating user: 507f1f77bcf86cd799439011
[DB] User updated successfully
[Onboarding] Profile updated successfully for user: your-email@example.com
[Onboarding] Profile onboardingCompleted: true
```

### Step 4: Verify in Database
You can verify the data was saved by checking MongoDB directly or by:
1. Navigate to any tool page (e.g., `/content-ideas`)
2. The form should be pre-filled with your onboarding data
3. You should NOT be redirected back to onboarding

## If Still Not Working

### Debug Checklist:
1. ✅ Check browser console for errors
2. ✅ Check server terminal for error logs
3. ✅ Verify MongoDB connection is working
4. ✅ Check that JWT token is valid (not expired)
5. ✅ Verify all required fields are filled:
   - `companyName`
   - `businessDescription`
   - `industry`
   - `targetAudience`

### Manual Database Check:
You can use the test script `test-onboarding.mjs`:
1. Update the email in the script
2. Run: `node test-onboarding.mjs`
3. It will show if data can be saved to the database

## Summary
The main issue was schema-level validation conflicts with nested optional objects. By moving all validation to the API level and removing `required` constraints from the schema, the onboarding data should now save successfully. The enhanced logging will help identify any remaining issues.
