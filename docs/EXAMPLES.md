# Examples

## Vanilla JavaScript/TypeScript

### Basic Usage

```typescript
import { ResumeLayoutEngine } from './lib';

const engine = new ResumeLayoutEngine({
  container: '#resume-container',
  template: {
    style: {
      fontFamily: 'Arial, sans-serif',
      fontSize: '12px',
      lineHeight: 1.5
    }
  }
});

// Add work experience
await engine.addExperience({
  _id: 'work-1',
  title: 'Software Engineer',
  company: 'Tech Corp',
  startDate: '2020-01',
  endDate: '2023-12',
  description: ['Built APIs', 'Led team']
});

console.log(`Pages: ${engine.getPageCount()}`);
```

### With Event Callbacks

```typescript
const engine = new ResumeLayoutEngine({
  container: '#resume-container',
  events: {
    onPageCreated: (pageIndex, pageElement) => {
      console.log(`Page ${pageIndex + 1} created`);
      pageElement.classList.add('fade-in');
    },
    onContentPlaced: (result) => {
      console.log(`Content placed on page ${result.pageIndex + 1}`);
      updateStats(result);
    },
    onOverflow: (contentType, required, available) => {
      console.warn(`${contentType} needs ${required}px, only ${available}px available`);
    },
    onError: (error) => {
      console.error('Layout error:', error);
    }
  }
});
```

### Custom Page Configuration

```typescript
const engine = new ResumeLayoutEngine({
  container: '#resume-container',
  page: {
    height: 1123,      // A4 at 96 DPI
    marginTop: 30,
    marginBottom: 30,
    header: { height: 60 },
    footer: { height: 40 }
  }
});
```

### Dynamic Content Updates

```typescript
// Add initial content
await engine.addExperience(experience1);
await engine.addExperience(experience2);

// Update existing content
await engine.updateExperience('work-1', {
  ...experience1,
  description: [...experience1.description, 'New achievement']
});

// Remove content
engine.removeExperience('work-2');

// Reset everything
engine.reset();
```

## React

### Using the Hook

```tsx
import { useResumeLayout } from './examples/react/useResumeLayout';

function ResumePreview({ resumeData }) {
  const { 
    containerRef, 
    engine, 
    isReady,
    pageCount, 
    remainingSpace,
    addExperience,
    reset
  } = useResumeLayout({
    template: {
      style: {
        fontFamily: 'Arial, sans-serif',
        fontSize: '12px'
      }
    },
    events: {
      onPageCreated: (pageIndex) => {
        console.log(`Page ${pageIndex + 1} created`);
      }
    }
  });

  useEffect(() => {
    if (!isReady) return;
    
    (async () => {
      reset(); // Clear existing content
      
      for (const exp of resumeData.experiences) {
        await addExperience(exp);
      }
    })();
  }, [isReady, resumeData, addExperience, reset]);

  return (
    <div>
      <div className="stats">
        Pages: {pageCount} | Remaining: {remainingSpace}px
      </div>
      <div ref={containerRef} />
    </div>
  );
}
```

### Using the Component

```tsx
import { ResumePreview } from './examples/react/ResumePreview';

function App() {
  const [experiences, setExperiences] = useState([
    {
      _id: 'work-1',
      title: 'Software Engineer',
      company: 'Tech Corp',
      description: ['Built APIs', 'Led team']
    }
  ]);

  return <ResumePreview experiences={experiences} />;
}
```

### With State Management

```tsx
function ResumeEditor() {
  const { containerRef, engine, isReady } = useResumeLayout({
    template: { /* config */ }
  });
  
  const [experiences, setExperiences] = useState([]);

  const handleAddExperience = async (newExp) => {
    if (!engine) return;
    
    await engine.addExperience(newExp);
    setExperiences([...experiences, newExp]);
  };

  const handleRemoveExperience = (id) => {
    if (!engine) return;
    
    engine.removeExperience(id);
    setExperiences(experiences.filter(exp => exp._id !== id));
  };

  return (
    <div>
      <ExperienceForm onSubmit={handleAddExperience} />
      <ExperienceList 
        experiences={experiences} 
        onRemove={handleRemoveExperience} 
      />
      <div ref={containerRef} />
    </div>
  );
}
```

## Advanced Usage

### Custom Spacing Configuration

```typescript
const engine = new ResumeLayoutEngine({
  container: '#resume-container',
  template: {
    style: {
      fontFamily: 'Arial, sans-serif',
      fontSize: '12px',
      lineHeight: 1.5,
      spacing: {
        experience: {
          marginTop: 15,
          marginBottom: 5,
          intro: { marginTop: 8 },
          statements: {
            list: { marginTop: 10 },
            item: { marginTop: 4 }
          }
        },
        education: {
          marginTop: 12,
          marginBottom: 5
        },
        skills: {
          marginTop: 10,
          marginBottom: 0
        }
      }
    }
  }
});
```

### Monitoring Space Usage

```typescript
const engine = new ResumeLayoutEngine({
  container: '#resume-container',
  events: {
    onContentPlaced: (result) => {
      const breakdown = engine.getSpaceBreakdown();
      
      console.log('Space Breakdown:', {
        total: breakdown.totalHeight,
        used: breakdown.usedSpace,
        remaining: breakdown.remainingSpace,
        percentUsed: (breakdown.usedSpace / breakdown.totalHeight * 100).toFixed(1) + '%'
      });
      
      // Warn if space is running low
      if (breakdown.remainingSpace < 100) {
        console.warn('Low space on current page!');
      }
    }
  }
});
```

### Multiple Resume Sections

```typescript
// Add different types of content
await engine.addExperience(experience1);
await engine.addExperience(experience2);

await engine.addEducation(education1);
await engine.addEducation(education2);

await engine.addSkills([
  { _id: 'skill-1', name: 'JavaScript' },
  { _id: 'skill-2', name: 'TypeScript' },
  { _id: 'skill-3', name: 'React' }
]);

console.log(`Total pages: ${engine.getPageCount()}`);
```

### Cleanup

```typescript
// When component unmounts or you're done
engine.destroy();
```

## Styling

### Basic CSS

```css
.resume-page {
  width: 210mm;
  min-height: 297mm;
  padding: 20mm;
  margin: 0 auto 20px;
  background: white;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
}

.resume-position {
  margin-bottom: 20px;
}

.position-title {
  font-size: 16px;
  font-weight: bold;
}

.position-statements {
  margin-top: 10px;
  padding-left: 20px;
}
```

### Print Styles

```css
@media print {
  .resume-page {
    box-shadow: none;
    margin: 0;
    page-break-after: always;
  }
  
  .resume-page:last-child {
    page-break-after: auto;
  }
}
```

