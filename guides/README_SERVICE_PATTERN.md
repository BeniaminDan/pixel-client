# Service Pattern Guide

This guide explains how to implement the server-side service pattern used in this project for API integration.

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Where Code Runs](#where-code-runs)
- [Step-by-Step Guide](#step-by-step-guide)
- [Complete Example](#complete-example)
- [Best Practices](#best-practices)
- [Quick Reference](#quick-reference)

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Browser (Client)                          │
│  Components call server actions                              │
└───────────────────────────┬─────────────────────────────────┘
                            │ Next.js RPC
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                  Next.js Server                              │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ 1. Server Actions (features/**/api/actions/*.ts)     │   │
│  │    - Entry point                                      │   │
│  │    - Path revalidation                                │   │
│  │    - Form handling                                    │   │
│  └────────────────────┬─────────────────────────────────┘   │
│                       │                                       │
│  ┌────────────────────▼─────────────────────────────────┐   │
│  │ 2. Service Layer (features/**/api/services/*.ts)     │   │
│  │    - Error handling                                   │   │
│  │    - Client setup                                     │   │
│  │    - Auth management                                  │   │
│  └────────────────────┬─────────────────────────────────┘   │
│                       │                                       │
│  ┌────────────────────▼─────────────────────────────────┐   │
│  │ 3. Service Classes (services/*.service.ts)           │   │
│  │    - API endpoints                                    │   │
│  │    - Business logic                                   │   │
│  │    - Reusable methods                                 │   │
│  └────────────────────┬─────────────────────────────────┘   │
│                       │                                       │
│  ┌────────────────────▼─────────────────────────────────┐   │
│  │ 4. Axios Clients (lib/api/factory/*.ts)              │   │
│  │    - HTTP configuration                               │   │
│  │    - Interceptors                                     │   │
│  │    - Token refresh                                    │   │
│  └────────────────────┬─────────────────────────────────┘   │
│                       │ HTTP Request                          │
└───────────────────────┼─────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│                    Backend API                               │
│  Your backend service (OpenIddict, ASP.NET, etc.)           │
└─────────────────────────────────────────────────────────────┘
```

---

## Where Code Runs

| Layer | Location | Runs On |
|-------|----------|---------|
| **Client Components** | `app/**/*.tsx` | 🌐 Browser |
| **Server Actions** | `features/**/api/actions/*.ts` | 🖥️ Next.js Server |
| **Service Layer** | `features/**/api/services/*.ts` | 🖥️ Next.js Server |
| **Service Classes** | `services/*.service.ts` | 🖥️ Next.js Server |
| **Axios Clients** | `lib/api/factory/*.ts` | 🖥️ Next.js Server |

**Important:** All axios HTTP requests happen on the **Next.js server**, never in the browser!

---

## Step-by-Step Guide

### Step 1: Create the Service Class

**File:** `src/services/your-feature.service.ts`

```typescript
/**
 * @fileoverview YourFeature service for API operations
 */

import type { AxiosInstance } from 'axios'
import { BaseService } from './base.service'
import { createPublicClient } from '@/lib/api/factory'

// ============================================================================
// Types
// ============================================================================

export interface YourModel {
  id: string
  name: string
  createdAt: string
}

export interface CreateYourModelRequest {
  name: string
}

// ============================================================================
// Service Class
// ============================================================================

export class YourFeatureService extends BaseService {
  /**
   * Get all items (public endpoint)
   */
  async getAll(): Promise<YourModel[]> {
    const publicClient = createPublicClient()
    const response = await publicClient.get<YourModel[]>('/your-feature')
    return response.data
  }

  /**
   * Get single item (public endpoint)
   */
  async getById(id: string): Promise<YourModel> {
    const publicClient = createPublicClient()
    const response = await publicClient.get<YourModel>(`/your-feature/${id}`)
    return response.data
  }

  /**
   * Create item (requires authentication)
   */
  async create(data: CreateYourModelRequest): Promise<YourModel> {
    const response = await this.client.post<YourModel>('/your-feature', data)
    return response.data
  }

  /**
   * Update item (requires authentication)
   */
  async update(id: string, data: Partial<CreateYourModelRequest>): Promise<YourModel> {
    const response = await this.client.put<YourModel>(`/your-feature/${id}`, data)
    return response.data
  }

  /**
   * Delete item (requires authentication)
   */
  async delete(id: string): Promise<void> {
    await this.client.delete(`/your-feature/${id}`)
  }
}
```

**Key Points:**
- ✅ Extends `BaseService` for authenticated methods
- ✅ Use `this.client` for authenticated endpoints
- ✅ Use `createPublicClient()` for public endpoints
- ✅ Define TypeScript interfaces for all data

---

### Step 2: Create the Service Layer

**File:** `src/features/your-feature/api/services/your-feature.ts`

```typescript
/**
 * @fileoverview YourFeature service layer for server actions
 */

import type { ServiceResult } from "@/features/auth/types"
import { YourFeatureService } from "@/services/your-feature.service"
import { createAuthenticatedClient, createPublicClient } from "@/lib/api/factory"
import { attachAuthInterceptor, createServerTokenGetter } from "@/lib/api/interceptors"
import { handleApiErrorSilently } from "@/lib/api/errors"
import type { YourModel, CreateYourModelRequest } from "@/services/your-feature.service"

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Create server-side authenticated client with token getter and refresh
 */
function createServerAuthenticatedClient() {
  const client = createAuthenticatedClient()
  attachAuthInterceptor(client, {
    getToken: createServerTokenGetter(),
    refreshToken: async () => {
      const { refreshServerAccessToken } = await import('@/lib/auth')
      return refreshServerAccessToken()
    },
    autoRefresh: true,
  })
  return client
}

/**
 * Create server-side service instance
 */
function createServerYourFeatureService() {
  return new YourFeatureService(createServerAuthenticatedClient())
}

// ============================================================================
// Public (unauthenticated) endpoints
// ============================================================================

/**
 * Get all items
 */
export async function getAll(): Promise<ServiceResult<YourModel[]>> {
  try {
    const service = new YourFeatureService(createPublicClient())
    const data = await service.getAll()
    return { success: true, data }
  } catch (error) {
    const apiError = handleApiErrorSilently(error)
    return { success: false, error: apiError.userMessage }
  }
}

/**
 * Get single item by ID
 */
export async function getById(id: string): Promise<ServiceResult<YourModel>> {
  try {
    const service = new YourFeatureService(createPublicClient())
    const data = await service.getById(id)
    return { success: true, data }
  } catch (error) {
    const apiError = handleApiErrorSilently(error)
    return { success: false, error: apiError.userMessage }
  }
}

// ============================================================================
// Authenticated endpoints
// ============================================================================

/**
 * Create new item
 */
export async function create(data: CreateYourModelRequest): Promise<ServiceResult<YourModel>> {
  try {
    const service = createServerYourFeatureService()
    const item = await service.create(data)
    return { success: true, data: item }
  } catch (error) {
    const apiError = handleApiErrorSilently(error)
    return { success: false, error: apiError.userMessage, errors: apiError.details }
  }
}

/**
 * Update existing item
 */
export async function update(
  id: string,
  data: Partial<CreateYourModelRequest>
): Promise<ServiceResult<YourModel>> {
  try {
    const service = createServerYourFeatureService()
    const item = await service.update(id, data)
    return { success: true, data: item }
  } catch (error) {
    const apiError = handleApiErrorSilently(error)
    return { success: false, error: apiError.userMessage, errors: apiError.details }
  }
}

/**
 * Delete item
 */
export async function deleteItem(id: string): Promise<ServiceResult> {
  try {
    const service = createServerYourFeatureService()
    await service.delete(id)
    return { success: true }
  } catch (error) {
    const apiError = handleApiErrorSilently(error)
    return { success: false, error: apiError.userMessage }
  }
}
```

**Key Points:**
- ✅ Always copy `createServerAuthenticatedClient()` - it handles token refresh
- ✅ Create new service instance for each function call
- ✅ Use `handleApiErrorSilently()` for error handling
- ✅ Return `ServiceResult<T>` type

---

### Step 3: Create Server Actions

**File:** `src/features/your-feature/api/actions/your-feature.ts`

```typescript
"use server"

import { revalidatePath } from "next/cache"
import {
  getAll,
  getById,
  create,
  update,
  deleteItem,
} from "@/features/your-feature/api/services/your-feature"

import type { CreateYourModelRequest } from "@/services/your-feature.service"
import type { ServiceResult } from "@/features/auth/types"

// ============================================================================
// Public (unauthenticated) actions
// ============================================================================

/**
 * Get all items action
 */
export async function getAllAction() {
  return getAll()
}

/**
 * Get item by ID action
 */
export async function getByIdAction(id: string) {
  return getById(id)
}

// ============================================================================
// Authenticated actions
// ============================================================================

/**
 * Create item action
 */
export async function createAction(data: CreateYourModelRequest): Promise<ServiceResult<any>> {
  const result = await create(data)

  if (result.success) {
    revalidatePath("/your-feature")
  }

  return result
}

/**
 * Create item form action (for HTML forms)
 */
export async function createFormAction(formData: FormData): Promise<ServiceResult<any>> {
  const name = formData.get("name") as string

  if (!name) {
    return { success: false, error: "Name is required" }
  }

  return createAction({ name })
}

/**
 * Update item action
 */
export async function updateAction(
  id: string,
  data: Partial<CreateYourModelRequest>
): Promise<ServiceResult<any>> {
  const result = await update(id, data)

  if (result.success) {
    revalidatePath("/your-feature")
    revalidatePath(`/your-feature/${id}`)
  }

  return result
}

/**
 * Delete item action
 */
export async function deleteAction(id: string): Promise<ServiceResult> {
  const result = await deleteItem(id)

  if (result.success) {
    revalidatePath("/your-feature")
  }

  return result
}
```

**Key Points:**
- ✅ Add `"use server"` directive at the top
- ✅ Call service layer functions
- ✅ Add `revalidatePath()` after mutations
- ✅ Create form-specific actions if needed

---

### Step 4: Use in Components

**File:** `src/app/your-feature/page.tsx`

```typescript
'use client'

import { useState, useEffect } from 'react'
import { getAllAction, createAction, deleteAction } from '@/features/your-feature/api/actions/your-feature'
import type { YourModel } from '@/services/your-feature.service'

export default function YourFeaturePage() {
  const [items, setItems] = useState<YourModel[]>([])
  const [loading, setLoading] = useState(false)

  // Load items
  useEffect(() => {
    async function loadItems() {
      const result = await getAllAction()
      if (result.success && result.data) {
        setItems(result.data)
      }
    }
    loadItems()
  }, [])

  // Create item
  const handleCreate = async () => {
    setLoading(true)
    const result = await createAction({ name: 'New Item' })
    
    if (result.success) {
      // Refresh the list
      const refreshResult = await getAllAction()
      if (refreshResult.success && refreshResult.data) {
        setItems(refreshResult.data)
      }
    } else {
      alert(result.error)
    }
    setLoading(false)
  }

  // Delete item
  const handleDelete = async (id: string) => {
    const result = await deleteAction(id)
    
    if (result.success) {
      setItems(items.filter(item => item.id !== id))
    } else {
      alert(result.error)
    }
  }

  return (
    <div>
      <h1>Your Feature</h1>
      
      <button onClick={handleCreate} disabled={loading}>
        Create New
      </button>

      <ul>
        {items.map(item => (
          <li key={item.id}>
            {item.name}
            <button onClick={() => handleDelete(item.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
```

**Key Points:**
- ✅ Import actions from `features/**/api/actions/*`
- ✅ Handle `ServiceResult` response
- ✅ Check `result.success` before using `result.data`
- ✅ Display `result.error` for user feedback

---

## Complete Example

See these working implementations in the codebase:

### Pixel Feature
- **Service Class:** `src/services/pixel.service.ts`
- **Service Layer:** `src/features/pixel/api/services/pixel.ts`
- **Server Actions:** `src/features/pixel/api/actions/pixel.ts`

### Throne Feature
- **Service Class:** `src/services/throne.service.ts`
- **Service Layer:** `src/features/throne/api/services/throne.ts`
- **Server Actions:** `src/features/throne/api/actions/throne.ts`

### Admin Feature
- **Service Class:** `src/services/admin.service.ts`
- **Service Layer:** `src/features/admin/api/services/admin.ts`
- **Server Actions:** `src/features/admin/api/actions/admin.ts`

---

## Best Practices

### ✅ DO

- **Create new service instances** for each request (don't use singletons)
- **Use `createServerAuthenticatedClient()`** for authenticated endpoints
- **Use `createPublicClient()`** for public endpoints
- **Always handle errors** with `handleApiErrorSilently()`
- **Return `ServiceResult<T>`** from service layer functions
- **Add `revalidatePath()`** after mutations in actions
- **Export TypeScript types** from service classes
- **Use `"use server"`** directive in action files

### ❌ DON'T

- **Don't create singleton service instances** (security risk!)
- **Don't call axios directly** from components or actions
- **Don't expose backend API URL** to the browser
- **Don't skip error handling**
- **Don't forget to revalidate paths** after mutations
- **Don't mix authenticated and public clients**
- **Don't use `any` types** without good reason

---

## Quick Reference

### Service Layer Template

```typescript
function createServerAuthenticatedClient() {
  const client = createAuthenticatedClient()
  attachAuthInterceptor(client, {
    getToken: createServerTokenGetter(),
    refreshToken: async () => {
      const { refreshServerAccessToken } = await import('@/lib/auth')
      return refreshServerAccessToken()
    },
    autoRefresh: true,
  })
  return client
}

export async function yourFunction(data: YourData): Promise<ServiceResult<T>> {
  try {
    const service = new YourService(createServerAuthenticatedClient())
    const result = await service.method(data)
    return { success: true, data: result }
  } catch (error) {
    const apiError = handleApiErrorSilently(error)
    return { success: false, error: apiError.userMessage, errors: apiError.details }
  }
}
```

### Server Action Template

```typescript
"use server"

import { revalidatePath } from "next/cache"

export async function yourAction(data: YourData): Promise<ServiceResult<any>> {
  const result = await yourServiceFunction(data)

  if (result.success) {
    revalidatePath("/your-path")
  }

  return result
}
```

### Component Usage Template

```typescript
'use client'

const result = await yourAction(data)

if (result.success) {
  // Use result.data
} else {
  // Show result.error
}
```

---

## Architecture Benefits

✅ **Security:** API credentials never exposed to browser  
✅ **Performance:** Server-to-server requests are faster  
✅ **Type Safety:** Full TypeScript support  
✅ **Error Handling:** Consistent error responses  
✅ **Token Refresh:** Automatic token renewal  
✅ **Testing:** Each layer can be tested independently  
✅ **Maintainability:** Clear separation of concerns  

---

## Need Help?

- See existing implementations in `src/features/pixel/`, `src/features/throne/`, `src/features/admin/`
- Check `README_API_ARCHITECTURE.md` for detailed API documentation
- Review `walkthrough.md` for recent integration examples
