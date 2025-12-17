import type { TemplateConfig } from '../../types';
import type { SplitIndexes } from '../../types/resume';

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
  calculateHeight(content: any, config: TemplateConfig): number;
  
  /**
   * Check if content fits in available space
   */
  fitsInSpace(content: any, availableSpace: number, config: TemplateConfig): boolean;
}

export interface SplitOptions {
  contentType: string;
  content: any;
  availableSpace: number;
  templateConfig: TemplateConfig;
  splitIndexes?: SplitIndexes;
  measurementStore?: any;
  lineDataStore?: any;
}

export interface SplitResult {
  fitsOnCurrentPage: boolean;
  currentPageContent: any[];
  nextPageContent: any[];
  splitIndexes: SplitIndexes;
  usedHeight: number;
}