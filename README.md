# resz

Spring-based resizing for React. 
[**Try it live →**](https://resz.mehdib.me/)

[![npm version](https://img.shields.io/npm/v/resz.svg?style=flat&colorA=18181B&colorB=E5E5E5)](https://www.npmjs.com/package/resz)
[![minzipped size](https://img.shields.io/bundlephobia/minzip/resz?style=flat&colorA=18181B&colorB=E5E5E5)](https://bundlephobia.com/package/resz)

```bash
npm install resz
```

```jsx
import { Resize, Handle } from 'resz'

<Resize>
  <div>Your content</div>
  <Handle dir="se" />
</Resize>
```

## Why

Making spring animations for resize animations can be pretty long. Or at least that how it felt for me as a designer. 
So here is something that can help you have something that feels right, quickly and with a visual configurator: https://resz.mehdib.me/

**resz** uses real spring physics. The same mental model you have when you pull and release something in the physical world. You can personalize it the way your interface needs to be.

## Presets

Three presets, carefully tuned:

- `gentle` — Soft, graceful
- `smooth` — Balanced, default
- `snappy` — Quick, responsive

```jsx
<Resize preset="snappy">
  <Editor />
</Resize>
```

Or tune your own physics:

```jsx
<Resize 
  config={{ 
    tension: 170, 
    friction: 26, 
    mass: 1 
  }}
/>
```

## Constraints

Keep things in check:

```jsx
<Resize
  constraints={{
    min: { width: 200 },
    max: { width: 800 },
    aspectRatio: 16/9
  }}
/>
```


## Handles

Use ours or bring your own:

```jsx
// Any direction
<Handle dir="n" />
<Handle dir="e" />
<Handle dir="se" />

// Your own style
<Handle 
  dir="se"
  render={({ active, dragging }) => (
    <motion.div 
      className={cn(
        "w-3 h-3 rounded-full bg-white shadow-sm",
        active && "scale-110",
        dragging && "bg-blue-500"
      )}
      whileHover={{ scale: 1.2 }}
      transition={{ type: "spring", stiffness: 400 }}
    />
  )}
/>
```

## Details

- 60fps performance
- 3.5kb gzipped
- Fully typed
- No runtime dependencies

---

[Demo](https://resz.mehdib.me/) · [GitHub](https://github.com/mehdibouakkadia/resz) · [Mehdi Bouakkadia](https://github.com/mehdibouakkadia)