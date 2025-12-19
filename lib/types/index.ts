/**
 * Type definitions for Resume Layout Engine
 * 
 * This is the main entry point for all type exports.
 */

// Configuration types
export type {
  LayoutEngineConfig,
  PageConfig,
  TemplateConfig,
  SectionSpacing,
  EventCallbacks,
  RenderingOptions,
  PlacementResult,
  SplitGuidelines,
} from './config';

// Resume data types
export type {
  Position,
  Education,
  Skill,
  ResumeData,
  AccomplishmentLines,
  SplitIndexes,
} from './resume';

// Measurement types
export type {
  ComponentMeasurement,
  ComponentBreakdown,
  SpaceBreakdown,
} from './measurement';

