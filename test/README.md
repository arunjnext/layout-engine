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

1. **Test Smart Split** - Tests a large experience entry that should split across pages
2. **Test Whole Block Move** - Fills a page first, then adds an entry that should move entirely
3. **Test Multiple Positions** - Tests multiple positions with smart splitting
4. **Test Education Split** - Tests education entry splitting
5. **Test Small Entry (Fits)** - Tests a small entry that should fit entirely
6. **Clear All** - Clears the resume and resets

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

## Customization

You can modify:
- `test-scenarios.ts` - Add new test data
- `main.ts` - Add new test buttons and scenarios
- `styles.css` - Customize the appearance
- Split guidelines in `main.ts` - Test different splitting behaviors

## Benefits

✅ No npm publish required  
✅ Fast iteration cycle  
✅ Visual testing with real UI  
✅ Easy to add new test scenarios  
✅ Hot reload during development  

