# Migration Guide: Old API to New Axios Architecture

This guide helps you migrate from the old fetch-based API to the new axios architecture.

## Quick Reference

### Old Pattern (fetch)
```typescript
const response = await fetch(`${API_BASE}/endpoint`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(data),
})

if (!response.ok) {
  throw new Error('Request failed')
}

const result = await response.json()
```

### New Pattern (axios service)
```typescript
import { getAccountService } from '@/services'

const accountService = getAccountService()
const result = await accountService.updateProfile(data)
// Auth, error handling, retries, logging all automatic!
```

## Step-by-Step Migration

### 1. Client-Side Components

#### Before
```typescript
// Old approach with useAsync
import { useAsync } from '@/hooks'

function ProfileComponent() {
  const { execute, loading, error } = useAsync()

  const updateProfile = async (data) => {
    await execute(async () => {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        body: JSON.stringify(data),
      })
      return response.json()
    })
  }

  return <Form onSubmit={updateProfile} />
}
```

#### After
```typescript
// New approach with useApiMutation
import { useApiMutation } from '@/hooks/api'
import { getAccountService } from '@/services'

function ProfileComponent() {
  const accountService = getAccountService()
  
  const { mutate, loading, error } = useApiMutation(
    (data) => accountService.updateProfile(data),
    {
      showSuccessToast: true,
      successMessage: 'Profile updated!',
    }
  )

  return <Form onSubmit={mutate} />
}
```

### 2. GET Requests with Caching

#### Before
```typescript
import { useEffect, useState } from 'react'

function CanvasComponent() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/canvas')
      .then(res => res.json())
      .then(setData)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Spinner />
  return <Canvas data={data} />
}
```

#### After
```typescript
import { useApiQuery } from '@/hooks/api'
import { getPixelService } from '@/services'

function CanvasComponent() {
  const pixelService = getPixelService()
  
  const { data, loading } = useApiQuery(
    'canvas-data',
    () => pixelService.getCanvas(),
    {
      refetchInterval: 30000, // Auto-refetch every 30s
      cacheDuration: 5 * 60 * 1000, // Cache for 5min
    }
  )

  if (loading) return <Spinner />
  return <Canvas data={data} />
}
```

### 3. Server Actions

#### Before
```typescript
'use server'

import { cookies } from 'next/headers'

export async function updateProfile(data) {
  const token = await getTokenFromCookies()
  
  const response = await fetch(`${API_BASE}/account/me`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json()
    return { success: false, error: error.message }
  }

  const result = await response.json()
  return { success: true, data: result }
}
```

#### After
```typescript
'use server'

import { AccountService } from '@/services'
import { createAuthenticatedClient } from '@/lib/api/factory'
import { attachAuthInterceptor, createServerTokenGetter } from '@/lib/api/interceptors'
import { handleApiErrorSilently } from '@/lib/api/errors'

export async function updateProfile(data) {
  // Create server-side authenticated client
  const client = createAuthenticatedClient()
  attachAuthInterceptor(client, {
    getToken: createServerTokenGetter(),
  })

  const accountService = new AccountService(client)

  try {
    const result = await accountService.updateProfile(data)
    return { success: true, data: result }
  } catch (error) {
    const apiError = handleApiErrorSilently(error)
    return { success: false, error: apiError.userMessage }
  }
}
```

### 4. API Routes

#### Before
```typescript
// app/api/pixels/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const data = await request.json()
  const token = request.headers.get('authorization')

  const response = await fetch(`${BACKEND_URL}/pixels`, {
    method: 'POST',
    headers: {
      'Authorization': token,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  return NextResponse.json(await response.json())
}
```

#### After
```typescript
// app/api/pixels/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { PixelService } from '@/services'
import { createAuthenticatedClient } from '@/lib/api/factory'
import { attachAuthInterceptor } from '@/lib/api/interceptors'

export async function POST(request: NextRequest) {
  const data = await request.json()
  
  // Create authenticated client
  const client = createAuthenticatedClient()
  attachAuthInterceptor(client, {
    getToken: async () => {
      const token = request.headers.get('authorization')
      return token?.replace('Bearer ', '') || null
    },
  })

  const pixelService = new PixelService(client)

  try {
    const result = await pixelService.placePixel(data)
    return NextResponse.json(result)
  } catch (error) {
    // Error is already logged and categorized
    return NextResponse.json(
      { error: 'Failed to place pixel' },
      { status: 500 }
    )
  }
}
```

## Service Classes Reference

### AuthService
```typescript
import { getAuthService } from '@/services'

const authService = getAuthService()

// Login
await authService.login({ email, password })

// Register
await authService.register({ email, password, confirmPassword })

// Forgot password
await authService.forgotPassword({ email })

// Reset password
await authService.resetPassword({ email, token, newPassword, confirmNewPassword })

// Confirm email
await authService.confirmEmail({ userId, token })
```

### AccountService
```typescript
import { getAccountService } from '@/services'

const accountService = getAccountService()

// Get profile
const profile = await accountService.getProfile()

// Update profile
await accountService.updateProfile({ name: 'John' })

// Change password
await accountService.changePassword({
  currentPassword,
  newPassword,
  confirmNewPassword,
})

// Update email
await accountService.updateEmail({ newEmail })

// Delete account
await accountService.deleteAccount(password)
```

