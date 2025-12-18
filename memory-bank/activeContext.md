# Active Context

## Current State
The Pixel website has been fully implemented with all planned pages and components. The site is now a conversion-optimized platform showcasing the collaborative canvas concept.

## Recently Completed
- Full website transformation from scaffold to Pixel platform
- All 10 pages implemented: Home, Throne, Pricing, How It Works, Canvas, Gallery, About, Terms, Privacy, Guidelines
- Key components built: CanvasPreview, CanvasViewer, PricingCalculator, ThroneLeaderboard, ZoneHeatmap, LiveStats, StickyCTABar
- Mock data stores with simulated real-time updates (useCanvasStore, useThroneStore, useStatsStore)
- Motion (Framer Motion) integration for animations
- Navigation and branding updated throughout

## Key Technical Decisions
1. **Mock Data Strategy**: Zustand stores with setInterval for simulated real-time activity, designed to be easily replaceable with WebSocket connections to a real backend
2. **Animation Library**: Using `motion` (Framer Motion) for page transitions, scroll animations, and component reveals; CSS for micro-interactions
3. **Component Architecture**: Feature-specific component folders (canvas/, pricing/, throne/) with barrel exports
4. **Conversion Focus**: StickyCTABar component that appears on scroll, prominent CTAs in every section

## File Structure
```
src/
├── app/(main)/
│   ├── page.tsx              # Home with all sections
│   ├── throne/               # Throne competition
│   ├── pricing/              # Credit packages
│   ├── how-it-works/         # Tutorial and FAQ
│   ├── canvas/               # Full-screen viewer
│   ├── gallery/              # Community showcase
│   ├── about/                # Company info
│   ├── terms/                # Legal
│   ├── privacy/              # Legal
│   └── guidelines/           # Community rules
├── components/
│   ├── canvas/               # CanvasPreview, CanvasViewer
│   ├── pricing/              # PricingCard, PricingCalculator
│   ├── throne/               # ThroneViewer, ThroneLeaderboard
│   ├── zone-heatmap.tsx
│   ├── live-stats.tsx
│   └── sticky-cta-bar.tsx
├── stores/
│   ├── useCanvasStore.ts     # Pixel grid and activity
│   ├── useThroneStore.ts     # Throne holder and bids
│   └── useStatsStore.ts      # Live counters
└── types/
    └── pixel.ts              # All Pixel-specific types
```

## Next Steps
- Connect to real backend API when available
- Replace mock data stores with WebSocket connections
- Add actual payment integration (Stripe)
- Implement pixel placement functionality
- Add user authentication flows for canvas interaction
- Performance optimization and testing
