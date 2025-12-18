# React Example - Resume Layout Engine

This example demonstrates how to use the Resume Layout Engine in a React application.

## Files

- **`useResumeLayout.ts`** - Custom React hook for the layout engine
- **`ResumePreview.tsx`** - Example component using the hook
- **`App.tsx`** - Sample app (you need to create this)

## Usage

### 1. Basic Usage with Hook

```tsx
import { useResumeLayout } from './useResumeLayout';

function MyResumeComponent() {
  const { containerRef, engine, pageCount, remainingSpace } = useResumeLayout({
    template: {
      style: {
        fontFamily: 'Arial, sans-serif',
        fontSize: '12px'
      }
    }
  });

  useEffect(() => {
    if (!engine) return;
    
    (async () => {
      await engine.addExperience({
        _id: 'work-1',
        title: 'Software Engineer',
        company: 'Tech Corp',
        description: ['Built APIs', 'Led team']
      });
    })();
  }, [engine]);

  return (
    <div>
      <div>Pages: {pageCount} | Remaining: {remainingSpace}px</div>
      <div ref={containerRef} />
    </div>
  );
}
```

### 2. Using the ResumePreview Component

```tsx
import { ResumePreview } from './ResumePreview';

function App() {
  const experiences = [
    {
      _id: 'work-1',
      title: 'Software Engineer',
      company: 'Tech Corp',
      startDate: '2020-01',
      endDate: '2023-12',
      intro: 'Led development of scalable systems',
      description: [
        'Built REST API serving 1M+ requests/day',
        'Improved performance by 50%',
        'Led team of 5 developers'
      ]
    }
  ];

  return <ResumePreview experiences={experiences} />;
}
```

## Key Features

- **Automatic cleanup** - The hook automatically destroys the engine on unmount
- **State management** - Tracks page count and remaining space
- **Event handling** - Supports all engine events
- **Type-safe** - Full TypeScript support

## Styling

Add CSS for the resume pages:

```css
.resume-container {
  max-width: 210mm;
  margin: 0 auto;
}

.resume-page {
  width: 210mm;
  min-height: 297mm;
  padding: 20mm;
  margin: 0 auto 20px;
  background: white;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
}

.resume-stats {
  position: fixed;
  top: 20px;
  right: 20px;
  background: #333;
  color: white;
  padding: 15px;
  border-radius: 8px;
}

.stat {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.stat-value.low { color: #ff6b6b; }
.stat-value.medium { color: #ffd93d; }
.stat-value.high { color: #6bcf7f; }
```

## Notes

- The hook creates the engine only once (on mount)
- Use the `reset()` method to clear all content
- The engine is automatically destroyed when the component unmounts
- All helper methods (`addExperience`, `addEducation`, etc.) are memoized

