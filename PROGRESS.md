## Progress Log

### Milestone 1: Basic Spring Physics Resize

- Status: Implemented core `SpringResize` with single SE handle
- Demo: `src/App.tsx` renders a resizable panel with spring physics

What works:
- Semi-implicit Euler spring loop at 60fps target
- Dragging the SE handle updates target dimensions; spring animates current size
- Animation settles and stops when close to target and velocity is small
- Configurable tension, friction, mass

Known issues / TODO:
- No constraints beyond a hardcoded 50px min width/height
- No touch/multi-pointer gesture nuance yet (basic PointerEvents only)
- No sound integration yet
- No multi-direction handles yet

Next (after approval):
- Milestone 2: Add all 8 handles with proper cursors and hover discovery

### Milestone 2: Multi-directional Handles

- Status: Implemented all 8 handles (n, s, e, w, ne, nw, se, sw)
- Demo: `src/App.tsx` updated to indicate Milestone 2

What works:
- Direction-aware drag math for edges/corners
- Spring-animated x/y translation for north/west edges (container translates via transform)
- Hover discovery with correct cursors

Known issues / TODO:
- Same hard min size (50px) remains
- No constraints or aspect ratio locking yet
- No touch gesture refinement yet

Next (after approval):
- Milestone 3: Configuration system with presets and live updates

### Milestone 3: Configuration System

- Status: Presets added (`gentle`, `professional`, `snappy`) with prop override merging
- Live updates supported via `preset` and `config` props
- `onResize` callback fires each frame with `{ width, height, x, y, isDragging }`

What works:
- Changing presets while idle or dragging immediately affects the spring feel
- Dimensions are reported live for HUDs/analytics

Known issues / TODO:
- No constraints props yet (min/max, aspect ratio)

Next (after approval):
- Milestone 5: API Polish (compound components, TypeScript improvements)

Note: Sound integration (previously Milestone 4) moved to future update to focus on API quality first.

### Milestone 5: API Polish

- Status: Implemented compound component pattern with `Resize`, `Resize.Panel`, and `Resize.Handle`
- Demo updated to showcase new component structure

What works:
- Clean compound component API for flexible handle placement
- Proper TypeScript types and JSDoc comments
- Consistent naming and style patterns
- Demo shows all three presets with compound components

Example usage:
```tsx
<Resize preset="professional">
  <Resize.Panel>
    Your content here
  </Resize.Panel>
  <Resize.Handle dir="se" />
  <Resize.Handle dir="nw" />
</Resize>
```

Next:
- Package and publish to npm
- Add constraints API (min/max, aspect ratio)
- Add sound integration

### Version 0.2.0: Breaking Changes

- **Removed anchor prop**: The `anchor` prop has been removed as most users work with pre-positioned elements. All resize handles now behave consistently:
  - East handles grow right
  - West handles grow left
  - South handles grow down
  - North handles grow up
  - The component no longer restricts resize directions based on anchoring

- **Removed default styling**: The `.resize-root` class no longer applies any visual styling (background, border, border-radius). This gives users full control over the appearance of their resizable components.

Migration: 
- Remove the `anchor` prop from your `<Resize>` components
- If you were relying on the default dark background/border styling, add your own styles to the component