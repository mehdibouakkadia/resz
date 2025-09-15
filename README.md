# resz

<div align="center">
  <h3>Spring Physics Resizing for React</h3>
  <p>Smooth, natural resizing that feels physical and responsive</p>
</div>

<br/>

`resz` brings physical, spring-based resizing to React components. Unlike CSS transitions, it provides natural, momentum-based interactions that respond to user input in real-time. Perfect for editors, panels, and any UI that needs premium-feeling resize interactions.

## Why resz?

- **🎯 Natural Feel**: Spring physics creates organic, responsive motion that traditional CSS transitions can't match
- **⚡️ 60fps Performance**: Optimized animation loop ensures smooth resizing even during rapid interactions
- **🎨 Customizable Physics**: Fine-tune spring parameters (tension, friction, mass) or use presets for the perfect feel
- **📐 Multi-directional**: Resize from any edge or corner with proper cursor indicators
- **🔒 Smart Constraints**: Set min/max dimensions and maintain aspect ratios effortlessly
- **📍 Grid Snapping**: Optional grid alignment for pixel-perfect layouts
- **💅 Flexible Styling**: Style handles with CSS or provide custom React components

## Quick Start

```bash
npm install resz
```

```jsx
import { Resize } from 'resz'
import 'resz/dist/style.css'

function App() {
  return (
    <Resize preset="professional">
      <Resize.Panel>
        <div>Resizable Content</div>
      </Resize.Panel>
      <Resize.Handle dir="se" />
    </Resize>
  )
}
```

## Spring Physics Presets

Choose from three carefully tuned presets or customize your own:

- **gentle**: Soft, smooth motion with less resistance
- **professional**: Balanced feel for precise control (default)
- **snappy**: Quick response with minimal oscillation

```jsx
// Using a preset
<Resize preset="professional" />

// Custom physics
<Resize config={{ tension: 170, friction: 26, mass: 1 }} />
```

## Advanced Usage

### Custom Handles

Style handles with CSS or provide your own components:

```jsx
// CSS styling
<Resize.Handle 
  dir="se" 
  style={{ 
    background: 'white',
    borderRadius: 4,
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  }} 
/>

// Custom component
<Resize.Handle
  dir="se"
  render={({ active }) => (
    <div className={active ? 'handle-active' : 'handle'}>
      <DragIcon />
    </div>
  )}
/>
```

### Constraints & Grid Snapping

Keep dimensions within bounds and snap to a grid:

```jsx
<Resize
  constraints={{
    min: { width: 200, height: 150 },
    max: { width: 800, height: 600 },
    aspectRatio: 16/9
  }}
  snapIncrement={40}  // Always snap to 40px grid
/>
```

## API Reference

### Resize Component

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `initialWidth` | number | `300` | Initial width in pixels |
| `initialHeight` | number | `200` | Initial height in pixels |
| `preset` | "gentle" \| "professional" \| "snappy" | "professional" | Spring physics preset |
| `config` | { tension: number, friction: number, mass: number } | - | Custom spring configuration |
| `constraints` | { min?: { width?: number, height?: number }, max?: { width?: number, height?: number }, aspectRatio?: number } | - | Size constraints |
| `snapIncrement` | number | - | Grid size for snapping (e.g., 40 for 40px grid) |
| `style` | CSSProperties | - | Container styles |
| `onResize` | (width: number, height: number, isDragging: boolean) => void | - | Resize callback |

### Handle Component

| Prop | Type | Description |
|------|------|-------------|
| `dir` | "n" \| "s" \| "e" \| "w" \| "ne" \| "nw" \| "se" \| "sw" | Handle direction |
| `style` | CSSProperties | Handle styles |
| `render` | (props: { active: boolean }) => ReactNode | Custom render function |

## Local Development

Test the package locally:

```bash
# In the resz directory
npm run build
npm link

# In your project directory
npm link resz
```

## License

MIT © [Mehdi Bouakkadia](https://github.com/mehdibouakkadia)