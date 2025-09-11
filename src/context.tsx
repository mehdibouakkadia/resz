import { createContext, useContext } from 'react'
import type { ResizeContextValue } from './types'

export const ResizeContext = createContext<ResizeContextValue | null>(null)

export function useResizeContext() {
  const context = useContext(ResizeContext)
  if (!context) {
    throw new Error('Resize.Panel and Resize.Handle must be used within a Resize component')
  }
  return context
}

// Spring presets tuned for different feels
export const PRESETS = {
  gentle: { tension: 220, friction: 30, mass: 1 },
  professional: { tension: 320, friction: 26, mass: 1 },
  snappy: { tension: 460, friction: 30, mass: 1 },
} as const