/**
 * Path configuration
 * Centralized route paths for consistent navigation
 */

export const paths = {
  // Public routes
  home: '/',
  about: '/about',
  contact: '/contact',
  gallery: '/gallery',
  guidelines: '/guidelines',
  'how-it-works': '/how-it-works',
  pricing: '/pricing',
  privacy: '/privacy',
  terms: '/terms',
  canvas: '/canvas',
  throne: '/throne',
  
  // Auth routes
  login: '/login',
  register: '/register',
  'forgot-password': '/forgot-password',
  'reset-password': '/reset-password',
  'confirm-email': '/confirm-email',
  
  // App routes (authenticated)
  profile: '/profile',
  settings: '/settings',
  
  // Error routes
  forbidden: '/403',
  serverError: '/500',
  notFound: '/404',
} as const