### PixelService
```typescript
import { getPixelService } from '@/services'

const pixelService = getPixelService()

// Get canvas (public)
const canvas = await pixelService.getCanvas()

// Get pixel (public)
const pixel = await pixelService.getPixel(x, y)

// Place pixel (requires auth)
await pixelService.placePixel({ x, y, color })

// Bulk place (requires premium)
await pixelService.bulkPlacePixels({ pixels: [...] })

// Export canvas
const blob = await pixelService.exportCanvas('png')
```

### ThroneService
```typescript
import { getThroneService } from '@/services'

const throneService = getThroneService()

// Get current holder (public)
const holder = await throneService.getCurrentHolder()

// Get leaderboard (public)
const leaderboard = await throneService.getLeaderboard(100)

// Place bid (requires auth)
await throneService.placeBid({ amount: 1000 })

// Get bid history
const history = await throneService.getUserBidHistory()
```

### AdminService
```typescript
import { getAdminService } from '@/services'

const adminService = getAdminService()

// Get users
const users = await adminService.getUsers({
  page: 1,
  pageSize: 20,
  search: 'john',
})

// Ban user
await adminService.banUser(userId, {
  reason: 'Spam',
  duration: 7, // days
})

// Get system stats
const stats = await adminService.getSystemStats()
```

## Permission Checking

### Before
```typescript
import { useSession } from 'next-auth/react'

function MyComponent() {
  const { data: session } = useSession()
  const isAdmin = session?.user?.role === 'admin'

  return isAdmin ? <AdminPanel /> : null
}
```

### After
```typescript
import { usePermissions } from '@/hooks/api'
import { RequireRole } from '@/components/auth'
import { Role } from '@/lib/permissions'

function MyComponent() {
  const { isAdmin, can } = usePermissions()

  return (
    <>
      {isAdmin && <AdminPanel />}
      
      {/* Or use components */}
      <RequireRole role={Role.ADMIN}>
        <AdminPanel />
      </RequireRole>
    </>
  )
}
```

## Error Handling

### Before
```typescript
try {
  const response = await fetch('/api/endpoint')
  if (!response.ok) {
    const error = await response.json()
    toast.error(error.message || 'Request failed')
    console.error('API Error:', error)
  }
} catch (error) {
  toast.error('Network error')
  console.error('Network Error:', error)
}
```

### After
```typescript
// Error handling is automatic!
// But if you need custom handling:

import { handleApiError } from '@/lib/api/errors'

try {
  await service.doSomething()
} catch (error) {
  const apiError = handleApiError(error, {
    showToast: true,     // Automatic user notification
    logError: true,      // Automatic logging
    customMessage: 'Custom error message',
  })
  
  // Access error details
  console.log(apiError.category)    // 'network', 'auth', etc.
  console.log(apiError.retryable)   // true/false
  console.log(apiError.userMessage) // User-friendly message
}
```

## Common Patterns

### Loading States
```typescript
// Before
const [loading, setLoading] = useState(false)

const handleClick = async () => {
  setLoading(true)
  try {
    await doSomething()
  } finally {
    setLoading(false)
  }
}

// After
const { mutate, loading } = useApiMutation(doSomething)

const handleClick = () => mutate()
```

### Optimistic Updates
```typescript
const { mutate } = useApiMutation(
  (data) => service.updateData(data),
  {
    onMutate: (data) => {
      // Update UI optimistically
      updateLocalState(data)
    },
    onSuccess: (result) => {
      // Confirmed, keep changes
    },
    onError: () => {
      // Revert optimistic update
      revertLocalState()
    },
  }
)
```

### Dependent Queries
```typescript
const { data: user } = useApiQuery('user', getUser)
const { data: posts } = useApiQuery(
  'user-posts',
  () => getPosts(user.id),
  {
    enabled: !!user, // Only fetch when user is loaded
  }
)
```

## Testing

### Before
```typescript
// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ data: 'test' }),
  })
)
```

### After
```typescript
// Mock axios client
import axios from 'axios'

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

mockedAxios.create.mockReturnValue({
  get: jest.fn().mockResolvedValue({ data: 'test' }),
  // ...
})
```

## Troubleshooting

### "Cannot find module '@/lib/api'"
Make sure you have the barrel exports set up:
```typescript
// src/lib/api/index.ts should exist and export everything
```

### "Session not found" errors
For server-side code, ensure you're using `createServerTokenGetter()`:
```typescript
attachAuthInterceptor(client, {
  getToken: createServerTokenGetter(),
})
```

### TypeScript errors with services
Ensure you're importing the correct types:
```typescript
import type { UserProfile } from '@/services/account.service'
```

## Benefits Summary

✅ **Less boilerplate** - No manual error handling, auth, or logging  
✅ **Type safety** - Full TypeScript support  
✅ **Automatic retries** - Network resilience built-in  
✅ **Better DX** - Cleaner, more maintainable code  
✅ **Performance** - Built-in caching and request deduplication  
✅ **Observability** - Integrated logging and error tracking  
✅ **Security** - Centralized auth and permission checking  

## Need Help?

- See [README_API_ARCHITECTURE.md](./README_API_ARCHITECTURE.md) for full documentation
- Check [src/services/](./src/services/) for service examples
- Look at [src/hooks/api/](./src/hooks/api/) for hook examples
