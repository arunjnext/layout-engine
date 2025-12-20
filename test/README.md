# Testing Playground

This directory contains a vanilla JavaScript testing playground for the Resume Layout Engine. Use this to test features locally without publishing to npm.

## Quick Start

### Option 1: Quick Test (Build + Run)

```bash
npm run test
```

This builds the library and starts the test server.

### Option 2: Development Mode (Watch + Test)

```bash
# Terminal 1: Watch and rebuild library on changes
npm run build:watch

# Terminal 2: Run test playground
npm run dev:test
```

## Test Scenarios

The playground includes several test scenarios:

### Basic Tests

1. **Test Smart Split** - Tests a large experience entry that should split across pages
2. **Test Whole Block Move** - Fills a page first, then adds an entry that should move entirely
3. **Test Multiple Positions** - Tests multiple positions with smart splitting
4. **Test Education Split** - Tests education entry splitting
5. **Test Small Entry (Fits)** - Tests a small entry that should fit entirely

### Multi-Column Tests

6. **Test Two Columns (50/50)** - Tests equal-width two-column layout
7. **Test Custom Widths (60/40)** - Tests custom column width ratios
8. **Test Smart Column Fill** - Tests intelligent column filling across pages

### Orphan Detection Tests (NEW!)

9. **🛡️ Test Orphan Prevention** - Demonstrates orphan detection preventing titles from being left alone

   - Fills a page with content
   - Adds a position with title + intro + 3 statements
   - With orphan detection enabled, the entire block moves to next page if statements don't fit
   - **Compare with test #11** to see the difference

10. **🔗 Test Cascading Detection** - Shows how orphan detection cascades up the hierarchy

    - Tests the cascading logic: statements → intro → title
    - If statements move, intro might be orphaned
    - If intro is orphaned, title might be orphaned
    - Demonstrates multi-level orphan prevention

11. **❌ Test Without Orphan Detection** - Compare behavior when orphan detection is disabled

    - Same scenario as test #9
    - Orphan detection is turned OFF
    - Titles may be left alone on previous page
    - **Compare with test #9** to see the impact of orphan detection

12. **📊 Test Min Children Threshold** - Tests the `minChildrenToAvoidOrphan` setting
    - Sets threshold to 2 (requires at least 2 children)
    - If only 1 statement fits with title, entire block moves
    - Demonstrates configurable orphan thresholds

### Controls

13. **Clear All** - Clears the resume and resets

## How It Works

- The test playground imports directly from `../lib` using Vite's alias configuration
- No npm publish needed - changes to the library are immediately available
- Hot module replacement works for fast iteration
- Visual feedback shows split indicators (green for partial, yellow for continuation)

## File Structure

```
test/
├── index.html          # Test page HTML
├── main.ts            # Main test runner
├── test-scenarios.ts  # Test data scenarios
├── styles.css         # Styling
├── vite.config.ts     # Vite configuration
└── tsconfig.json      # TypeScript config
```

## Orphan Detection

The orphan detection feature prevents poor visual hierarchy by ensuring parent elements (titles, headings) are not left alone when all their children (list items) move to the next page.

### How to Test Orphan Detection

1. **Run the test server**: `npm run test`
2. **Open browser console** to see detailed orphan detection logs
3. **Click orphan detection test buttons** (green buttons with 🛡️, 🔗, ❌, 📊 icons)
4. **Compare results** between enabled/disabled tests

### What to Look For

- **With orphan detection enabled**: Titles should always have at least 1 child on the same page
- **With orphan detection disabled**: Titles may be left alone on a page
- **Console logs**: Look for "Orphan detected" warnings in the browser console
- **Visual indicators**: Split content shows colored borders (green for partial, yellow for continuation)

### Configuration Options

```typescript
splitGuidelines: {
  preventOrphans: true,              // Enable orphan detection
  minChildrenToAvoidOrphan: 1,       // Minimum children required
  cascadeOrphanDetection: true,      // Check parent hierarchy
}
```

See [docs/ORPHAN_DETECTION.md](../docs/ORPHAN_DETECTION.md) for detailed documentation.

## Customization

You can modify:

- `test-scenarios.ts` - Add new test data (includes `orphanTestPosition` and `manyStatementsPosition`)
- `main.ts` - Add new test buttons and scenarios
- `styles.css` - Customize the appearance
- Split guidelines in `main.ts` - Test different splitting behaviors and orphan detection settings

## Benefits

✅ No npm publish required  
✅ Fast iteration cycle  
✅ Visual testing with real UI  
✅ Easy to add new test scenarios  
✅ Hot reload during development
