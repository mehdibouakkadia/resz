import { useEffect, useRef, useState } from 'react'
import { ResizeContext, PRESETS } from './context'
import { Panel } from './Panel'
import { Handle } from './Handle'
import type { ResizeProps, ResizeState, Direction, DimensionState, Constraints } from './types'
import './style.css'

const DEFAULT_WIDTH = 320
const DEFAULT_HEIGHT = 200

function stepSpring(
  state: DimensionState,
  dtSeconds: number,
  k: number,
  c: number,
  m: number
) {
  const displacement = state.current - state.target
  const acceleration = (-k * displacement - c * state.velocity) / m
  state.velocity += acceleration * dtSeconds
  state.current += state.velocity * dtSeconds
}

function applyConstraints(
  width: number,
  height: number,
  constraints?: Constraints
): [number, number] {
  if (!constraints) return [width, height]
  
  let w = width
  let h = height

  // Apply min/max constraints
  if (constraints.min?.width != null) {
    w = Math.max(w, constraints.min.width)
  }
  if (constraints.max?.width != null) {
    w = Math.min(w, constraints.max.width)
  }
  if (constraints.min?.height != null) {
    h = Math.max(h, constraints.min.height)
  }
  if (constraints.max?.height != null) {
    h = Math.min(h, constraints.max.height)
  }

  // Apply aspect ratio if specified
  if (constraints.aspectRatio != null) {
    // When resizing width, adjust height to match
    if (Math.abs(w - width) > Math.abs(h - height)) {
      h = w / constraints.aspectRatio
    }
    // When resizing height, adjust width to match
    else {
      w = h * constraints.aspectRatio
    }

    // Re-apply min/max after aspect ratio
    if (constraints.min?.width != null && w < constraints.min.width) {
      w = constraints.min.width
      h = w / constraints.aspectRatio
    }
    if (constraints.max?.width != null && w > constraints.max.width) {
      w = constraints.max.width
      h = w / constraints.aspectRatio
    }
    if (constraints.min?.height != null && h < constraints.min.height) {
      h = constraints.min.height
      w = h * constraints.aspectRatio
    }
    if (constraints.max?.height != null && h > constraints.max.height) {
      h = constraints.max.height
      w = h * constraints.aspectRatio
    }
  }

  return [w, h]
}

function findSnapPoint(value: number, points: number[] = [], increment?: number, threshold = 5): number {
  let result = value
  let minDiff = Infinity
  let closestPoint = value

  // Check snap points
  if (points.length > 0) {
    for (const point of points) {
      const diff = Math.abs(value - point)
      if (diff <= threshold && diff < minDiff) {
        minDiff = diff
        closestPoint = point
      }
    }
    if (minDiff < Infinity) {
      return closestPoint
    }
  }

  // Check increment
  if (increment && increment > 1) {
    const rounded = Math.round(value / increment) * increment
    if (Math.abs(value - rounded) <= threshold) {
      return rounded
    }
  }

  return result
}

