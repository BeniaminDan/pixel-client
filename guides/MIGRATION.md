# Migration Guide: Current → Module-Based Structure

This guide maps every file from the current structure to the new module-based architecture.

---

## Legend

| Symbol | Meaning |
|--------|---------|
| ✅ | Keep in place (already correct) |
| 📦 | Move to new location |
| 🔗 | Merge/consolidate |
| 🗑️ | Can be removed/refactored |

---

## 1. App Directory (Routes)

> **Verdict:** ✅ Keep `app/` as-is. Routes are already well-organized with route groups.

| Current | Action | New Location |
|---------|--------|--------------|
| `app/(app)/` | ✅ Keep | `app/(app)/` |
| `app/(auth)/` | ✅ Keep | `app/(auth)/` |
| `app/(public)/` | ✅ Keep | `app/(public)/` |
| `app/api/` | ✅ Keep | `app/api/` |
| `app/canvas/` | ✅ Keep | `app/canvas/` |
| `app/error.tsx` | ✅ Keep | `app/error.tsx` |
| `app/global-error.tsx` | ✅ Keep | `app/global-error.tsx` |
| `app/layout.tsx` | ✅ Keep | `app/layout.tsx` |
| `app/not-found.tsx` | ✅ Keep | `app/not-found.tsx` |

---

## 2. Features → Modules

> **Verdict:** 📦 Rename `features/` to `modules/` and restructure internally.

### Auth Module

| Current | New Location |
|---------|--------------|
| `features/auth/api/actions/*.ts` | `modules/auth/server/actions/*.ts` |
| `features/auth/api/services/account.ts` | `modules/auth/application/account.ts` |
| `features/auth/components/*.tsx` | `modules/auth/ui/*.tsx` |
| `features/auth/hooks/*.ts` | `modules/auth/ui/hooks/*.ts` |
| `features/auth/lib/auth.ts` | `modules/auth/infrastructure/auth-config.ts` |
| `features/auth/lib/auth-popup.ts` | `modules/auth/infrastructure/auth-popup.ts` |
| `features/auth/types/*.ts` | `modules/auth/contracts/*.ts` |
| `features/auth/index.ts` | `modules/auth/index.ts` |

### Admin Module

| Current | New Location |
|---------|--------------|
| `features/admin/api/actions/*.ts` | `modules/admin/server/actions/*.ts` |
| `features/admin/api/services/*.ts` | `modules/admin/application/*.ts` |
| `services/admin.service.ts` | `modules/admin/infrastructure/admin.service.ts` |

### Pixel Module

| Current | New Location |
|---------|--------------|
| `features/pixel/api/actions/*.ts` | `modules/pixel/server/actions/*.ts` |
| `features/pixel/api/services/*.ts` | `modules/pixel/application/*.ts` |
| `services/pixel.service.ts` | `modules/pixel/infrastructure/pixel.service.ts` |
| `stores/useCanvasStore.ts` | `modules/pixel/ui/stores/useCanvasStore.ts` |
| `types/pixel.ts` | `modules/pixel/contracts/pixel.types.ts` |

### Throne Module

| Current | New Location |
|---------|--------------|
| `features/throne/api/actions/*.ts` | `modules/throne/server/actions/*.ts` |
| `features/throne/api/services/*.ts` | `modules/throne/application/*.ts` |
| `services/throne.service.ts` | `modules/throne/infrastructure/throne.service.ts` |
| `stores/useThroneStore.ts` | `modules/throne/ui/stores/useThroneStore.ts` |

### Users Module

| Current | New Location |
|---------|--------------|
| `features/users/` | `modules/users/` (expand as needed) |

---

## 3. Services → Module Infrastructure

> **Verdict:** 📦 Distribute services into their respective modules.

