# Architecture

## Overview

The Resume Layout Engine is a headless library that handles automatic page splitting for resume content. It follows a clean, modular architecture with clear separation of concerns.

## Core Concepts

### 1. Headless Design

The library has **zero UI assumptions**. It:
- Creates and manages DOM elements
- Calculates space and measurements
- Handles layout logic
- **Does NOT** dictate styling, rendering, or UI framework

This makes it framework-agnostic and usable with React, Vue, Angular, or vanilla JS.

### 2. Four-Phase Layout Process

Every piece of content goes through four phases:

```
1. CREATE COMPONENT
   ↓
2. MEASURE COMPONENT
   ↓
3. CHECK AVAILABLE SPACE
   ↓
4. PLACE OR OVERFLOW
```

#### Phase 1: Create Component
- `ComponentFactory` creates DOM elements from data objects
- Supports Position (work experience), Education, and Skills
- Returns unstyled HTMLElement

#### Phase 2: Measure Component
- `MeasurementService` measures the component
- Uses hidden measurement container for accurate measurements
- Applies template styles before measuring
- Returns `ComponentMeasurement` with height breakdown

#### Phase 3: Check Available Space
- `SpaceCalculator` tracks available space on each page
- Calculates: `Remaining = Page Height - (Fixed Elements + Dynamic Content)`
- Compares required space vs. available space

#### Phase 4: Place or Overflow
- If fits: Place on current page
- If doesn't fit: Create new page and place there
- Update space calculator
- Trigger events

## Architecture Layers

```
┌─────────────────────────────────────────┐
│         Public API Layer                │
│    (ResumeLayoutEngine)                 │
│  - Clean, simple interface              │
│  - Event callbacks                      │
│  - Error handling                       │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│         Core Layout Layer               │
│         (LayoutEngine)                  │
│  - Orchestrates layout process          │
│  - Manages pages and placement          │
│  - Handles overflow logic               │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│         Services Layer                  │
│  - ComponentFactory: Creates DOM        │
│  - MeasurementService: Measures height  │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│         Utils Layer                     │
│  - SpaceCalculator: Tracks space        │
│  - domHelpers: DOM utilities            │
└─────────────────────────────────────────┘
```

## Key Components

### ResumeLayoutEngine (Public API)

**Location:** `lib/core/ResumeLayoutEngine.ts`

**Responsibilities:**
- Public-facing API
- Configuration validation
- Error handling
- Event callback management
- Delegates to internal LayoutEngine

**Key Methods:**
- `addExperience()`, `addEducation()`, `addSkills()`
- `updateExperience()`, `updateEducation()`
- `removeExperience()`, `removeEducation()`
- `getPageCount()`, `getRemainingSpace()`, `getSpaceBreakdown()`
- `reset()`, `destroy()`

### LayoutEngine (Internal Core)

**Location:** `lib/core/LayoutEngine.ts`

**Responsibilities:**
- Core layout orchestration
- Page creation and management
- Component placement logic
- Overflow handling
- Space tracking per page

**Key Methods:**
- `placeContent()` - Core placement logic
- `placeComponentOnCurrentPage()` - Place on current page
- `handleOverflow()` - Create new page and place
- `createNewPage()` - Create new page element
- `getMargins()` - Get spacing for content type

### ComponentFactory

**Location:** `lib/services/ComponentFactory.ts`

**Responsibilities:**
- Create DOM elements from data objects
- Support Position, Education, and Skill components
- Return unstyled HTMLElement structures

**Key Methods:**
- `createPositionComponent(position: Position): HTMLElement`
- `createEducationComponent(education: Education): HTMLElement`
- `createSkillsComponent(skills: Skill[]): HTMLElement`

### MeasurementService

**Location:** `lib/services/MeasurementService.ts`

**Responsibilities:**
- Measure component heights accurately
- Use hidden measurement container
- Apply template styles before measuring
- Return detailed measurement breakdown

**Key Methods:**
- `measureComponent(component: HTMLElement, template: TemplateConfig): ComponentMeasurement`
- `cleanup()` - Remove measurement container

