# API Architecture Documentation

This document describes the comprehensive axios-based API architecture implemented in the Pixel Client application.

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Core Components](#core-components)
- [Usage Guide](#usage-guide)
- [Error Handling](#error-handling)
- [Permissions System](#permissions-system)
- [Testing](#testing)

## Overview

The API architecture is built on axios and provides:

- ✅ **Factory Pattern** - Multiple specialized API clients (public, authenticated, admin)
- ✅ **Advanced Error Handling** - Categorized errors with user-friendly messages
- ✅ **Retry Logic** - Exponential backoff with idempotency checking
- ✅ **Full-Stack Permissions** - Route, API, and UI-level permission enforcement
- ✅ **Structured Logging** - Console (dev) and Sentry (prod) integration
- ✅ **Type Safety** - Full TypeScript support throughout

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      React Components                        │
└─────────────────────┬───────────────────────────────────────┘
                      │
              ┌───────┴────────┐
              │  React Hooks    │
              │  - useApi       │
              │  - useApiQuery  │
              │  - useApiMutation│
              └───────┬─────────┘
                      │
         ┌────────────┴──────────────┐
         │   Service Layer            │
         │  - AuthService             │
         │  - AccountService          │
         │  - PixelService            │
         │  - ThroneService           │
         │  - AdminService            │
         └────────────┬───────────────┘
                      │
         ┌────────────┴──────────────┐
         │   API Client Factory       │
         │  - Public Client           │
         │  - Authenticated Client    │
         │  - Admin Client            │
         └────────────┬───────────────┘
                      │
         ┌────────────┴──────────────┐
         │   Interceptors             │
         │  - Request                 │
         │  - Response                │
         │  - Error                   │
         │  - Auth                    │
         │  - Logging                 │
         │  - Retry                   │
         └────────────┬───────────────┘
                      │
                  Backend API
```

## Core Components

### 1. API Client Factory

Located in `src/lib/api/factory/`

Creates specialized axios clients:

```typescript
import { createPublicClient, createAuthenticatedClient, createAdminClient } from '@/lib/api/factory'

// Public client (no auth)
const publicClient = createPublicClient()

// Authenticated client (adds auth token)
const authClient = createAuthenticatedClient()

// Admin client (requires admin role)
const adminClient = createAdminClient()
```

### 2. Error Management

Located in `src/lib/api/errors/`

All errors are categorized and provide user-friendly messages:

```typescript
import { handleApiError, ApiError } from '@/lib/api/errors'

try {
  const data = await api.get('/endpoint')
} catch (error) {
  const apiError = handleApiError(error, {
    showToast: true,  // Show error notification
    logError: true,   // Log to console/Sentry
  })
  
  console.log(apiError.category)   // 'network', 'auth', 'validation', etc.
  console.log(apiError.userMessage) // User-friendly message
  console.log(apiError.retryable)   // Whether request can be retried
}
```

### 3. Services

Located in `src/services/`

Type-safe service classes for each domain:

```typescript
import { getAccountService, getPixelService } from '@/services'

// Get singleton instance
const accountService = getAccountService()

// Or create custom instance
const accountService = new AccountService(customClient)

// Use service methods
const profile = await accountService.getProfile()
const pixels = await pixelService.getUserPixels()
```

### 4. React Hooks

Located in `src/hooks/api/`

#### useApi - Generic API calls

```typescript
import { useApi } from '@/hooks/api'

function MyComponent() {
  const { data, loading, error, execute } = useApi({
    showErrorToast: true,
    onSuccess: (data) => console.log('Success!', data),
  })

  const handleSubmit = async () => {
    await execute(() => accountService.updateProfile({ name: 'John' }))
  }

  return <button onClick={handleSubmit} disabled={loading}>Submit</button>
}
```

#### useApiQuery - GET requests with caching

```typescript
import { useApiQuery } from '@/hooks/api'

function UserProfile() {
  const { data, loading, error, refetch } = useApiQuery(
    'user-profile',
    () => accountService.getProfile(),
    {
      enabled: true,
      refetchInterval: 30000, // Refetch every 30s
      cacheDuration: 5 * 60 * 1000, // Cache for 5 minutes
    }
  )

  if (loading) return <Spinner />
  if (error) return <Error message={error.userMessage} />
  return <Profile data={data} />
}
```

#### useApiMutation - POST/PUT/DELETE

```typescript
import { useApiMutation } from '@/hooks/api'

function UpdateProfileForm() {
  const { mutate, loading, error } = useApiMutation(
    (data) => accountService.updateProfile(data),
    {
      showSuccessToast: true,
      successMessage: 'Profile updated successfully!',
      onSuccess: () => {
        // Invalidate cache, redirect, etc.
      },
    }
  )

  const handleSubmit = (formData) => {
    mutate(formData)
  }

  return <Form onSubmit={handleSubmit} loading={loading} />
}
```

### 5. Permissions System

Located in `src/lib/permissions/`

#### Permission Types

```typescript
// Roles
enum Role {
  GUEST = 'guest',
  USER = 'user',
  PREMIUM = 'premium',
  MODERATOR = 'moderator',
  ADMIN = 'admin',
}

// Permissions
enum Permission {
  PIXEL_PLACE = 'pixel:place',
  THRONE_BID = 'throne:bid',
  USER_MANAGE = 'user:manage',
  // ... and more
}
```

#### usePermissions Hook

```typescript
import { usePermissions } from '@/hooks/api'
import { Permission, Role } from '@/lib/permissions'

function MyComponent() {
  const { can, is, isAdmin, isAuthenticated } = usePermissions()

  return (
    <>
      {can(Permission.PIXEL_PLACE) && <PlacePixelButton />}
      {is(Role.ADMIN) && <AdminPanel />}
      {isAuthenticated && <UserMenu />}
    </>
  )
}
```

#### Permission Components

```typescript
import { RequirePermission, RequireRole, ProtectedAction } from '@/components/auth'

// Show only if user has permission
<RequirePermission permission={Permission.PIXEL_PLACE}>
  <PlacePixelButton />
</RequirePermission>

// Show only if user has role
<RequireRole role={Role.ADMIN}>
  <AdminPanel />
</RequireRole>

// Disable instead of hiding
<ProtectedAction
  permission={Permission.THRONE_BID}
  disableWhenDenied
  deniedMessage="Premium membership required"
>
  <Button>Place Bid</Button>
</ProtectedAction>
```

## Usage Guide

### Client-Side Usage

```typescript
// 1. Use hooks for React components
import { useApiQuery, useApiMutation } from '@/hooks/api'

function MyComponent() {
  // GET request with caching
  const { data } = useApiQuery('pixels', () => pixelService.getCanvas())

  // POST request
  const { mutate } = useApiMutation((data) => pixelService.placePixel(data))

  return <Canvas data={data} onPlace={mutate} />
}
```

### Server-Side Usage (Server Actions, API Routes)

```typescript
'use server'

import { AccountService } from '@/services'
import { createAuthenticatedClient } from '@/lib/api/factory'
import { attachAuthInterceptor, createServerTokenGetter } from '@/lib/api/interceptors'

export async function updateUserProfile(data: UpdateProfileData) {
  // Create server-side authenticated client
  const client = createAuthenticatedClient()
  attachAuthInterceptor(client, {
    getToken: createServerTokenGetter(),
  })

  const accountService = new AccountService(client)

  try {
    const profile = await accountService.updateProfile(data)
    return { success: true, data: profile }
  } catch (error) {
    const apiError = handleApiErrorSilently(error)
    return { success: false, error: apiError.userMessage }
  }
}
```

## Error Handling

### Error Categories

- **NETWORK** - Connection issues, timeouts
- **AUTH** - Unauthorized, token expired
- **VALIDATION** - Invalid input
- **PERMISSION** - Insufficient permissions
- **SERVER** - 5xx errors
- **RATE_LIMIT** - Too many requests
- **CLIENT** - 4xx errors
- **UNKNOWN** - Unexpected errors

### Retry Logic

Automatic retries with exponential backoff:

```typescript
// Configured in src/lib/api/config/api.config.ts
{
  retry: {
    maxAttempts: 3,
    initialDelay: 1000, // 1 second
    backoffMultiplier: 2,
    maxDelay: 30000, // 30 seconds
  }
}
```

Retryable errors:
- Network errors
- 5xx server errors
- 429 rate limit errors

Non-retryable errors:
- 4xx client errors (except 401, 429)
- Validation errors

## Logging

### Development

Console logging with detailed request/response information:

```
🚀 POST /pixels
Request: { method: 'POST', url: '/pixels', data: {...} }

🟢 201 POST /pixels (245ms)
Response: { status: 201, data: {...} }
```

### Production

Sentry integration for error tracking:
- API errors logged with context
- Performance tracking
- Error breadcrumbs
- User session replay (on errors)

## Environment Variables

```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001/api
API_BASE_URL=http://localhost:3001/api

# Auth Configuration
AUTH_SECRET=your-secret-here
OPENIDDICT_ISSUER=http://localhost:3001/
OPENIDDICT_CLIENT_ID=pixel_client
OPENIDDICT_CLIENT_SECRET=your-client-secret

# Sentry Configuration
NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn
```

## Testing

### Unit Tests

```typescript
import { mapAxiosError } from '@/lib/api/errors'
import { AxiosError } from 'axios'

describe('Error Mapping', () => {
  it('should map 401 to UnauthorizedError', () => {
    const axiosError = new AxiosError('Unauthorized', '401', undefined, undefined, {
      status: 401,
      data: { message: 'Token expired' },
    })

    const error = mapAxiosError(axiosError)
    expect(error).toBeInstanceOf(UnauthorizedError)
  })
})
```

### Integration Tests

```typescript
import { createPublicClient } from '@/lib/api/factory'

describe('API Client', () => {
  it('should retry on network error', async () => {
    const client = createPublicClient()
    // Test retry logic
  })
})
```

## Best Practices

1. **Use services** - Don't call axios directly, use service classes
2. **Use hooks** - In React components, use useApiQuery/useApiMutation
3. **Handle errors** - Let the error system handle errors automatically
4. **Check permissions** - Use permission hooks/components
5. **Log appropriately** - Use the logging system, don't use console.log directly
6. **Type everything** - Use TypeScript interfaces for all API requests/responses

## Migration Guide

If migrating from fetch-based code:

```typescript
// Before (fetch)
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

// After (axios service)
const service = getAccountService()
const result = await service.updateProfile(data)
// Error handling, auth, retries, logging all automatic!
```

## Support

For questions or issues, see:
- [API Error Reference](./src/lib/api/errors/ErrorCatalog.ts)
- [Service Examples](./src/services/)
- [Hook Examples](./src/hooks/api/)
