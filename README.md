# Resume Layout Engine

A **headless, framework-agnostic** TypeScript library for automatic resume page splitting with precise space calculation and layout management.

## ✨ Features

- 🎯 **Headless** - No UI assumptions, works with any framework
- 📄 **Automatic Page Splitting** - Intelligently splits content across pages
- 🛡️ **Orphan Detection** - Prevents titles from being left alone without their content
- 📏 **Precise Space Calculation** - Accurate measurement and placement
- 📊 **Multi-Column Layout** - Support for 2+ columns with configurable widths
- ⚛️ **Framework Agnostic** - Works with React, Vue, Angular, or vanilla JS
- 🔧 **Fully Configurable** - Customize page size, margins, spacing, and templates
- 📦 **TypeScript First** - Full type safety and IntelliSense support
- 🎨 **Event-Driven** - React to layout changes with callbacks
- 🚀 **Zero Dependencies** - Lightweight and fast

## 📦 Installation

```bash
npm install resume-layout-engine
```

Or using other package managers:

```bash
# Yarn
yarn add resume-layout-engine

# pnpm
pnpm add resume-layout-engine

# Bun
bun add resume-layout-engine
```

## 🚀 Quick Start

### Vanilla JavaScript/TypeScript

```typescript
import { ResumeLayoutEngine } from "resume-layout-engine";

const engine = new ResumeLayoutEngine({
  container: "#resume-container",
  template: {
    style: {
      fontFamily: "Arial, sans-serif",
      fontSize: "12px",
    },
  },
});

await engine.addExperience({
  _id: "work-1",
  title: "Software Engineer",
  company: "Tech Corp",
  startDate: "2020-01",
  endDate: "2023-12",
  description: [
    "Built REST API serving 1M+ requests/day",
    "Improved performance by 50%",
    "Led team of 5 developers",
  ],
});

console.log(`Pages: ${engine.getPageCount()}`);
console.log(`Remaining space: ${engine.getRemainingSpace()}px`);
```

### React

```tsx
import { ResumeLayoutEngine } from "resume-layout-engine";

function ResumePreview({ experiences }) {
  const { containerRef, engine, pageCount, remainingSpace } = useResumeLayout({
    template: {
      style: {
        fontFamily: "Arial, sans-serif",
        fontSize: "12px",
      },
    },
  });

  useEffect(() => {
    if (!engine) return;

    (async () => {
      for (const exp of experiences) {
        await engine.addExperience(exp);
      }
    })();
  }, [engine, experiences]);

  return (
    <div>
      <div>
        Pages: {pageCount} | Remaining: {remainingSpace}px
      </div>
      <div ref={containerRef} />
    </div>
  );
}
```

### Multi-Column Layout

Create professional multi-column resumes with configurable column widths:

```typescript
import { ResumeLayoutEngine } from "resume-layout-engine";

// Equal columns (50%/50%)
const engine = new ResumeLayoutEngine({
  container: "#resume-container",
  template: {
    style: {
      fontFamily: "Arial, sans-serif",
      fontSize: "12px",
      columnCount: 2,
      columnGap: 20, // Gap between columns in pixels
    },
  },
});

// Add content to specific columns
await engine.addExperience(workExperience, 0); // Left column
await engine.addEducation(education, 1); // Right column
await engine.addSkills(skills, 1); // Right column

// Custom column widths (60%/40%)
const customEngine = new ResumeLayoutEngine({
  container: "#resume-container",
  template: {
    style: {
      columnCount: 2,
      columnGap: 20,
      columnWidths: [3, 2], // 60% left, 40% right (3:2 ratio)
    },
  },
});

// Add content to wider left column
await customEngine.addExperience(workExperience, 0); // 60% column

// Add content to narrower right column
await customEngine.addEducation(education, 1); // 40% column
await customEngine.addSkills(skills, 1); // 40% column

// Check remaining space per column
const spaceLeft = customEngine.getRemainingSpace(0);
const spaceRight = customEngine.getRemainingSpace(1);
console.log(`Left: ${spaceLeft}px, Right: ${spaceRight}px`);
```

