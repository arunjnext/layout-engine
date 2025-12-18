# React Example - Resume Layout Engine

This is a complete React + Vite demo application showcasing the **Resume Layout Engine** - a headless library for automatic resume page splitting with TypeScript support.

## Features

- 🎯 **Automatic Page Splitting** - Content automatically flows across multiple pages
- 📊 **Real-time Stats** - Live page count and remaining space indicators
- 🎨 **Beautiful UI** - A4-sized pages with professional styling
- 🔄 **Live Reload** - Vite HMR for instant feedback during development
- 📱 **Responsive** - Works on desktop and mobile devices
- 🎭 **Headless** - Pure layout engine without UI opinions

## Getting Started

### Installation

```bash
# Install dependencies (using bun)
bun install

# Or using npm
npm install

# Or using yarn
yarn install
```

### Development

```bash
# Start the development server
bun run dev

# Or
npm run dev
```

The app will be available at `http://localhost:5173`

### Build

```bash
# Build for production
bun run build

# Or
npm run build
```

### Preview Production Build

```bash
# Preview the production build
bun run preview

# Or
npm run preview
```

## Project Structure

```
examples/react/
├── src/
│   ├── App.tsx              # Main application component
│   ├── App.css              # Application styles
│   ├── ResumePreview.tsx    # Resume preview component
│   ├── useResumeLayout.ts   # Custom React hook for layout engine
│   ├── sampleData.ts        # Sample resume data
│   ├── main.tsx             # React entry point
│   └── index.css            # Global styles
├── index.html               # HTML template
├── vite.config.ts           # Vite configuration
├── package.json             # Dependencies
└── README.md                # This file
```

## Usage

### Basic Usage with Hook

The `useResumeLayout` hook provides a simple interface to the layout engine:

```tsx
import { useResumeLayout } from './useResumeLayout';

function MyComponent() {
  const { containerRef, engine, pageCount, remainingSpace, isReady } = useResumeLayout({
    page: {
      height: 1123,  // A4 at 96 DPI
      marginTop: 20,
      marginBottom: 20,
      header: { height: 50 },
      footer: { height: 30 }
    },
    template: {
      style: {
        fontFamily: 'Arial, sans-serif',
        fontSize: '12px',
        lineHeight: 1.5
      }
    }
  });

  useEffect(() => {
    if (!engine || !isReady) return;
    
    (async () => {
      await engine.addExperience({
        _id: 'work-1',
        title: 'Software Engineer',
        company: 'Tech Corp',
        description: ['Built APIs', 'Led team']
      });
    })();
  }, [engine, isReady]);

  return (
    <div>
      <div>Pages: {pageCount} | Space: {remainingSpace}px</div>
      <div ref={containerRef} />
    </div>
  );
}
```

### Using the ResumePreview Component

For a ready-to-use solution, use the `ResumePreview` component:

```tsx
import { ResumePreview } from './ResumePreview';

function App() {
  const experiences = [
    {
      _id: 'work-1',
      title: 'Senior Software Engineer',
      company: 'Tech Corp',
      startDate: '2021-01',
      endDate: '2024-12',
      description: ['Led API development', 'Mentored junior developers']
    }
  ];

  return <ResumePreview experiences={experiences} />;
}
```

## Key Components

### useResumeLayout Hook

A custom React hook that wraps the `ResumeLayoutEngine`:

- Manages containerRef and engine instance
- Provides reactive state (pageCount, remainingSpace, isReady)
- Auto cleanup on component unmount
- Memoized helper methods

### ResumePreview Component

A complete preview component that:

- Uses the `useResumeLayout` hook
- Displays stats panel with page count and remaining space
- Renders resume pages with automatic splitting
- Handles adding experiences when engine is ready

## Configuration

### Page Configuration

```typescript
{
  height: 1123,        // A4 at 96 DPI
  marginTop: 20,
  marginBottom: 20,
  header: { height: 50 },
  footer: { height: 30 }
}
```

### Template Configuration

```typescript
{
  style: {
    fontFamily: 'Arial, sans-serif',
    fontSize: '12px',
    lineHeight: 1.5,
    spaces: {
      work: {
        marginTop: 10,
        marginBottom: 0,
        intro: { marginTop: 5 },
        statements: {
          list: { marginTop: 5 },
          item: { marginTop: 3 }
        }
      }
    }
  }
}
```

## Event Callbacks

The engine supports various event callbacks:

```typescript
{
  events: {
    onPageCreated: (pageIndex, pageElement) => {
      console.log(`Page ${pageIndex + 1} created`);
    },
    onContentPlaced: (result) => {
      console.log('Content placed:', result);
    },
    onOverflow: (contentType, required, available) => {
      console.warn(`Overflow detected`);
    },
    onError: (error) => {
      console.error('Error:', error);
    }
  }
}
```

## API Methods

The hook provides these helper methods:

- `addExperience(position)` - Add work experience
- `addEducation(education)` - Add education entry
- `addSkills(skills)` - Add skills section
- `reset()` - Clear all content

## Learn More

- [API Documentation](../../docs/API.md)
- [Architecture](../../docs/ARCHITECTURE.md)
- [More Examples](../../docs/EXAMPLES.md)

## Technology Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Resume Layout Engine** - Headless page splitting library

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
