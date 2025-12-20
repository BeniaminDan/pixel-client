# Pixel Client Architecture Guide

> Next.js 15+ frontend architecture for API-consuming applications.  
> **No backend code** — this project exclusively consumes external APIs.

---

## Quick Navigation

| Section | Purpose |
|---------|---------|
| [Folder Structure](#folder-structure) | Project organization |
| [Module Anatomy](#module-anatomy) | Inside a feature module |
| [Data Flow](#data-flow) | How requests move through layers |
| [Quick Reference](#quick-reference) | Cheatsheets & conventions |

---

## Folder Structure

```
src/
├── app/                              # Routes only (thin layer)
│   ├── (public)/                     # Unauthenticated routes
│   ├── (app)/                        # Authenticated app routes
│   ├── api/                          # Route handlers (webhooks, etc.)
│   ├── layout.tsx
│   └── page.tsx
│
├── modules/                          # Feature modules
│   └── <feature>/
│       ├── ui/                       # Client React code
│       │   ├── components/
│       │   ├── hooks/
│       │   └── stores/               # Zustand stores
│       ├── server/                   # Server Actions
│       ├── application/              # Use-cases & orchestration
│       ├── infrastructure/           # Service classes (API calls)
│       ├── contracts/                # DTOs, Zod schemas, types
│       └── index.ts                  # Public exports
│
├── shared/                           # Cross-cutting code
│   ├── ui/                           # Design system (Button, Modal)
│   ├── hooks/                        # Generic hooks (useDebounce)
│   ├── stores/                       # UI stores (theme, sidebar)
│   ├── lib/                          # Utilities (format, helpers)
│   └── contracts/                    # Shared DTOs/schemas
│
├── server/                           # Server-only infrastructure
│   ├── http/                         # HTTP client layer
│   │   ├── clients/                  # Client factories
│   │   ├── interceptors/             # Auth, retry, logging
│   │   └── errors/                   # API error handling
│   ├── auth/                         # NextAuth, sessions, tokens
│   └── config/                       # Environment, runtime config
│
├── styles/
└── middleware.ts
```

### Key Principles

| Principle | Rule |
|-----------|------|
| **Module isolation** | Import only via `@/modules/<feature>` barrel |
| **Server boundary** | Secrets & tokens only in `src/server/` |
| **Consistent shape** | Every module has the same internal folders |
| **Curated shared** | Code must earn its place in `shared/` |

---

## Module Anatomy

Each module follows **Clean Architecture** adapted for Next.js:

```
modules/billing/
├── ui/
│   ├── components/
│   │   ├── InvoiceCard.tsx
│   │   └── InvoiceList.tsx
│   ├── hooks/
│   │   └── useInvoiceFilters.ts
│   └── stores/
│       └── useBillingStore.ts
│
├── server/
│   └── actions/
│       ├── get-invoices.action.ts
│       └── create-invoice.action.ts
│
├── application/
│   ├── get-invoices.use-case.ts
│   └── create-invoice.use-case.ts
│
├── infrastructure/
│   └── billing.service.ts
│
├── contracts/
│   ├── invoice.dto.ts
│   └── invoice.schema.ts
│
└── index.ts
```

### Layer Responsibilities

| Layer | Location | Does | Does NOT |
|-------|----------|------|----------|
| **UI** | `ui/` | React components, hooks, stores | API calls, business logic |
| **Server Actions** | `server/` | `"use server"`, form handling, revalidation | Business logic, HTTP calls |
| **Application** | `application/` | Orchestration, validation, error handling | Direct HTTP, React code |
| **Infrastructure** | `infrastructure/` | API endpoint wrapping, service classes | Business decisions |
| **Contracts** | `contracts/` | DTOs, Zod schemas, type definitions | Any logic |

---

## Data Flow

### Request Lifecycle

```
┌─────────────────────────────────────────────────────────────────────────┐
│  CLIENT                                                                  │
│  └── Component calls Server Action                                       │
└──────────────────────────────────┬──────────────────────────────────────┘
                                   │ Next.js RPC
                                   ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  SERVER ACTION              modules/<feature>/server/                    │
│  • "use server"                                                          │
│  • Parse/validate input                                                  │
│  • Call application layer                                                │
│  • revalidatePath() after mutations                                      │
└──────────────────────────────────┬──────────────────────────────────────┘
                                   ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  APPLICATION LAYER          modules/<feature>/application/               │
│  • Orchestrate services                                                  │
│  • Apply business rules                                                  │
│  • Transform domain ↔ DTO                                                │
│  • Unified error handling                                                │
└──────────────────────────────────┬──────────────────────────────────────┘
                                   ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  SERVICE CLASS              modules/<feature>/infrastructure/            │
│  • Wrap API endpoints                                                    │
│  • Use shared HTTP client                                                │
│  • Return raw API responses                                              │
└──────────────────────────────────┬──────────────────────────────────────┘
                                   ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  HTTP CLIENT                src/server/http/                             │
│  • Configured axios/fetch                                                │
│  • Auth token injection                                                  │
│  • Retry logic, interceptors                                             │
└──────────────────────────────────┬──────────────────────────────────────┘
                                   │ HTTP
                                   ▼
                              External API
```

### Code Example: Complete Flow

**1. Service Class** — wraps API endpoints

```typescript
// modules/billing/infrastructure/billing.service.ts
export class BillingService extends BaseService {
  async getInvoices(): Promise<Invoice[]> {
    return this.client.get<Invoice[]>('/billing/invoices').then(r => r.data)
  }

  async createInvoice(data: CreateInvoiceDto): Promise<Invoice> {
    return this.client.post<Invoice>('/billing/invoices', data).then(r => r.data)
  }
}
```

**2. Application Layer** — orchestration & error handling

```typescript
// modules/billing/application/create-invoice.use-case.ts
import { BillingService } from '../infrastructure/billing.service'
import { createServerAuthenticatedClient } from '@/server/http'

export async function createInvoice(data: CreateInvoiceDto): Promise<ServiceResult<Invoice>> {
  try {
    const service = new BillingService(createServerAuthenticatedClient())
    const invoice = await service.createInvoice(data)
    return { success: true, data: invoice }
  } catch (error) {
    return { success: false, error: handleApiErrorSilently(error).userMessage }
  }
}
```

**3. Server Action** — Next.js entry point

```typescript
// modules/billing/server/actions/create-invoice.action.ts
"use server"
import { revalidatePath } from "next/cache"
import { createInvoice } from "../../application/create-invoice.use-case"

export async function createInvoiceAction(data: CreateInvoiceDto) {
  const result = await createInvoice(data)
  if (result.success) revalidatePath("/billing")
  return result
}
```

**4. Client Component** — calls the action

```typescript
// modules/billing/ui/components/CreateInvoiceForm.tsx
"use client"
import { createInvoiceAction } from "../../server/actions/create-invoice.action"

export function CreateInvoiceForm() {
  const handleSubmit = async (formData: FormData) => {
    const result = await createInvoiceAction({
      amount: formData.get("amount"),
      description: formData.get("description"),
    })
    if (!result.success) toast.error(result.error)
  }

  return <form action={handleSubmit}>...</form>
}
```

---

## Shared Infrastructure

### HTTP Client (`src/server/http/`)

```
server/http/
├── clients/
│   ├── index.ts              # Exports factory functions
│   ├── public.client.ts      # No auth required
│   └── authenticated.client.ts
│
├── interceptors/
│   ├── auth.interceptor.ts   # Token injection
│   ├── retry.interceptor.ts  # Auto-retry on 5xx
│   └── logging.interceptor.ts
│
└── errors/
    ├── api-error.ts          # Normalized error class
    └── handlers.ts           # handleApiError(), handleApiErrorSilently()
```

### Usage

```typescript
import { createPublicClient, createServerAuthenticatedClient } from '@/server/http'

// Public endpoints (no auth)
const publicClient = createPublicClient()

// Authenticated endpoints (adds token from session)
const authClient = createServerAuthenticatedClient()
```

### Error Categories

| Category | Status Codes | Retryable |
|----------|--------------|-----------|
| `NETWORK` | Connection failures | ✅ |
| `AUTH` | 401, 403 | ❌ |
| `VALIDATION` | 400, 422 | ❌ |
| `RATE_LIMIT` | 429 | ✅ |
| `SERVER` | 5xx | ✅ |

---

## State Management

### Decision Matrix

| Data Type | Solution | Location |
|-----------|----------|----------|
| Server data | Server Actions + `useApiQuery` | Hooks call actions |
| UI preferences | Zustand (persisted) | `shared/stores/` |
| Feature UI state | Zustand | `modules/<feature>/ui/stores/` |
| Form state | `useState` / React Hook Form | Component-local |
| Auth | NextAuth | `src/server/auth/` |

### Zustand Example

```typescript
// modules/canvas/ui/stores/useCanvasStore.ts
import { create } from 'zustand'

interface CanvasState {
  zoom: number
  selectedIds: string[]
  setZoom: (z: number) => void
  select: (ids: string[]) => void
}

export const useCanvasStore = create<CanvasState>((set) => ({
  zoom: 1,
  selectedIds: [],
  setZoom: (zoom) => set({ zoom }),
  select: (selectedIds) => set({ selectedIds }),
}))
```

---

## Quick Reference

### Import Rules

```typescript
// ✅ GOOD: Import via module barrel
import { InvoiceCard, useInvoices } from "@/modules/billing"

// ❌ BAD: Deep import into module internals
import { InvoiceCard } from "@/modules/billing/ui/components/InvoiceCard"
```

### File Naming

| Type | Convention | Example |
|------|------------|---------|
| Directories | `kebab-case` | `user-settings/` |
| Components | `PascalCase.tsx` | `InvoiceCard.tsx` |
| Actions | `kebab-case.action.ts` | `create-invoice.action.ts` |
| Use-cases | `kebab-case.use-case.ts` | `create-invoice.use-case.ts` |
| Services | `kebab-case.service.ts` | `billing.service.ts` |
| Stores | `use<Name>Store.ts` | `useCanvasStore.ts` |

### Next.js Special Files

| File | Purpose | Rendering |
|------|---------|-----------|
| `layout.tsx` | Shared wrapper | Server |
| `page.tsx` | Route UI | Server |
| `loading.tsx` | Suspense fallback | Server |
| `error.tsx` | Error boundary | **Client** |
| `route.ts` | API endpoint | Server |

### Route Patterns

| Pattern | Purpose | Example |
|---------|---------|---------|
| `(group)` | Logical grouping (no URL impact) | `(app)/dashboard` |
| `[param]` | Dynamic segment | `users/[id]` |
| `[...slug]` | Catch-all | `docs/[...slug]` |
| `@folder` | Parallel routes | `@modal` |
| `_folder` | Private (excluded from routing) | `_components` |

### Do's and Don'ts

| ✅ Do | ❌ Don't |
|-------|---------|
| New service instance per request | Singleton services (security risk) |
| Handle errors at application layer | Expose raw API errors to UI |
| `revalidatePath()` after mutations | Skip cache invalidation |
| Import via `index.ts` barrels | Deep-import module internals |
| Keep `shared/` minimal | Dump everything in shared |

---

*Last Updated: December 2024*
