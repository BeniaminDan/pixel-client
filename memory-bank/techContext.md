# Tech Context

## Framework & Language
- **Framework:** Next.js 16 with App Router
- **Language:** TypeScript (strict mode), React 19
- **Runtime:** Node.js

## Styling
- **CSS Framework:** Tailwind CSS v4 (imported via `@import "tailwindcss"`)
- **Animations:** tw-animate-css for utility animations
- **Motion:** `motion` (Framer Motion v11+) for complex animations
- **Color System:** OKLCH color palette with CSS custom properties
- **Fonts:** Geist Sans and Geist Mono

## UI Components
- **Component Library:** Shadcn/ui (Radix UI primitives)
- **Icons:** Lucide React

## State Management
- **Global State:** Zustand v5
- **Form State:** React Hook Form v7
- **Validation:** Zod v4

## HTTP & API
- **HTTP Client:** Axios v1.13
- **API Pattern:** Centralized client in `src/lib/apiClient.ts`
- **Environment:** `NEXT_PUBLIC_API_URL` for API base

## Authentication
- **Auth Library:** NextAuth.js v5 (beta)
- **Session:** JWT-based with server components support

## Tooling
- **Linting:** ESLint 9 with eslint-config-next
- **Formatting:** Prettier with prettier-plugin-tailwindcss
- **Build:** Next.js built-in bundler (Turbopack available)

## Path Configuration
```json
{
  "paths": {
    "@/*": ["./src/*"]
  }
}
```

## Key Dependencies
```json
{
  "motion": "^11.x",
  "zustand": "^5.x",
  "react-hook-form": "^7.x",
  "zod": "^4.x",
  "axios": "^1.13",
  "lucide-react": "^0.560",
  "next-themes": "^0.4",
  "sonner": "^2.x"
}
```

## Environment Variables
- `NEXT_PUBLIC_API_URL` - Backend API base URL
- `AUTH_SECRET` - NextAuth secret
- `AUTH_*` - OAuth provider credentials

## Performance Targets
- Load time: <2s
- Lighthouse score: 90+
- Mobile-optimized
- SEO-ready with meta tags
