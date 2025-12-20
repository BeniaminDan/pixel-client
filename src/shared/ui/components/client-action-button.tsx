'use client'

import * as React from 'react'
import Link from 'next/link'
import { ArrowLeft, RefreshCw, Home, Search } from 'lucide-react'
import type { VariantProps } from 'class-variance-authority'

import { Button } from '@/components/ui/button'
import { cn } from '@/utils/cn'

type ActionType = 'back' | 'refresh' | 'home' | 'search'

interface ActionButtonProps
  extends Omit<React.ComponentProps<typeof Button>, 'onClick' | 'asChild'>,
    VariantProps<typeof Button> {
  action?: ActionType
  actionHref?: string
  onClick?: () => void
}

const actionConfig: Record<
  ActionType,
  {
    icon: React.ComponentType<{ className?: string }>
    label: string
    defaultAction: () => void
  }
> = {
  back: {
    icon: ArrowLeft,
    label: 'Go Back',
    defaultAction: () => {
      if (typeof window !== 'undefined') {
        window.history.back()
      }
    },
  },
  refresh: {
    icon: RefreshCw,
    label: 'Refresh Page',
    defaultAction: () => {
      if (typeof window !== 'undefined') {
        window.location.reload()
      }
    },
  },
  home: {
    icon: Home,
    label: 'Go Home',
    defaultAction: () => {
      if (typeof window !== 'undefined') {
        window.location.href = '/'
      }
    },
  },
  search: {
    icon: Search,
    label: 'Search',
    defaultAction: () => {
      // Default action can be overridden with onClick or actionHref
    },
  },
}

function ClientActionButton({
  action,
  actionHref,
  onClick,
  children,
  className,
  ...props
}: ActionButtonProps) {
  const handleClick = React.useCallback(() => {
    if (onClick) {
      onClick()
      return
    }

    if (action && actionConfig[action]) {
      actionConfig[action].defaultAction()
    }
  }, [action, onClick])

  // If actionHref is provided, use Button with asChild and Next.js Link
  if (actionHref && !onClick) {
    const Icon = action ? actionConfig[action].icon : null
    const label = action ? actionConfig[action].label : ''

    return (
      <Button asChild className={cn(className)} {...props}>
        <Link href={actionHref}>
          {Icon && <Icon className="size-4" />}
          {children || label}
        </Link>
      </Button>
    )
  }

  // If action is provided, use the configured icon and label
  if (action && actionConfig[action]) {
    const { icon: Icon, label } = actionConfig[action]

    return (
      <Button
        onClick={handleClick}
        className={cn(className)}
        {...props}
      >
        <Icon className="size-4" />
        {children || label}
      </Button>
    )
  }

  // Fallback to regular Button with custom onClick
  return (
    <Button onClick={handleClick} className={cn(className)} {...props}>
      {children}
    </Button>
  )
}

export { ClientActionButton, type ActionButtonProps, type ActionType }
