# ⚠️ DEPRECATED

This directory contains the **old implementation** and is **deprecated**.

## Migration

The project has been restructured into a proper headless library. Please use the new structure:

- **Library code**: `lib/` directory
- **Examples**: `examples/` directory
- **Documentation**: `docs/` directory

## New Usage

Instead of:
```typescript
import { RealtimeResumeEditor } from './src/layout/RealtimeResumeEditor';
```

Use:
```typescript
import { ResumeLayoutEngine } from './lib';
```

## Migration Guide

See [MIGRATION.md](../MIGRATION.md) for complete migration instructions.

## Why Deprecated?

The old structure had several issues:
- ❌ Tightly coupled to UI
- ❌ Not framework-agnostic
- ❌ Hard to use as a library
- ❌ Mixed demo code with library code

The new structure is:
- ✅ Headless and framework-agnostic
- ✅ Clean separation of concerns
- ✅ Easy to copy and use
- ✅ Better documentation
- ✅ Event-driven architecture

## Timeline

This directory will be removed in a future version. Please migrate to the new structure.

