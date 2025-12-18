# Migration Guide

## Overview

The page-spliter project has been restructured into a proper **headless library** called `resume-layout-engine`. This guide helps you migrate from the old structure to the new one.

## What Changed?

### Old Structure (Deprecated)
```
src/
├── layout/
│   ├── RealtimeLayoutEngine.ts
│   └── RealtimeResumeEditor.ts
├── services/
├── types/
└── utils/
```

### New Structure
```
lib/                          # Library source code
├── core/
│   ├── LayoutEngine.ts       # Internal layout engine (was RealtimeLayoutEngine)
│   └── ResumeLayoutEngine.ts # Public API (was RealtimeResumeEditor)
├── services/
├── types/
└── utils/

examples/                     # Usage examples
├── vanilla/                  # Vanilla JS/TS example
└── react/                    # React example with hook
```

## Key Changes

### 1. Import Paths

**Old:**
```typescript
import { RealtimeResumeEditor } from './layout/RealtimeResumeEditor';
import type { TemplateConfig } from './types';
```

**New:**
```typescript
import { ResumeLayoutEngine } from './lib';
import type { LayoutEngineConfig } from './lib';
```

### 2. Class Names

| Old | New |
|-----|-----|
| `RealtimeResumeEditor` | `ResumeLayoutEngine` |
| `RealtimeLayoutEngine` | `LayoutEngine` (internal) |

### 3. Constructor

**Old:**
```typescript
const editor = new RealtimeResumeEditor(
  'resume-pages-container',  // String ID
  templateConfig
);
```

**New:**
```typescript
const engine = new ResumeLayoutEngine({
  container: '#resume-pages-container',  // Selector or HTMLElement
  template: templateConfig,
  page: pageConfig,
  events: eventCallbacks
});
```

### 4. Configuration

**Old:**
```typescript
const templateConfig: TemplateConfig = {
  style: {
    fontFamily: 'Arial',
    fontSize: '12px'
  }
};

const editor = new RealtimeResumeEditor('container-id', templateConfig);
```

**New:**
```typescript
const config: LayoutEngineConfig = {
  container: '#container-id',
  page: {
    height: 1123,
    marginTop: 20,
    marginBottom: 20,
    header: { height: 50 },
    footer: { height: 30 }
  },
  template: {
    style: {
      fontFamily: 'Arial',
      fontSize: '12px'
    }
  },
  events: {
    onPageCreated: (pageIndex) => { /* ... */ },
    onContentPlaced: (result) => { /* ... */ }
  }
};

const engine = new ResumeLayoutEngine(config);
```

### 5. UI-Specific Methods Removed

The following UI-specific methods have been **removed** and replaced with **event callbacks**:

**Old:**
```typescript
editor.updateRemainingSpaceDisplay();
editor.showSplitWarning();
editor.showOverflowWarning();
editor.showError();
```

**New:**
```typescript
const engine = new ResumeLayoutEngine({
  container: '#container',
  events: {
    onContentPlaced: (result) => {
      // Update UI with result.remainingSpace
      document.getElementById('space').textContent = `${result.remainingSpace}px`;
    },
    onOverflow: (contentType, required, available) => {
      // Show warning
      console.warn(`Overflow: ${contentType}`);
    },
    onError: (error) => {
      // Show error
      console.error(error);
    }
  }
});
```

### 6. New Methods

The new API includes additional methods:

```typescript
// Lifecycle
engine.reset();      // Clear all content
engine.destroy();    // Cleanup resources

// Information
engine.getPageCount();
engine.getRemainingSpace();
engine.getCurrentPageIndex();
engine.getSpaceBreakdown();
engine.getPages();

// Content management
await engine.addExperience(position);
await engine.addEducation(education);
await engine.addSkills(skills);
await engine.updateExperience(id, position);
engine.removeExperience(id);
```

## Migration Steps

### Step 1: Update Imports

Replace all imports from `src/` with imports from `lib/`:

```typescript
// Before
import { RealtimeResumeEditor } from './src/layout/RealtimeResumeEditor';

// After
import { ResumeLayoutEngine } from './lib';
```

### Step 2: Update Constructor Calls

Change from string ID to configuration object:

```typescript
// Before
const editor = new RealtimeResumeEditor('container-id', templateConfig);

// After
const engine = new ResumeLayoutEngine({
  container: '#container-id',
  template: templateConfig
});
```

### Step 3: Replace UI Methods with Events

Move UI update logic to event callbacks:

```typescript
// Before
editor.updateRemainingSpaceDisplay();

// After
const engine = new ResumeLayoutEngine({
  container: '#container',
  events: {
    onContentPlaced: (result) => {
      updateRemainingSpaceDisplay(result.remainingSpace);
    }
  }
});
```

### Step 4: Add Cleanup

Add cleanup when done:

```typescript
// When component unmounts or you're done
engine.destroy();
```

## React Migration

### Old Approach
```typescript
// Manual DOM manipulation
const editor = new RealtimeResumeEditor('container-id', config);
```

### New Approach
```typescript
// Use the hook
import { useResumeLayout } from './examples/react/useResumeLayout';

function MyComponent() {
  const { containerRef, engine, pageCount, remainingSpace } = useResumeLayout({
    template: { /* config */ }
  });

  return <div ref={containerRef} />;
}
```

## Breaking Changes

1. **Constructor signature changed** - Now accepts configuration object
2. **UI methods removed** - Use event callbacks instead
3. **Import paths changed** - Import from `lib/` instead of `src/`
4. **Class names changed** - `RealtimeResumeEditor` → `ResumeLayoutEngine`
5. **Container parameter** - Now accepts HTMLElement or selector string

## Benefits of New Structure

✅ **Headless** - No UI assumptions, framework-agnostic  
✅ **Better separation** - Library code vs. examples  
✅ **Event-driven** - React to changes with callbacks  
✅ **More flexible** - Comprehensive configuration  
✅ **Type-safe** - Full TypeScript support  
✅ **Easier to use** - Simpler API, better documentation  
✅ **Copy-paste ready** - Just copy `lib/` folder  

## Need Help?

- Check the [API Reference](docs/API.md)
- See [Examples](docs/EXAMPLES.md)
- Read [Architecture](docs/ARCHITECTURE.md)