| Current | New Location |
|---------|--------------|
| `services/base.service.ts` | `server/http/base.service.ts` |
| `services/admin.service.ts` | `modules/admin/infrastructure/admin.service.ts` |
| `services/account.service.ts` | `modules/auth/infrastructure/account.service.ts` |
| `services/account-setup.service.ts` | `modules/auth/infrastructure/account-setup.service.ts` |
| `services/pixel.service.ts` | `modules/pixel/infrastructure/pixel.service.ts` |
| `services/throne.service.ts` | `modules/throne/infrastructure/throne.service.ts` |
| `services/index.ts` | 🗑️ Remove (each module exports its own) |

---

## 4. Lib → Server + Shared

> **Verdict:** 📦 Split between `server/` (API infra) and `shared/lib/` (utilities).

### API Infrastructure → `server/http/`

| Current | New Location |
|---------|--------------|
| `lib/api/config/api.config.ts` | `server/http/config/api.config.ts` |
| `lib/api/config/retry.config.ts` | `server/http/config/retry.config.ts` |
| `lib/api/errors/*.ts` | `server/http/errors/*.ts` |
| `lib/api/factory/*.ts` | `server/http/clients/*.ts` |
| `lib/api/interceptors/*.ts` | `server/http/interceptors/*.ts` |
| `lib/api/logging/*.ts` | `server/observability/logging/*.ts` |
| `lib/api/retry/*.ts` | `server/http/retry/*.ts` |
| `lib/api/index.ts` | `server/http/index.ts` |

### Permissions → `server/auth/`

| Current | New Location |
|---------|--------------|
| `lib/permissions/permissionChecker.ts` | `server/auth/permission-checker.ts` |
| `lib/permissions/permissionInterceptor.ts` | `server/http/interceptors/permission.interceptor.ts` |
| `lib/permissions/permissionMiddleware.ts` | `server/auth/permission-middleware.ts` |
| `lib/permissions/permissions.types.ts` | `server/auth/permissions.types.ts` |

### Other Lib Files

| Current | New Location |
|---------|--------------|
| `lib/authClient.ts` | `modules/auth/infrastructure/auth-client.ts` |
| `lib/color-utils.ts` | `shared/lib/color-utils.ts` |
| `lib/fluid-shaders.ts` | `shared/lib/fluid/shaders.ts` |
| `lib/fluid-webgl.ts` | `shared/lib/fluid/webgl.ts` |
| `lib/index.ts` | 🗑️ Remove (split across modules) |

---

## 5. Components → Shared UI + Module UI

> **Verdict:** 📦 Design system stays in `shared/ui/`, feature components go to modules.

### Design System → `shared/ui/`

| Current | New Location |
|---------|--------------|
| `components/ui/*.tsx` (21 files) | `shared/ui/*.tsx` |
| Avatar, Badge, Button, Card, Checkbox, Dialog, Dropdown, Form, Input, Label, Popover, RadioGroup, Select, Separator, Sheet, Skeleton, Sonner, Switch, Table, Tabs, Textarea | ✅ All move to `shared/ui/` |

### Layout Components → `shared/ui/layouts/`

| Current | New Location |
|---------|--------------|
| `components/layouts/app-header.tsx` | `shared/ui/layouts/app-header.tsx` |
| `components/layouts/app-footer.tsx` | `shared/ui/layouts/app-footer.tsx` |
| `components/layouts/nav-menu.tsx` | `shared/ui/layouts/nav-menu.tsx` |
| `components/layouts/user-menu.tsx` | `shared/ui/layouts/user-menu.tsx` |
| `components/layouts/sticky-header-wrapper.tsx` | `shared/ui/layouts/sticky-header-wrapper.tsx` |

### Providers → `shared/providers/`

| Current | New Location |
|---------|--------------|
| `components/providers/session-provider.tsx` | `shared/providers/session-provider.tsx` |
| `components/providers/theme-provider.tsx` | `shared/providers/theme-provider.tsx` |

### Auth Components → `modules/auth/ui/`

