# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### 🐛 Fixed

- **Smart Column Placement** - Fixed multi-column content placement to fill earlier pages first

  - Content now fills the earliest page with available space in the target column
  - Prevents creating new pages when earlier pages have empty columns
  - Optimizes space utilization across all pages
  - Example: If page 1 left column is full but right column is empty, adding content to the right column now correctly fills page 1 instead of creating page 2

- **Smart Split Header Duplication** - Fixed position/education headers being duplicated on continuation pages
  - Position headers (title, company, dates) now only appear on the first page
  - Education headers (degree, institution, year) now only appear on the first page
  - Continuation pages show only the remaining bullet points/descriptions
  - Added visual indicator ("(continued)") with yellow border for split continuations
  - Prevents confusing duplicate headers when content is split across pages

### 🔧 Improved

- **Internal Logic**

  - Added `findFirstAvailablePage()` method to search for available space across all pages
  - Modified `placeContent()` to use intelligent page selection instead of always using the latest page
  - Better space utilization in multi-column layouts

- **Component Rendering**
  - `ComponentFactory.createPositionComponent()` now checks `_splitContinuation` flag before rendering header
  - `ComponentFactory.createEducationComponent()` now checks `_splitContinuation` flag before rendering header
  - Cleaner continuation rendering with visual indicators

## [1.2.0] - 2025-12-20

### ✨ Added

#### Multi-Column Layout Enhancements

- **Configurable Column Widths** - Support for custom column width ratios

  - Added `columnWidths?: number[]` to `TemplateConfig`
  - Supports ratio-based widths (e.g., `[2, 1]` for 2:1, `[3, 2]` for 60%/40%)
  - Falls back to equal widths if not specified
  - Validation warning if array length doesn't match `columnCount`

- **Column Support for All Content Types**
  - `addEducation(education, columnIndex?)` - Now supports column selection
  - `addSkills(skills, columnIndex?)` - Now supports column selection
  - `getRemainingSpace(columnIndex?)` - Can check specific columns
  - All methods default to column 0 for backward compatibility

### 🐛 Fixed

- **Column Overflow Issue** - Fixed columns overflowing page boundaries
  - Switched from CSS Grid to Flexbox for multi-column layouts
  - Columns now use explicit pixel widths matching calculated values
  - Added `flex-shrink: 0` and `flex-grow: 0` to prevent unwanted resizing
  - Ensures content stays within page template boundaries

### 🔧 Improved

- **Code Quality**

  - Created `calculateColumnWidth()` helper method
  - Eliminated code duplication across content methods
  - Centralized column width calculation logic
  - Moved `calculateColumnWidth()` before `createNewPage()` for better code organization

- **Documentation**
  - Updated API documentation with multi-column examples
  - Added comprehensive JSDoc comments
  - Included usage examples for different column ratios

### 🎯 Example Usage

```typescript
// 60%/40% column layout
const engine = new ResumeLayoutEngine({
  container: "#resume",
  template: {
    style: {
      columnCount: 2,
      columnWidths: [3, 2], // 60%/40%
    },
  },
});

await engine.addExperience(position, 0); // Wide column (60%)
await engine.addEducation(education, 1); // Narrow column (40%)
await engine.addSkills(skills, 1); // Narrow column (40%)

// Check remaining space per column
const spaceLeft = engine.getRemainingSpace(0);
const spaceRight = engine.getRemainingSpace(1);
```

### 🔄 Breaking Changes

None - All changes are backward compatible.

---
