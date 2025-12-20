/**
 * Types for orphan detection system
 */

/**
 * Result of orphan check on a split
 */
export interface OrphanCheckResult {
  /** Whether the split creates an orphan */
  isOrphaned: boolean;

  /** List of orphaned element types */
  orphanedElements: OrphanedElement[];

  /** Recommendation for handling the orphan */
  recommendation: 'KEEP_SPLIT' | 'MOVE_ENTIRE_BLOCK' | 'ADJUST_SPLIT';

  /** Reason for the orphan detection */
  reason?: string;
}

/**
 * Information about an orphaned element
 */
export interface OrphanedElement {
  /** Type of element that is orphaned */
  type: 'title' | 'intro' | 'statements';

  /** Whether this element should be moved */
  shouldMove: boolean;

  /** Number of children on current page */
  childrenOnCurrentPage: number;

  /** Total number of children */
  totalChildren: number;
}

/**
 * Information about detected orphan on a page
 */
export interface OrphanInfo {
  /** The orphaned element (if DOM-based detection) */
  element?: HTMLElement;

  /** Type of orphaned element */
  type: 'title' | 'intro' | 'heading';

  /** Whether the element should be moved to next page */
  shouldMove: boolean;

  /** Content ID of the orphaned element */
  contentId?: string;

  /** Page index where orphan was detected */
  pageIndex?: number;

  /** Column index where orphan was detected */
  columnIndex?: number;
}

/**
 * Analysis of content structure for orphan detection
 */
export interface ContentAnalysis {
  /** Whether content has a title */
  hasTitle: boolean;

  /** Whether content has intro text */
  hasIntro: boolean;

  /** Whether intro is on current page */
  introOnCurrentPage: boolean;

  /** Number of statements/children on current page */
  childCount: number;

  /** Total number of statements/children */
  totalChildCount: number;

  /** Whether all children are on next page */
  allChildrenOnNextPage: boolean;
}

/**
 * Options for orphan detection
 */
export interface OrphanDetectionOptions {
  /** Minimum children required to avoid orphan */
  minChildren: number;

  /** Whether to cascade detection up hierarchy */
  cascade: boolean;

  /** Whether orphan prevention is enabled */
  enabled: boolean;
}