| Current | New Location |
|---------|--------------|
| `components/auth/ProtectedAction.tsx` | `modules/auth/ui/protected-action.tsx` |
| `components/auth/RequireAuth.tsx` | `modules/auth/ui/require-auth.tsx` |
| `components/auth/RequirePermission.tsx` | `modules/auth/ui/require-permission.tsx` |
| `components/auth/RequireRole.tsx` | `modules/auth/ui/require-role.tsx` |

### Feature-Specific Components

| Current | New Location |
|---------|--------------|
| `components/canvas-preview.tsx` | `modules/pixel/ui/canvas-preview.tsx` |
| `components/throne-viewer.tsx` | `modules/throne/ui/throne-viewer.tsx` |
| `components/zone-heatmap.tsx` | `modules/pixel/ui/zone-heatmap.tsx` |
| `components/live-stats.tsx` | `modules/pixel/ui/live-stats.tsx` |
| `components/pricing-card.tsx` | `shared/ui/pricing-card.tsx` |
| `components/cookie-consent.tsx` | `shared/ui/cookie-consent.tsx` |
| `components/fluid-hero-background.tsx` | `shared/ui/fluid-hero-background.tsx` |
| `components/logo.tsx` | `shared/ui/logo.tsx` |
| `components/theme-toggle.tsx` | `shared/ui/theme-toggle.tsx` |
| `components/search-field.tsx` | `shared/ui/search-field.tsx` |
| `components/social-links.tsx` | `shared/ui/social-links.tsx` |
| `components/sticky-cta-bar.tsx` | `shared/ui/sticky-cta-bar.tsx` |
| `components/client-action-button.tsx` | `shared/ui/client-action-button.tsx` |

---

## 6. Hooks → Shared + Modules

> **Verdict:** 📦 API hooks to `shared/hooks/`, feature hooks to modules.

### Generic Hooks → `shared/hooks/`

| Current | New Location |
|---------|--------------|
| `hooks/useAsync.ts` | `shared/hooks/useAsync.ts` |
| `hooks/useCookieConsent.ts` | `shared/hooks/useCookieConsent.ts` |
| `hooks/useDebounce.ts` | `shared/hooks/useDebounce.ts` |
| `hooks/useLocalStorage.ts` | `shared/hooks/useLocalStorage.ts` |
| `hooks/useMediaQuery.ts` | `shared/hooks/useMediaQuery.ts` |
| `hooks/useScrollThreshold.ts` | `shared/hooks/useScrollThreshold.ts` |

### API Hooks → `shared/hooks/api/`

| Current | New Location |
|---------|--------------|
| `hooks/api/useApi.ts` | `shared/hooks/api/useApi.ts` |
| `hooks/api/useApiMutation.ts` | `shared/hooks/api/useApiMutation.ts` |
| `hooks/api/useApiQuery.ts` | `shared/hooks/api/useApiQuery.ts` |
| `hooks/api/usePermissions.ts` | `shared/hooks/api/usePermissions.ts` |

### Feature-Specific Hooks

| Current | New Location |
|---------|--------------|
| `hooks/useFluidSimulation.ts` | `shared/lib/fluid/useFluidSimulation.ts` |
| `features/auth/hooks/useAuthPopup.ts` | `modules/auth/ui/hooks/useAuthPopup.ts` |
| `features/auth/hooks/useRequireAuth.ts` | `modules/auth/ui/hooks/useRequireAuth.ts` |

---

## 7. Stores → Shared + Modules

> **Verdict:** 📦 Generic stores to `shared/stores/`, feature stores to modules.

| Current | New Location |
|---------|--------------|
| `stores/useUiStore.ts` | `shared/stores/useUiStore.ts` |
| `stores/useCounterStore.ts` | `shared/stores/useCounterStore.ts` |
| `stores/useStatsStore.ts` | `shared/stores/useStatsStore.ts` |
| `stores/useCanvasStore.ts` | `modules/pixel/ui/stores/useCanvasStore.ts` |
| `stores/useThroneStore.ts` | `modules/throne/ui/stores/useThroneStore.ts` |

---

## 8. Config → `server/config/`

