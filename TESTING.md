# Local Testing Guide for resz

This guide explains how to test the `resz` component locally during development.

## Setup for Local Testing

### 1. In the resz Component Repository

First, build and link the component locally:

```bash
# Build and create a local link
npm run link:dev
```

This will:
1. Build the component
2. Create a global symlink for local development

### 2. In Your Test Project

Link the component to your test project:

```bash
# Create a new directory for testing (if needed)
mkdir resz-testing && cd resz-testing

# Initialize a new React project (if needed)
npm create vite@latest . -- --template react-ts

# Install dependencies
npm install

# Link the resz component
npm link resz
```

## Development Workflow

1. Start the watch mode in the resz component:
```bash
npm run dev
```

2. Start your test project:
```bash
npm run dev
```

3. Import and use the component in your test project:
```tsx
import { Resizable } from 'resz'

function App() {
  return (
    <Resizable>
      <div>Resizable Content</div>
    </Resizable>
  )
}
```

## Cleaning Up

When you're done testing, unlink the component:

```bash
# In your test project
npm unlink resz

# In the resz component directory
npm unlink
```

## Troubleshooting

If you encounter any issues:

1. Make sure the component is built (`npm run build`)
2. Check that the link was created successfully (`npm ls -g`)
3. Try removing and relinking if updates aren't reflecting
4. Clear npm cache if needed (`npm cache clean --force`)
