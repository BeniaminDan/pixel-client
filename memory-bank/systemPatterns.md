# System Patterns

## Architecture Overview
- Next.js 16 App Router with `src/app` directory structure
- Route groups: `(auth)` for authentication, `(main)` for public pages
- TypeScript strict mode with path alias `@/*` → `src/*`

## Component Organization
```
src/components/
├── ui/                    # Shadcn UI primitives
├── canvas/                # Canvas-specific components
│   ├── canvas-preview.tsx
│   ├── canvas-viewer.tsx
│   └── index.ts
├── pricing/               # Pricing components
│   ├── pricing-card.tsx
│   ├── pricing-calculator.tsx
│   └── index.ts
├── throne/                # Throne components
│   ├── throne-viewer.tsx
│   ├── throne-leaderboard.tsx
│   └── index.ts
├── zone-heatmap.tsx       # Standalone feature components
├── live-stats.tsx
├── sticky-cta-bar.tsx
└── index.ts               # Main barrel export
```

## State Management Pattern
Zustand stores with simulation capabilities:
```typescript
interface StoreState {
  data: DataType
  // Actions
  updateData: (partial: Partial<DataType>) => void
  startSimulation: () => () => void  // Returns cleanup function
}
```

Mock data simulation pattern:
```typescript
startSimulation: () => {
  const interval = setInterval(() => {
    // Update state with simulated data
  }, randomInterval)
  return () => clearInterval(interval)  // Cleanup
}
```

## Animation Patterns
Using `motion` (Framer Motion):
- Page sections: `initial`, `animate`, `whileInView` with viewport once
- List items: Staggered delays with `index * 0.1`
- Interactive elements: `whileHover`, `AnimatePresence` for mount/unmount

## Styling Patterns
- Tailwind CSS v4 with OKLCH color tokens
- Dark mode primary with `bg-background` and `text-foreground`
- Cards with gradient backgrounds: `from-primary/10 to-transparent`
- Conversion elements: Primary color CTAs, badges for urgency

## Data Flow
```
Pages → Feature Components → UI Components
          ↓
       Zustand Stores (mock data)
          ↓
       (Future: API Client → Backend)
```

## Conversion Optimization Patterns
1. **Single CTA per section** - Clear action for each content block
2. **Social proof placement** - Stats, avatars, badges throughout
3. **Urgency indicators** - Live counters, "limited" messaging
4. **Sticky conversion** - StickyCTABar appears on scroll
5. **Trust signals** - Security badges, testimonials, metrics

## Code Conventions
- Functional components with TypeScript interfaces
- Named exports for components
- Barrel files (index.ts) for clean imports
- Props interfaces defined in component files
- Static data (mock) at bottom of files or in stores