> **Verdict:** 📦 Move to server-side config.

| Current | New Location |
|---------|--------------|
| `config/env.ts` | `server/config/env.ts` |
| `config/paths.ts` | `shared/lib/paths.ts` |
| `config/index.ts` | Split between `server/config/` and `shared/lib/` |

---

## 9. Types → Shared + Modules

> **Verdict:** 📦 Distribute based on scope.

| Current | New Location |
|---------|--------------|
| `types/api.ts` | `shared/types/api.ts` |
| `types/models.ts` | `shared/types/models.ts` |
| `types/next-auth.d.ts` | `shared/types/next-auth.d.ts` |
| `types/pixel.ts` | `modules/pixel/contracts/pixel.types.ts` |
| `types/fluid-simulation.ts` | `shared/lib/fluid/types.ts` |

---

## 10. Utils → `shared/lib/`

> **Verdict:** 📦 Move to shared library.

| Current | New Location |
|---------|--------------|
| `utils/cn.ts` | `shared/lib/cn.ts` |
| `utils/index.ts` | `shared/lib/index.ts` |

---

## 11. Root Files

| Current | New Location |
|---------|--------------|
| `instrumentation.ts` | ✅ Keep (Next.js convention) |
| `instrumentation-client.ts` | ✅ Keep (Next.js convention) |
| `proxy.ts` | `server/http/proxy.ts` |
| `styles/` | ✅ Keep in place |
| `middleware.ts` | ✅ Keep (Next.js convention) |

---

## Final Structure Overview

```
src/
├─ app/                             # ✅ Keep as-is
│  ├─ (app)/
│  ├─ (auth)/
│  ├─ (public)/
│  └─ api/
│
├─ modules/                         # 📦 Renamed from features/
│  ├─ auth/
│  │  ├─ ui/                        # Components, hooks
│  │  ├─ server/                    # Server actions
│  │  ├─ application/               # Service layer (orchestration)
│  │  ├─ infrastructure/            # Service classes, auth config
│  │  ├─ contracts/                 # Types, DTOs
│  │  └─ index.ts
│  ├─ admin/
│  ├─ pixel/
│  ├─ throne/
│  └─ users/
│
├─ shared/                          # 📦 New - cross-cutting
│  ├─ ui/                           # Design system (from components/ui)
│  ├─ hooks/                        # Generic hooks
│  ├─ stores/                       # Generic stores
│  ├─ lib/                          # Utilities
│  ├─ types/                        # Global types
│  ├─ providers/                    # App providers
│  └─ contracts/                    # Shared DTOs
│
├─ server/                          # 📦 New - server infrastructure
│  ├─ http/
│  │  ├─ clients/                   # API client factory
│  │  ├─ interceptors/              # Auth, error, retry
│  │  ├─ errors/                    # Error handling
│  │  └─ retry/                     # Retry logic
│  ├─ auth/                         # Permissions, middleware
│  ├─ observability/                # Logging
│  └─ config/                       # Env, runtime config
│
├─ styles/                          # ✅ Keep
├─ instrumentation.ts               # ✅ Keep
└─ middleware.ts                    # ✅ Keep
```

---

## Migration Order (Recommended)

1. **Create folder structure** - Set up `modules/`, `shared/`, `server/`
2. **Move infrastructure first** - `lib/api/*` → `server/http/*`
3. **Move shared code** - `components/ui/*` → `shared/ui/*`
4. **Migrate modules one by one** - Start with `auth`, then `pixel`, `throne`, `admin`
5. **Update imports** - Use path aliases (`@/modules/*`, `@/shared/*`, `@/server/*`)
6. **Delete old folders** - Remove `features/`, `services/`, `lib/`

---

## Path Alias Updates (tsconfig.json)

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@/modules/*": ["./src/modules/*"],
      "@/shared/*": ["./src/shared/*"],
      "@/server/*": ["./src/server/*"]
    }
  }
}
```

---

*Generated: December 2024*
