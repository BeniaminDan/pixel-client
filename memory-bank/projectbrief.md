# Project Brief

- **Project:** `pixel_client` — Next.js frontend for Pixel, a collaborative canvas platform.
- **Goal:** Build a high-converting website where users can buy permanent pixels and compete for the premium "Focal Point" (Throne) at coordinates 0,0.
- **Product Concept:** A collaborative canvas where every pixel tells a story. Users purchase credits to place permanent pixels, with special competition mechanics for the center position.

## Core Features
1. **Permanent Pixel Ownership** - Users buy credits and place pixels that stay forever
2. **The Throne Competition** - Bidding system for the coveted 0,0 Focal Point position
3. **Zone-Based Pricing** - Premium pricing for pixels closer to the center
4. **Live Canvas Viewer** - Real-time canvas exploration with pan/zoom
5. **Community Gallery** - Showcase of user creations and battle history

## Tech Stack
- Next.js 16 with App Router
- TypeScript (strict), React 19
- Tailwind CSS v4 with OKLCH color palette
- Shadcn/ui + Radix UI components
- Motion (Framer Motion) for animations
- Zustand for state management
- React Hook Form + Zod for validation

## Target Pages
- Home (/) - Hero with live canvas, value props, pricing preview
- Throne (/throne) - Competition mechanics and leaderboard
- Pricing (/pricing) - Credit packages and calculator
- How It Works (/how-it-works) - Step-by-step guide and FAQ
- Canvas (/canvas) - Full-screen interactive viewer
- Gallery (/gallery) - Community creations and battles
- About (/about) - Mission, team, and community
- Legal pages (/terms, /privacy, /guidelines)

## Design Principles
- Modern dark mode SaaS aesthetic
- Conversion-focused: single CTA per section
- Social proof and urgency indicators throughout
- Mobile-first responsive design
- Smooth animations with Motion library
