# Changelog

## [1.0.0] - 2025-12-18

### 🎉 Major Restructure - Headless Library

Complete restructure of the project into a proper headless, framework-agnostic library.

### ✨ Added

#### Library Structure
- **`lib/`** - New library source code directory
  - `lib/core/` - Core layout engine
    - `LayoutEngine.ts` - Internal layout engine (refactored from RealtimeLayoutEngine)
    - `ResumeLayoutEngine.ts` - Public API (refactored from RealtimeResumeEditor)
  - `lib/services/` - Component factory and measurement services
  - `lib/types/` - Comprehensive TypeScript type definitions
  - `lib/utils/` - Utility functions and space calculator
  - `lib/index.ts` - Main entry point with exports

#### Examples
- **`examples/vanilla/`** - Vanilla JavaScript/TypeScript example
  - Complete working demo with stats display
  - Event-driven UI updates
  - Demonstrates all core features
- **`examples/react/`** - React integration example
  - `useResumeLayout.ts` - Custom React hook
  - `ResumePreview.tsx` - Example component
  - Full TypeScript support

#### Documentation
- **`README.md`** - Comprehensive project documentation
- **`docs/API.md`** - Complete API reference
- **`docs/EXAMPLES.md`** - Usage examples and patterns
- **`docs/ARCHITECTURE.md`** - Internal architecture documentation
- **`MIGRATION.md`** - Migration guide from old structure
- **`CHANGELOG.md`** - This file

#### Configuration
- **`tsconfig.lib.json`** - TypeScript config for library build
- **`examples/vanilla/vite.config.ts`** - Vite config for vanilla example
- Updated `package.json` with library metadata

### 🔄 Changed

#### API Changes
- **Constructor**: Now accepts configuration object instead of separate parameters
  ```typescript
  // Old
  new RealtimeResumeEditor('container-id', templateConfig)
  
  // New
  new ResumeLayoutEngine({ container: '#container-id', template: templateConfig })
  ```

- **Container parameter**: Now accepts both HTMLElement and CSS selector string
- **Event-driven**: Replaced UI-specific methods with event callbacks
  - `onPageCreated` - New page created
  - `onContentPlaced` - Content placed successfully
  - `onOverflow` - Content doesn't fit on current page
  - `onError` - Error occurred

#### Class Names
- `RealtimeResumeEditor` → `ResumeLayoutEngine` (public API)
- `RealtimeLayoutEngine` → `LayoutEngine` (internal)

#### Type Organization
- Split types into logical modules:
  - `types/config.ts` - Configuration types
  - `types/resume.ts` - Resume data types
  - `types/measurement.ts` - Measurement types

### 🚀 Improved

#### Architecture
- **Headless design** - No UI assumptions, framework-agnostic
- **Clean separation** - Library code vs. examples
- **Event-driven** - React to layout changes with callbacks
- **Better encapsulation** - Clear public vs. internal APIs
- **Type safety** - Comprehensive TypeScript types

#### Developer Experience
- **Easy to use** - Copy `lib/` folder or install via npm (future)
- **Better documentation** - Comprehensive guides and examples
- **React support** - Custom hook for easy React integration
- **Multiple examples** - Vanilla JS and React examples

#### Code Quality
- **Single responsibility** - Each class has one clear purpose
- **Dependency injection** - Dependencies injected, not created
- **Immutability** - Configuration objects not mutated
- **Memory management** - Proper cleanup with `destroy()` method

### 🗑️ Deprecated

- **`src/`** directory - Old implementation marked as deprecated
  - Added `src/README.md` with deprecation notice
  - Will be removed in future version
  - See `MIGRATION.md` for migration instructions

### ❌ Removed

#### UI-Specific Methods
These methods were tightly coupled to UI and have been replaced with event callbacks:
- `updateRemainingSpaceDisplay()` → Use `onContentPlaced` event
- `showSplitWarning()` → Use `onOverflow` event
- `showOverflowWarning()` → Use `onOverflow` event
- `showError()` → Use `onError` event

### 📦 Package Changes

- **Name**: `page-spliter` → `resume-layout-engine`
- **Version**: `0.0.0` → `1.0.0`
- **Type**: Added proper package metadata
- **Exports**: Configured for library usage
- **Scripts**: Added `dev:vanilla` and `build:lib` scripts

### 🔧 Technical Details

#### New Features
- `reset()` - Clear all pages and start fresh
- `destroy()` - Cleanup resources and prevent memory leaks
- `getSpaceBreakdown()` - Get detailed space breakdown
- `getCurrentPageIndex()` - Get current page index
- `updateExperience()` / `updateEducation()` - Update existing content
- `removeExperience()` / `removeEducation()` - Remove content by ID

#### Improvements
- Per-page space tracking with individual `SpaceCalculator` instances
- Better margin handling with support for both new and legacy config
- Improved error handling with try-catch and error events
- Automatic cleanup on destroy

### 📝 Migration

See [MIGRATION.md](MIGRATION.md) for complete migration instructions from the old structure.

### 🎯 Future Plans

- [ ] NPM package publication
- [ ] Content splitting (split large components across pages)
- [ ] More content types (Projects, Certifications, etc.)
- [ ] PDF export functionality
- [ ] More framework examples (Vue, Angular, Svelte)
- [ ] Visual regression tests
- [ ] Performance optimizations

---

## [0.0.0] - Previous

Initial proof-of-concept implementation with tightly coupled UI logic.

