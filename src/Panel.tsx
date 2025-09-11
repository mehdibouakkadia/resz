import type { PanelProps } from './types'
import './style.css'

/**
 * The resizable content area within a Resize component.
 * Must be used as a child of a Resize component.
 */
export function Panel({ children, className, style }: PanelProps) {
  return (
    <div 
      className={['resize-panel', className].filter(Boolean).join(' ')}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        background: 'inherit',
        ...style,
      }}
    >
      {children}
    </div>
  )
}