# Pixel Client Architecture Guide

A comprehensive guide for the Next.js App Router architecture, service patterns, and state management.

---

## Table of Contents

1. [Folder Structure](#folder-structure)
2. [Service Pattern](#service-pattern)
3. [API Architecture](#api-architecture)
4. [Hooks](#hooks)
5. [State Management (Zustand)](#state-management-zustand)
6. [Quick Reference](#quick-reference)

---

## Folder Structure

### Goals

- **Feature modularity** – Each domain/feature is a first-class module with clear public APIs
- **Hard client/server boundaries** – Server-only code is physically isolated
- **Replaceability** – Swapping API clients, auth, caching is localized
- **Scalability** – Supports dozens/hundreds of routes without "shared soup"

### Structure

```
src/
├─ app/                           # Next.js routes (thin composition layer)
│  ├─ (public)/                   # Public routes
│  ├─ (app)/                      # Authenticated app shell routes
│  ├─ api/                        # Route handlers
│  ├─ layout.tsx
│  └─ page.tsx
│
├─ modules/                       # Feature modules (domain-aligned)
│  └─ <feature>/
│     ├─ ui/                      # React components (client where needed)
│     ├─ server/                  # Server actions, loaders, mutations
│     ├─ application/             # Use-cases, orchestration, policies
│     ├─ domain/                  # Entities, value objects, domain services
│     ├─ infrastructure/          # Module-specific API adapters, mappers
│     ├─ contracts/               # DTOs, schemas (zod), API types
│     ├─ __tests__/               # Module tests
│     └─ index.ts                 # Module public exports only
│
├─ shared/                        # Cross-cutting, reusable building blocks
│  ├─ ui/                         # Design system primitives (Button, Modal)
│  ├─ hooks/                      # Generic hooks
│  ├─ lib/                        # Utilities (date, format, fp helpers)
│  ├─ types/                      # Global TS types (sparingly)
│  ├─ contracts/                  # Shared schemas/DTOs
│  └─ index.ts
│
├─ server/                        # Server-only cross-cutting infrastructure
│  ├─ http/
│  │  ├─ clients/                 # Axios/fetch clients, factories
│  │  ├─ interceptors/            # Auth refresh, logging, retry
│  │  ├─ errors/                  # Normalized API errors
│  │  └─ index.ts
│  ├─ auth/                       # Sessions, tokens, server auth helpers
│  ├─ cache/                      # Cache policies, tags, revalidation
│  ├─ observability/              # Logging, tracing, metrics
│  ├─ config/                     # Env parsing, runtime config
│  └─ index.ts
│
├─ styles/                        # Global styles, tokens
└─ middleware.ts                  # Next middleware

public/
tests/                            # e2e (Playwright/Cypress), test utils
scripts/                          # One-off maintenance scripts
tooling/                          # ESLint rules, generators
```

### Key Conventions

| Rule | Description |
|------|-------------|
| **Module imports** | Only import via `src/modules/<feature>/index.ts` |
| **Server isolation** | Keep secrets/tokens in `src/server/**` or module `server/infrastructure` |
| **Consistent shape** | Same folder layout across all modules |
| **Explicit contracts** | DTOs and schemas in `contracts/` at boundaries |
| **Curated shared** | Require explicit reason to move code to `shared/` |

---

## Service Pattern

### Architecture Overview

```
Browser (Client Components)
         │ Next.js RPC
         ↓
┌─────────────────────────────────────────────────────────┐
│                    Next.js Server                        │
│  1. Server Actions     → src/modules/<feature>/server/   │
│  2. Application Layer  → src/modules/<feature>/application/ │
│  3. Service Classes    → src/modules/<feature>/infrastructure/*.service.ts │
│  4. HTTP Clients       → src/server/http/**              │
└─────────────────────────────────────────────────────────┘
         │ HTTP
         ↓
      Backend API
```

### Layer Mapping

| Layer | Location | Responsibility |
|-------|----------|----------------|
| **Server Actions** | `modules/<feature>/server/actions/*.ts` | `"use server"`, revalidatePath, form handling |
| **Application** | `modules/<feature>/application/*.ts` | Orchestration, policies, domain ↔ DTO |
| **Services** | `modules/<feature>/infrastructure/*.service.ts` | API endpoints, business logic |
| **HTTP Clients** | `server/http/**` | Client creation, interceptors, retries |

### Quick Implementation

**1. Service Class** (`modules/billing/infrastructure/billing.service.ts`):
```typescript
export class BillingService extends BaseService {
  async getInvoices(): Promise<Invoice[]> {
    return this.client.get<Invoice[]>('/billing/invoices').then(r => r.data)
  }
  async createInvoice(data: CreateInvoiceDto): Promise<Invoice> {
    return this.client.post<Invoice>('/billing/invoices', data).then(r => r.data)
  }
}
```

**2. Application Layer** (`modules/billing/application/billing.ts`):
```typescript
export async function createInvoice(data: CreateInvoiceDto): Promise<ServiceResult<Invoice>> {
  try {
    const service = new BillingService(createServerAuthenticatedClient())
    return { success: true, data: await service.createInvoice(data) }
  } catch (error) {
    return { success: false, error: handleApiErrorSilently(error).userMessage }
  }
}
```

**3. Server Action** (`modules/billing/server/actions/billing.ts`):
```typescript
"use server"
import { revalidatePath } from "next/cache"
import { createInvoice } from "../../application/billing"

export async function createInvoiceAction(data: CreateInvoiceDto) {
  const result = await createInvoice(data)
  if (result.success) revalidatePath("/billing")
  return result
}
```

---

## API Architecture

### Client Factory

```typescript
import { createPublicClient, createAuthenticatedClient } from '@/server/http'

const publicClient = createPublicClient()        // No auth
const authClient = createAuthenticatedClient()   // Adds auth token
```

### Error Categories

| Category | Examples | Retryable |
|----------|----------|-----------|
| `NETWORK` | Connection issues, timeouts | ✅ |
| `AUTH` | 401 Unauthorized, token expired | ❌ |
| `VALIDATION` | 400 Invalid input | ❌ |
| `RATE_LIMIT` | 429 Too many requests | ✅ |
| `SERVER` | 5xx errors | ✅ |

### Error Handling

```typescript
import { handleApiError } from '@/server/http/errors'

try {
  await service.doSomething()
} catch (error) {
  const apiError = handleApiError(error, { showToast: true, logError: true })
  // apiError.category, apiError.userMessage, apiError.retryable
}
```

---

## Hooks

### useApiQuery – Fetch Data

```typescript
const { data, loading, error, refetch } = useApiQuery(
  'billing-invoices',
  () => getInvoicesAction(),
  { refetchInterval: 30000, cacheDuration: 5 * 60 * 1000 }
)
```

### useApiMutation – Modify Data

```typescript
const { mutate, loading } = useApiMutation(
  (data) => createInvoiceAction(data),
  {
    showSuccessToast: true,
    successMessage: 'Invoice created!',
    onSuccess: () => clearQuery('billing-invoices')
  }
)
```

### Common Patterns

```typescript
// Dependent queries
const { data: user } = useApiQuery('user', getUserAction)
const { data: orders } = useApiQuery('orders', getOrdersAction, { enabled: !!user })

// List + Create pattern
const { data: items } = useApiQuery('items', getItemsAction)
const { mutate: create } = useApiMutation(createItemAction, {
  onSuccess: () => clearQuery('items')
})
```

---

## State Management (Zustand)

### When to Use

| Use Case | Solution |
|----------|----------|
| UI preferences (theme, sidebar) | Zustand (persisted) |
| Viewport, zoom, selections | Zustand (memory) |
| Server data (users, invoices) | Hooks + Actions |
| Authentication | NextAuth |
| Local form state | `useState` |

### Creating a Store

```typescript
// shared/stores/useUiStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UiState {
  theme: 'light' | 'dark'
  sidebarOpen: boolean
  setTheme: (t: 'light' | 'dark') => void
  toggleSidebar: () => void
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      theme: 'dark',
      sidebarOpen: true,
      setTheme: (theme) => set({ theme }),
      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
    }),
    { name: 'ui-store' }
  )
)
```

### Usage

```typescript
'use client'
import { useUiStore } from '@/shared/stores'

function Header() {
  const { theme, setTheme, toggleSidebar } = useUiStore()
  return (
    <header>
      <button onClick={toggleSidebar}>Menu</button>
      <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
        {theme}
      </button>
    </header>
  )
}
```

---

## Quick Reference

### Do's & Don'ts

| ✅ Do | ❌ Don't |
|-------|---------|
| Create new service instance per request | Use singleton services (security risk) |
| Use `handleApiErrorSilently()` | Call axios directly from components |
| Add `revalidatePath()` after mutations | Expose backend URL to browser |
| Import modules via `index.ts` | Skip error handling |
| Keep `shared/` curated | Dump everything in shared |

### File Naming

| Type | Convention | Example |
|------|------------|---------|
| Directories | `kebab-case` | `user-settings/` |
| Components | `PascalCase` | `UserProfile.tsx` |
| Utilities | `camelCase` | `formatDate.ts` |
| Constants | `SCREAMING_SNAKE_CASE` | `MAX_FILE_SIZE` |

### Next.js Special Files

| File | Purpose | Server/Client |
|------|---------|---------------|
| `layout.tsx` | Shared UI wrapping children | Server |
| `page.tsx` | Route UI | Server |
| `loading.tsx` | Loading state (Suspense) | Server |
| `error.tsx` | Error boundary | **Client** |
| `route.ts` | API endpoint | Server |

### Route Conventions

| Pattern | Purpose |
|---------|---------|
| `(group)` | Route group (no URL impact) |
| `_folder` | Private folder (excluded from routing) |
| `[param]` | Dynamic segment |
| `[...param]` | Catch-all |
| `@folder` | Parallel routes |

---

## Monorepo Ready (Optional)

For multiple apps:

```
apps/
├─ web/           # Main Next.js app
├─ admin/
└─ marketing/

packages/
├─ ui/            # Shared design system
├─ config/        # ESLint/tsconfig presets
└─ contracts/     # Shared schemas/DTOs
```

---

*Last Updated: December 2024*