**Measurement Strategy:**
- Creates hidden container (visibility: hidden, position: absolute)
- Positions off-screen
- Sets A4 width (793.7px)
- Appends component
- Reads `offsetHeight`
- Removes component

### SpaceCalculator

**Location:** `lib/utils/SpaceCalculator.ts`

**Responsibilities:**
- Track available space on a page
- Calculate remaining space
- Provide detailed space breakdown

**Key Methods:**
- `calculateRemainingSpace(): number`
- `placeContent(id: string, height: number, margins?: { top?: number; bottom?: number }): void`
- `getBreakdown(): SpaceBreakdown`

**Formula:**
```
Remaining Space = Page Height - (Fixed Elements + Dynamic Content)

Fixed Elements = Header + Footer + Margin Top + Margin Bottom
Dynamic Content = Sum of all placed content heights + margins
```

## Data Flow

### Adding Experience Example

```
User calls engine.addExperience(position)
         ↓
ResumeLayoutEngine.addExperience()
         ↓
LayoutEngine.addExperience()
         ↓
ComponentFactory.createPositionComponent()
         ↓
MeasurementService.measureComponent()
         ↓
LayoutEngine.placeContent()
         ↓
SpaceCalculator.calculateRemainingSpace()
         ↓
[Decision: Fits or Overflow?]
         ↓
If Fits: placeComponentOnCurrentPage()
If Overflow: handleOverflow() → createNewPage() → placeComponentOnCurrentPage()
         ↓
SpaceCalculator.placeContent()
         ↓
Trigger onContentPlaced event
         ↓
Return PlacementResult
```

## Type System

### Configuration Types
- `LayoutEngineConfig` - Main configuration
- `PageConfig` - Page dimensions and margins
- `TemplateConfig` - Styling and spacing
- `EventCallbacks` - Event handlers

### Data Types
- `Position` - Work experience
- `Education` - Education entry
- `Skill` - Skill item
- `ResumeData` - Complete resume data

### Measurement Types
- `ComponentMeasurement` - Component height breakdown
- `SpaceBreakdown` - Page space breakdown
- `PlacementResult` - Placement operation result

## Design Principles

### 1. Single Responsibility
Each class has one clear responsibility:
- `ComponentFactory` → Create DOM
- `MeasurementService` → Measure height
- `SpaceCalculator` → Track space
- `LayoutEngine` → Orchestrate layout

### 2. Dependency Injection
Dependencies are injected, not created internally:
```typescript
constructor(
  pagesContainer: HTMLElement,
  pageConfig: PageConfig,
  templateConfig: TemplateConfig,
  eventCallbacks?: EventCallbacks
)
```

### 3. Event-Driven
No tight coupling to UI. Use events for communication:
- `onPageCreated` - New page created
- `onContentPlaced` - Content placed
- `onOverflow` - Content doesn't fit
- `onError` - Error occurred

### 4. Immutability
Configuration objects are not mutated. New objects are created for updates.

### 5. Type Safety
Full TypeScript support with strict typing throughout.

## Extension Points

### Custom Content Types

To add new content types (e.g., Projects, Certifications):

1. Add type definition in `lib/types/resume.ts`
2. Add factory method in `ComponentFactory`
3. Add public method in `ResumeLayoutEngine`
4. Add internal method in `LayoutEngine`
5. Update spacing configuration

### Custom Measurement Strategy

Extend `MeasurementService` to use different measurement approaches.

### Custom Space Calculation

Extend `SpaceCalculator` for different space calculation logic.

## Performance Considerations

### Measurement Optimization
- Reuses single hidden container
- Measures only when needed
- Cleans up on destroy

### DOM Manipulation
- Minimizes reflows
- Batches DOM operations
- Uses `visibility: hidden` instead of `display: none`

### Memory Management
- Cleanup on destroy
- Removes event listeners
- Clears tracking maps

## Testing Strategy

### Unit Tests
- Test each component in isolation
- Mock dependencies
- Test edge cases

### Integration Tests
- Test full layout flow
- Test multiple content types
- Test overflow scenarios

### Visual Tests
- Test actual rendering
- Compare with expected output
- Test different page sizes

