/**
 * Type definitions for Resume Layout Engine
 * 
 * This is the main entry point for all type exports.
 */

// Configuration types
export type {
    EventCallbacks, LayoutEngineConfig,
    PageConfig, PlacementResult, RenderingOptions, SectionSpacing, SplitGuidelines, TemplateConfig
} from './config';

// Resume data types
export type {
    AccomplishmentLines, Education, Position, ResumeData, Skill, SplitIndexes
} from './resume';

// Measurement types
export type {
    ComponentBreakdown, ComponentMeasurement, SpaceBreakdown
} from './measurement';

// Orphan detection types
export type {
    ContentAnalysis, OrphanCheckResult,
    OrphanInfo
} from './orphan';

