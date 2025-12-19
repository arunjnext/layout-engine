import type { TemplateConfig, SplitGuidelines } from '../../types/config';
import type { Position, SplitIndexes } from '../../types/resume';

/**
 * Base Splitter Interface
 */
export interface BaseSplitter {
  /**
   * Split content across pages
   */
  split(options: SplitOptions): Promise<SplitResult>;
  
  /**
   * Calculate height of content
   */
  calculateHeight(content: Position, config: TemplateConfig): number;
  
  /**
   * Check if content fits in available space
   */
  fitsInSpace(content: Position, availableSpace: number, config: TemplateConfig): boolean;
}

export interface SplitOptions {
  contentType: string;
  content: Position;
  availableSpace: number;
  templateConfig: TemplateConfig;
  splitGuidelines?: SplitGuidelines;
  margins?: { top?: number; bottom?: number };
}

export interface SplitResult {
  /** Whether the content fits entirely on current page */
  fitsOnCurrentPage: boolean;
  /** Content to place on current page (may be partial) */
  currentPageContent: Position | null;
  /** Content to place on next page (may be partial) */
  nextPageContent: Position | null;
  /** Split indexes for tracking split boundaries */
  splitIndexes: SplitIndexes;
  /** Height used on current page */
  usedHeight: number;
  /** Whether a split was performed */
  wasSplit: boolean;
}

