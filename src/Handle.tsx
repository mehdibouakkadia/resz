import { useState } from 'react'
import { useResizeContext } from './context'
import type { HandleProps } from './types'
import './style.css'

/**
 * A resize handle that can be placed anywhere within a Resize component.
 * Must be used as a child of a Resize component.
 * 
 * @example
 * // Simple styling
 * <Resize.Handle dir="se" className="my-handle" />
 * 
 * // Custom rendering
 * <Resize.Handle 
 *   dir="se" 
 *   render={({ active, dragging }) => (
 *     <div className={active ? 'custom-active' : 'custom'}>
 *       <Icon />
 *     </div>
 *   )}
 * />
 */
export function Handle({ dir, className, style, render }: HandleProps) {
  const { onHandlePointerDown, onHandlePointerUp, isDragging, activeHandle } = useResizeContext()
  const [isHovered, setIsHovered] = useState(false)
  
  const isActive = isHovered || (isDragging && activeHandle === dir)

  // If render prop is provided, use it
  if (render) {
    return (
      <div
        className="resize-handle"
        onPointerDown={(e) => onHandlePointerDown(dir, e)}
        onPointerUp={onHandlePointerUp}
        onPointerEnter={() => setIsHovered(true)}
        onPointerLeave={() => setIsHovered(false)}
        data-dir={dir}
        aria-hidden="true"
        style={{ cursor: `${dir}-resize` }}
      >
        {render({
          dir,
          active: isActive,
          dragging: isDragging && activeHandle === dir
        })}
      </div>
    )
  }

  // Default handle rendering
  return (
    <div
      className={['resize-handle', className].filter(Boolean).join(' ')}
      style={style}
      onPointerDown={(e) => onHandlePointerDown(dir, e)}
      onPointerUp={onHandlePointerUp}
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}
      data-dir={dir}
      data-active={isActive}
      aria-hidden="true"
    />
  )
}