export function Resize({
  children,
  initialWidth = DEFAULT_WIDTH,
  initialHeight = DEFAULT_HEIGHT,
  className,
  style,
  config,
  preset = 'professional',
  constraints,
  snap,
  onResize,
}: ResizeProps) {
  const frameRef = useRef<number | null>(null)
  const lastTsRef = useRef<number | null>(null)
  const isAnimatingRef = useRef(false)
  const isDraggingRef = useRef(false)
  const activeDirRef = useRef<Direction | null>(null)
  const rootRef = useRef<HTMLDivElement>(null)

  // Track dimensions for visual updates
  const [dimensions, setDimensions] = useState({
    width: initialWidth,
    height: initialHeight,
  })

  const resolved = {
    ...PRESETS[preset],
    ...(config ?? {}),
  }
  const springK = resolved.tension
  const springC = resolved.friction
  const springM = resolved.mass

  const stateRef = useRef<ResizeState>({
    width: { current: initialWidth, velocity: 0, target: initialWidth },
    height: { current: initialHeight, velocity: 0, target: initialHeight },
  })

  const dragStartRef = useRef({
    pointerX: 0,
    pointerY: 0,
    targetW: initialWidth,
    targetH: initialHeight,
  })

  useEffect(() => {
    if (!onResize) return
    onResize({
      width: dimensions.width,
      height: dimensions.height,
      isDragging: false,
    })
  }, [dimensions])

  function startAnimating() {
    if (isAnimatingRef.current) return
    isAnimatingRef.current = true
    lastTsRef.current = null
    frameRef.current = requestAnimationFrame(tick)
  }

  function stopAnimating() {
    isAnimatingRef.current = false
    if (frameRef.current != null) cancelAnimationFrame(frameRef.current)
    frameRef.current = null
    lastTsRef.current = null
  }

  function tick(ts: number) {
    if (!isAnimatingRef.current) return

    const last = lastTsRef.current == null ? ts : lastTsRef.current
    let dtMs = ts - last
    if (dtMs > 100) dtMs = 100
    lastTsRef.current = ts
    const dt = Math.max(0.001, Math.min(0.033, dtMs / 1000))

    const state = stateRef.current
    stepSpring(state.width, dt, springK, springC, springM)
    stepSpring(state.height, dt, springK, springC, springM)

    // Update visual dimensions
    setDimensions({
      width: state.width.current,
      height: state.height.current,
    })

    if (onResize) {
      onResize({
        width: state.width.current,
        height: state.height.current,
        isDragging: isDraggingRef.current,
      })
    }

    const wDone =
      Math.abs(state.width.current - state.width.target) < 0.1 &&
      Math.abs(state.width.velocity) < 0.05
    const hDone =
      Math.abs(state.height.current - state.height.target) < 0.1 &&
      Math.abs(state.height.velocity) < 0.05

    if (wDone && hDone && !isDraggingRef.current) {
      stopAnimating()
      return
    }

    frameRef.current = requestAnimationFrame(tick)
  }

  function onHandlePointerDown(dir: Direction, e: React.PointerEvent) {
    e.preventDefault()
    isDraggingRef.current = true
    activeDirRef.current = dir
    const target = e.currentTarget as HTMLDivElement
    try {
      target.setPointerCapture(e.pointerId)
    } catch {}

    dragStartRef.current.pointerX = e.clientX
    dragStartRef.current.pointerY = e.clientY
    dragStartRef.current.targetW = stateRef.current.width.target
    dragStartRef.current.targetH = stateRef.current.height.target
    startAnimating()
  }

  function onHandlePointerUp(e: React.PointerEvent) {
    if (!isDraggingRef.current) return
    isDraggingRef.current = false
    const target = e.target as HTMLDivElement
    try {
      target.releasePointerCapture(e.pointerId)
    } catch {}
    activeDirRef.current = null
    startAnimating()
  }

  useEffect(() => {
    function onPointerMove(e: PointerEvent) {
      if (!isDraggingRef.current || !activeDirRef.current) return
      const dx = e.clientX - dragStartRef.current.pointerX
      const dy = e.clientY - dragStartRef.current.pointerY
      const dir = activeDirRef.current

      let newW = dragStartRef.current.targetW
      let newH = dragStartRef.current.targetH

      // Handle width changes
      if (dir.includes('e')) {
        // East handles grow right
        newW = dragStartRef.current.targetW + dx
      } else if (dir.includes('w')) {
        // West handles grow left
        newW = dragStartRef.current.targetW - dx
      }

      // Handle height changes
      if (dir.includes('s')) {
        // South handles grow down
        newH = dragStartRef.current.targetH + dy
      } else if (dir.includes('n')) {
        // North handles grow up
        newH = dragStartRef.current.targetH - dy
      }

      // Apply snapping (increment only)
      if (snap?.increment) {
        const snapW = findSnapPoint(newW, undefined, snap.increment, snap.threshold)
        const snapH = findSnapPoint(newH, undefined, snap.increment, snap.threshold)
        
        if (snapW !== newW) {
          stateRef.current.width.velocity = 0 // Reset velocity for snappy feel
          newW = snapW
        }
        if (snapH !== newH) {
          stateRef.current.height.velocity = 0 // Reset velocity for snappy feel
          newH = snapH
        }
      }

      // Apply constraints after snapping
      [newW, newH] = applyConstraints(newW, newH, constraints)

      stateRef.current.width.target = newW
      stateRef.current.height.target = newH
    }

    window.addEventListener('pointermove', onPointerMove)
    return () => window.removeEventListener('pointermove', onPointerMove)
  }, [])

  useEffect(() => {
    if (!isAnimatingRef.current) startAnimating()
  }, [springK, springC, springM])

  return (
    <ResizeContext.Provider
      value={{
        state: stateRef.current,
        isDragging: isDraggingRef.current,
        activeHandle: activeDirRef.current,
        springConfig: resolved,
        onHandlePointerDown,
        onHandlePointerUp,
      }}
    >
      <div 
        ref={rootRef}
        className={['resize-root', className].filter(Boolean).join(' ')} 
        style={{
          width: `${Math.round(dimensions.width)}px`,
          height: `${Math.round(dimensions.height)}px`,
          ...style,
        }}
      >
        {children}
      </div>
    </ResizeContext.Provider>
  )
}

Resize.Panel = Panel
Resize.Handle = Handle

export default Resize