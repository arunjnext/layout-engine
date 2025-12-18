/**
 * Resume Layout Engine - Headless library for automatic resume page splitting
 * 
 * @packageDocumentation
 */

// Main API
export { ResumeLayoutEngine } from './core/ResumeLayoutEngine';

// Configuration types
export type {
  LayoutEngineConfig,
  PageConfig,
  TemplateConfig,
  SectionSpacing,
  EventCallbacks,
  RenderingOptions,
  PlacementResult,
} from './types/config';

// Resume data types
export type {
  Position,
  Education,
  Skill,
  ResumeData,
  AccomplishmentLines,
  SplitIndexes,
} from './types/resume';

// Measurement types
export type {
  ComponentMeasurement,
  ComponentBreakdown,
  SpaceBreakdown,
} from './types/measurement';

// Advanced exports (for power users who want to extend the library)
export { LayoutEngine } from './core/LayoutEngine';
export { SpaceCalculator } from './utils/SpaceCalculator';
export { ComponentFactory } from './services/ComponentFactory';
export { MeasurementService } from './services/MeasurementService';

// Utility functions
export {
  getLineHeight,
  calculateLineCount,
  getMarginTop,
  getMarginBottom,
  forceReflow,
  createMeasurementContainer,
  resolveContainer,
} from './utils/domHelpers';