**Common Column Ratios:**

- `[1, 1]` - Equal columns (50%/50%)
- `[2, 1]` - Left column twice as wide (66.67%/33.33%)
- `[3, 2]` - Common resume layout (60%/40%)
- `[3, 1]` - Wide main column (75%/25%)

## 📖 Documentation

### Configuration

```typescript
interface LayoutEngineConfig {
  // Container element (HTMLElement or CSS selector)
  container: HTMLElement | string;

  // Page configuration
  page?: {
    height?: number; // Default: 1123 (A4 at 96 DPI)
    marginTop?: number; // Default: 20
    marginBottom?: number; // Default: 20
    header?: { height: number }; // Default: 50
    footer?: { height: number }; // Default: 30
  };

  // Template styling
  template?: TemplateConfig;

  // Event callbacks
  events?: {
    onPageCreated?: (pageIndex: number, pageElement: HTMLElement) => void;
    onContentPlaced?: (result: PlacementResult) => void;
    onOverflow?: (
      contentType: string,
      required: number,
      available: number
    ) => void;
    onError?: (error: Error) => void;
  };
}
```

### API Methods

```typescript
// Add content (with optional column selection for multi-column layouts)
await engine.addExperience(position: Position, columnIndex?: number): Promise<PlacementResult>
await engine.addEducation(education: Education, columnIndex?: number): Promise<PlacementResult>
await engine.addSkills(skills: Skill[], columnIndex?: number): Promise<PlacementResult>

// Update content
await engine.updateExperience(id: string, position: Position): Promise<PlacementResult>
await engine.updateEducation(id: string, education: Education): Promise<PlacementResult>

// Remove content
engine.removeExperience(id: string): void
engine.removeEducation(id: string): void

// Get information
engine.getPageCount(): number
engine.getRemainingSpace(columnIndex?: number): number  // Check specific column or default (0)
engine.getPages(): HTMLElement[]
engine.getCurrentPageIndex(): number
engine.getSpaceBreakdown(): SpaceBreakdown | null

// Lifecycle
engine.reset(): void     // Clear all content
engine.destroy(): void   // Cleanup resources
```

## 📁 Project Structure

```
resume-layout-engine/
├── lib/                    # Library source code
│   ├── core/              # Core layout engine
│   ├── services/          # Component factory & measurement
│   ├── types/             # TypeScript type definitions
│   ├── utils/             # Utility functions
│   └── index.ts           # Main entry point
├── examples/              # Usage examples
│   ├── vanilla/           # Vanilla JS/TS example
│   └── react/             # React example with hook
└── src/                   # Original demo (deprecated)
```

## 🎯 Examples

See the `examples/` folder for complete working examples:

- **Vanilla JS/TS**: `examples/vanilla/`
- **React**: `examples/react/`

Run the vanilla example:

```bash
npm run dev:vanilla
```

## 📚 Documentation

- **[API Reference](docs/API.md)** - Complete API documentation
- **[Examples](docs/EXAMPLES.md)** - Usage examples and patterns
- **[Architecture](docs/ARCHITECTURE.md)** - Internal architecture and design

## 🏗️ How It Works

The engine follows a **four-phase layout process**:

1. **Create Component** - Transform data into DOM elements
2. **Measure Component** - Calculate exact height using hidden container
3. **Check Available Space** - Compare required vs. available space
4. **Place or Overflow** - Place on current page or create new page

Each page maintains its own `SpaceCalculator` that tracks:

- Fixed elements (header, footer, margins)
- Dynamic content (placed components)
- Remaining space

When content doesn't fit, the engine automatically creates a new page and places the content there.

## 🤝 Contributing

Contributions are welcome! This is currently a proof-of-concept that can be extended with:

- [ ] More content types (Projects, Certifications, etc.)
- [ ] Content splitting (split large components across pages)
- [ ] Custom renderers
- [ ] PDF export
- [ ] More examples (Vue, Angular, Svelte)

## 📄 License

MIT
