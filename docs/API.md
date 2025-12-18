# API Reference

## ResumeLayoutEngine

The main public API for the Resume Layout Engine.

### Constructor

```typescript
new ResumeLayoutEngine(config: LayoutEngineConfig)
```

#### LayoutEngineConfig

```typescript
interface LayoutEngineConfig {
  // Container element (HTMLElement or CSS selector)
  container: HTMLElement | string;
  
  // Page configuration
  page?: PageConfig;
  
  // Template styling
  template?: TemplateConfig;
  
  // Event callbacks
  events?: EventCallbacks;
  
  // Rendering options
  rendering?: RenderingOptions;
}
```

#### PageConfig

```typescript
interface PageConfig {
  height?: number;        // Page height in pixels (default: 1123 for A4 at 96 DPI)
  marginTop?: number;     // Top margin in pixels (default: 20)
  marginBottom?: number;  // Bottom margin in pixels (default: 20)
  header?: {
    height: number;       // Header height in pixels (default: 50)
  };
  footer?: {
    height: number;       // Footer height in pixels (default: 30)
  };
}
```

#### TemplateConfig

```typescript
interface TemplateConfig {
  style?: {
    fontFamily?: string;
    fontSize?: string;
    lineHeight?: number;
    
    // Spacing configuration (new format)
    spacing?: {
      experience?: SectionSpacing;
      education?: SectionSpacing;
      skills?: SectionSpacing;
    };
    
    // Legacy spacing configuration (deprecated)
    spaces?: {
      work?: SectionSpacing;
      education?: SectionSpacing;
      skills?: SectionSpacing;
    };
  };
}

interface SectionSpacing {
  marginTop?: number;
  marginBottom?: number;
  intro?: { marginTop?: number };
  statements?: {
    list?: { marginTop?: number };
    item?: { marginTop?: number };
  };
}
```

#### EventCallbacks

```typescript
interface EventCallbacks {
  // Called when a new page is created
  onPageCreated?: (pageIndex: number, pageElement: HTMLElement) => void;
  
  // Called when content is successfully placed
  onContentPlaced?: (result: PlacementResult) => void;
  
  // Called when content doesn't fit on current page
  onOverflow?: (contentType: string, requiredSpace: number, availableSpace: number) => void;
  
  // Called when an error occurs
  onError?: (error: Error) => void;
}
```

### Methods

#### addExperience

Add work experience to the resume.

```typescript
async addExperience(position: Position): Promise<PlacementResult>
```

**Parameters:**
- `position`: Position object containing work experience data

**Returns:** PlacementResult with placement information

**Example:**
```typescript
await engine.addExperience({
  _id: 'work-1',
  title: 'Software Engineer',
  company: 'Tech Corp',
  startDate: '2020-01',
  endDate: '2023-12',
  intro: 'Led development of scalable systems',
  description: [
    'Built REST API serving 1M+ requests/day',
    'Improved performance by 50%'
  ]
});
```

#### addEducation

Add education entry to the resume.

```typescript
async addEducation(education: Education): Promise<PlacementResult>
```

**Parameters:**
- `education`: Education object containing education data

**Returns:** PlacementResult with placement information

**Example:**
```typescript
await engine.addEducation({
  _id: 'edu-1',
  degree: 'Bachelor of Science in Computer Science',
  institution: 'University of Technology',
  startDate: '2016-09',
  endDate: '2020-05',
  description: ['GPA: 3.8/4.0', 'Dean\'s List']
});
```

#### addSkills

Add skills section to the resume.

```typescript
async addSkills(skills: Skill[]): Promise<PlacementResult>
```

**Parameters:**
- `skills`: Array of Skill objects

**Returns:** PlacementResult with placement information

**Example:**
```typescript
await engine.addSkills([
  { _id: 'skill-1', name: 'JavaScript' },
  { _id: 'skill-2', name: 'TypeScript' },
  { _id: 'skill-3', name: 'React' }
]);
```

#### updateExperience

Update an existing work experience entry.

```typescript
async updateExperience(positionId: string, position: Position): Promise<PlacementResult>
```

#### updateEducation

Update an existing education entry.

```typescript
async updateEducation(educationId: string, education: Education): Promise<PlacementResult>
```

#### removeExperience

Remove a work experience entry by ID.

```typescript
removeExperience(positionId: string): void
```

#### removeEducation

Remove an education entry by ID.

```typescript
removeEducation(educationId: string): void
```

#### getRemainingSpace

Get remaining space on the current page in pixels.

```typescript
getRemainingSpace(): number
```

#### getPageCount

Get total number of pages.

```typescript
getPageCount(): number
```

#### getPages

Get all page elements.

```typescript
getPages(): HTMLElement[]
```

#### getCurrentPageIndex

Get current page index (0-based).

```typescript
getCurrentPageIndex(): number
```

#### getSpaceBreakdown

Get detailed space breakdown for the current page.

```typescript
getSpaceBreakdown(): SpaceBreakdown | null
```

**Returns:**
```typescript
interface SpaceBreakdown {
  totalHeight: number;
  usedSpace: number;
  remainingSpace: number;
  fixedElements: {
    header: number;
    footer: number;
    marginTop: number;
    marginBottom: number;
  };
  dynamicContent: Array<{
    id: string;
    height: number;
    margins: { top?: number; bottom?: number };
  }>;
}
```

#### reset

Clear all pages and start fresh.

```typescript
reset(): void
```

#### destroy

Cleanup all resources. Call this when you're done with the engine to prevent memory leaks.

```typescript
destroy(): void
```

## Types

### Position

```typescript
interface Position {
  _id: string;
  title: string;
  company: string;
  startDate?: string;
  endDate?: string;
  intro?: string;
  description?: string[];
}
```

### Education

```typescript
interface Education {
  _id: string;
  degree: string;
  institution: string;
  startDate?: string;
  endDate?: string;
  description?: string[];
}
```

### Skill

```typescript
interface Skill {
  _id: string;
  name: string;
}
```

### PlacementResult

```typescript
interface PlacementResult {
  success: boolean;
  placed: boolean;
  component?: HTMLElement;
  usedHeight: number;
  remainingSpace: number;
  pageIndex?: number;
  pageCount?: number;
}
```

