import { useEffect, useState } from 'react'

export function useScrollThreshold(threshold = 50, isEnabled = true): boolean {
  const [isPastThreshold, setIsPastThreshold] = useState(false)

  useEffect(() => {
    if (!isEnabled) return

    if (typeof window === 'undefined') return

    const handleScroll = () => {
      setIsPastThreshold(window.scrollY > threshold)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [isEnabled, threshold])

  if (!isEnabled) return false

  return isPastThreshold
}
