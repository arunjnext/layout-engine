# Orphan Detection System

## Overview

The orphan detection system prevents poor visual hierarchy by ensuring that parent elements (titles, headings, intro text) are not left alone on a page when all their child elements (list items, statements) are moved to the next page.

## What is an Orphan?

An **orphan** occurs when a hierarchical block structure is split across pages in a way that leaves a parent element isolated without its children. This creates poor readability and breaks the visual hierarchy.

### Example of an Orphan

**Bad Layout (Orphaned):**
```
Page 1:
├── Senior Software Engineer at Tech Corp (2020-2024)
└── Led a team of engineers... (intro text)

Page 2:
├── • Architected microservices architecture
├── • Led migration to cloud infrastructure
└── • Mentored junior developers
```

**Good Layout (No Orphan):**
```
Page 1:
└── [Other content]

Page 2:
├── Senior Software Engineer at Tech Corp (2020-2024)
├── Led a team of engineers... (intro text)
├── • Architected microservices architecture
├── • Led migration to cloud infrastructure
└── • Mentored junior developers
```

## Architecture

The orphan detection system works at two levels:

### 1. Block-Level Detection (PositionSplitter)

During the smart splitting process, the system checks if a proposed split would create orphans:

- **When**: During `splitAtStatements()` before finalizing the split
- **What**: Analyzes the content structure to detect orphaned parents
- **Action**: Returns `null` to trigger "move entire block" behavior

### 2. Engine-Level Detection (LayoutEngine)

After content is placed on a page, validates the final layout:

- **When**: After `placeComponentOnCurrentPage()` completes
- **What**: Checks if the last element on a page is orphaned
- **Action**: Logs warning (future: could auto-move to next page)

## Configuration

Orphan detection is controlled through `SplitGuidelines`:

```typescript
interface SplitGuidelines {
  /** Prevent orphaned headings/titles (default: true) */
  preventOrphans?: boolean;

  /** Minimum children required to avoid orphan (default: 1) */
  minChildrenToAvoidOrphan?: number;

  /** Cascade orphan detection up hierarchy (default: true) */
  cascadeOrphanDetection?: boolean;
}
```

### Usage Example

```typescript
const engine = new ResumeLayoutEngine({
  container: '#resume',
  splitGuidelines: {
    preventOrphans: true,              // Enable orphan detection
    minChildrenToAvoidOrphan: 1,       // Require at least 1 child
    cascadeOrphanDetection: true,      // Check parent hierarchy
  }
});
```

## Hierarchy Levels

The system understands the following hierarchy in Position/Education blocks:

```
Position Block
├── Title (Level 1: Main heading)
│   └── company + dates
├── Intro (Level 2: Subtitle/context)
│   └── paragraph text
└── Description (Level 3: Children)
    ├── statement 1
    ├── statement 2
    └── statement 3
```

## Orphan Detection Logic

### Definition of Orphan

An element is orphaned when:
1. It's a **parent element** (title or intro)
2. It's the **last element on a page**
3. **All its child elements** are on the next page
4. It has **fewer than `minChildrenToAvoidOrphan`** children on the same page

### Cascading Detection

When `cascadeOrphanDetection` is enabled, the system checks upward through the hierarchy:

1. **Level 3**: If all statements move to next page → intro might be orphaned
2. **Level 2**: If intro is orphaned → title might be orphaned
3. **Level 1**: If title is orphaned → move entire block

### Decision Matrix

| Current Page Content | Next Page Content | Orphaned? | Action |
|---------------------|-------------------|-----------|---------|
| Title only | Intro + Statements | ✅ Yes | Move entire block |
| Title + Intro | All Statements | ✅ Yes | Move entire block |
| Title + Intro + 1 stmt | Remaining statements | ❌ No | Keep split |
| Title + 2 statements | Remaining statements | ❌ No | Keep split |

## Implementation Details

### OrphanDetector Service

Located in `lib/services/OrphanDetector.ts`, provides:

- `checkSplitForOrphans()`: Block-level orphan detection
- `detectOrphansOnPage()`: Engine-level orphan detection
- `analyzeContent()`: Content structure analysis
- `identifyOrphanedElements()`: Orphan identification logic

### Integration Points

1. **PositionSplitter** (`lib/splitters/position/PositionSplitter.ts`):
   ```typescript
   const orphanCheck = this.orphanDetector.checkSplitForOrphans(
     currentPagePosition,
     nextPagePosition,
     orphanOptions
   );
   
   if (orphanCheck.isOrphaned && orphanCheck.recommendation === 'MOVE_ENTIRE_BLOCK') {
     return null; // Don't split
   }
   ```

2. **LayoutEngine** (`lib/core/LayoutEngine.ts`):
   ```typescript
   const orphanInfo = this.orphanDetector.detectOrphansOnPage(currentPage, columnIndex);
   if (orphanInfo && orphanInfo.shouldMove) {
     console.warn('Orphan detected:', orphanInfo);
   }
   ```

## Edge Cases

### 1. First Page Orphan
If a title would be orphaned on the first page, it's kept (nowhere to move back to).

### 2. Entire Block Too Large
If moving an orphaned element would cause overflow on the next page, the original split is kept.

### 3. Multi-Column Layouts
Orphan detection works per column, not per page.

### 4. Minimum Content Rule
If moving an orphan would leave the current page empty, the system reconsiders the decision.

## Testing

Test scenarios are available in `test/test-scenarios.ts`:

- `orphanTestPosition`: Position designed to test orphan detection
- `manyStatementsPosition`: Tests orphan prevention with many statements

## Future Enhancements

1. **Auto-Resolution**: Automatically move orphaned content to next page (currently logs warning)
2. **Configurable Thresholds**: Allow different thresholds per content type
3. **Visual Indicators**: Add CSS classes to orphaned elements for debugging
4. **Metrics**: Track orphan detection frequency for optimization

