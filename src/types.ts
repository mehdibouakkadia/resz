export type SpringConfig = {
  tension?: number
  friction?: number
  mass?: number
}

export type ResizePreset = 'gentle' | 'smooth' | 'snappy'

export type Direction = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw'

export type Dimensions = {
  width: number
  height: number
  isDragging: boolean
}

export type DimensionState = {
  current: number
  velocity: number
  target: number
}

export type ResizeState = {
  width: DimensionState
  height: DimensionState
}

export type ResizeContextValue = {
  state: ResizeState
  isDragging: boolean
  activeHandle: Direction | null
  springConfig: Required<SpringConfig>
  onHandlePointerDown: (dir: Direction, e: React.PointerEvent) => void
  onHandlePointerUp: (e: React.PointerEvent) => void
}

export type Constraints = {
  min?: {
    width?: number
    height?: number
  }
  max?: {
    width?: number
    height?: number
  }
  aspectRatio?: number
}


export type ResizeProps = {
  children: React.ReactNode
  initialWidth?: number
  initialHeight?: number
  className?: string
  style?: React.CSSProperties
  config?: SpringConfig
  preset?: ResizePreset
  constraints?: Constraints
  snapIncrement?: number
  onResize?: (dims: Dimensions) => void
}

export type PanelProps = {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

export type HandleRenderProps = {
  dir: Direction
  active: boolean
  dragging: boolean
}

export type HandleProps = {
  dir: Direction
  className?: string
  style?: React.CSSProperties
  render?: (props: HandleRenderProps) => React.ReactNode
}