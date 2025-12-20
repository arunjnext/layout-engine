/**
 * OrphanDetector - Service for detecting and preventing orphaned headings
 * 
 * An element is orphaned when it's a parent element (title, intro) that is
 * left alone on a page with all its children moved to the next page.
 */

import type {
  ContentAnalysis,
  OrphanCheckResult,
  OrphanDetectionOptions,
  OrphanedElement,
  OrphanInfo
} from '../types/orphan';
import type { Position } from '../types/resume';

export class OrphanDetector {
  /**
   * Check if a split result creates orphans at the block level
   * This is used during the splitting process to prevent bad splits
   */
  checkSplitForOrphans(
    currentPageContent: Position | null,
    nextPageContent: Position | null,
    options: OrphanDetectionOptions
  ): OrphanCheckResult {
    if (!options.enabled || !currentPageContent) {
      return {
        isOrphaned: false,
        orphanedElements: [],
        recommendation: 'KEEP_SPLIT'
      };
    }

    // Analyze the content structure
    const analysis = this.analyzeContent(currentPageContent, nextPageContent);

    // Check for orphan conditions
    const orphanedElements = this.identifyOrphanedElements(analysis, options);

    const isOrphaned = orphanedElements.length > 0;

    // Determine recommendation
    let recommendation: 'KEEP_SPLIT' | 'MOVE_ENTIRE_BLOCK' | 'ADJUST_SPLIT' = 'KEEP_SPLIT';
    
    if (isOrphaned) {
      // If title is orphaned, move entire block
      if (orphanedElements.some(e => e.type === 'title')) {
        recommendation = 'MOVE_ENTIRE_BLOCK';
      } else {
        // Otherwise, adjust the split
        recommendation = 'ADJUST_SPLIT';
      }
    }

    return {
      isOrphaned,
      orphanedElements,
      recommendation,
      reason: isOrphaned 
        ? `Parent element(s) would be orphaned with fewer than ${options.minChildren} children`
        : undefined
    };
  }

  /**
   * Analyze content structure to determine orphan status
   */
  private analyzeContent(
    currentPageContent: Position | null,
    nextPageContent: Position | null
  ): ContentAnalysis {
    if (!currentPageContent) {
      return {
        hasTitle: false,
        hasIntro: false,
        introOnCurrentPage: false,
        childCount: 0,
        totalChildCount: 0,
        allChildrenOnNextPage: false
      };
    }

    const hasTitle = !!(currentPageContent.title);
    const hasIntro = !!(currentPageContent.intro);
    const introOnCurrentPage = hasIntro && !!currentPageContent.intro;
    
    const currentPageStatements = currentPageContent.description?.length || 0;
    const nextPageStatements = nextPageContent?.description?.length || 0;
    const totalStatements = currentPageStatements + nextPageStatements;

    return {
      hasTitle,
      hasIntro,
      introOnCurrentPage,
      childCount: currentPageStatements,
      totalChildCount: totalStatements,
      allChildrenOnNextPage: currentPageStatements === 0 && nextPageStatements > 0
    };
  }

  /**
   * Identify which elements are orphaned based on analysis
   */
  private identifyOrphanedElements(
    analysis: ContentAnalysis,
    options: OrphanDetectionOptions
  ): OrphanedElement[] {
    const orphaned: OrphanedElement[] = [];
    const minChildren = options.minChildren;

    // Check if statements are all moved (creating potential orphans)
    if (analysis.allChildrenOnNextPage || analysis.childCount < minChildren) {
      // Level 3: Statements moved - intro might be orphaned
      if (analysis.introOnCurrentPage) {
        orphaned.push({
          type: 'intro',
          shouldMove: true,
          childrenOnCurrentPage: analysis.childCount,
          totalChildren: analysis.totalChildCount
        });

        // Level 2: If intro is orphaned and cascade is enabled, title might be orphaned
        if (options.cascade && analysis.hasTitle) {
          orphaned.push({
            type: 'title',
            shouldMove: true,
            childrenOnCurrentPage: 0, // No content besides title
            totalChildren: analysis.totalChildCount
          });
        }
      } else if (analysis.hasTitle && analysis.childCount === 0) {
        // Title alone with no intro or statements
        orphaned.push({
          type: 'title',
          shouldMove: true,
          childrenOnCurrentPage: 0,
          totalChildren: analysis.totalChildCount
        });
      }
    }

    return orphaned;
  }

  /**
   * Detect orphans on a rendered page (engine-level detection)
   * This is used after content is placed to validate the page layout
   */
  detectOrphansOnPage(
    page: HTMLElement,
    columnIndex: number = 0
  ): OrphanInfo | null {
    // Get the column or page content
    const container = this.getColumnContainer(page, columnIndex);
    if (!container) return null;

    // Get the last block in the column
    const lastBlock = this.getLastContentBlock(container);
    if (!lastBlock) return null;

    // Check if it's a heading/title element
    const isHeading = this.isHeadingElement(lastBlock);
    if (!isHeading) return null;

    // Check if it has children on the same page
    const hasChildren = this.hasChildrenOnSamePage(lastBlock, container);
    
    if (!hasChildren) {
      return {
        element: lastBlock,
        type: this.getHeadingType(lastBlock),
        shouldMove: true,
        contentId: lastBlock.dataset.positionId || lastBlock.dataset.educationId,
        pageIndex: parseInt(page.dataset.pageNumber || '0'),
        columnIndex
      };
    }

    return null;
  }

  /**
   * Get column container from page
   */
  private getColumnContainer(page: HTMLElement, columnIndex: number): HTMLElement | null {
    const column = page.querySelector(`.column-${columnIndex}`);
    return column as HTMLElement || page;
  }

  /**
   * Get the last content block in a container
   */
  private getLastContentBlock(container: HTMLElement): HTMLElement | null {
    const blocks = container.querySelectorAll('.resume-position, .resume-education');
    return blocks.length > 0 ? blocks[blocks.length - 1] as HTMLElement : null;
  }

  /**
   * Check if element is a heading
   */
  private isHeadingElement(element: HTMLElement): boolean {
    return element.classList.contains('resume-position') || 
           element.classList.contains('resume-education');
  }

  /**
   * Check if heading has children (statements/description) on same page
   */
  private hasChildrenOnSamePage(heading: HTMLElement, _container: HTMLElement): boolean {
    // Check for statements list within the heading
    const statementsList = heading.querySelector('.position-statements, .education-description');

    if (statementsList) {
      const statements = statementsList.querySelectorAll('li');
      return statements.length > 0;
    }

    return false;
  }

  /**
   * Get the type of heading element
   */
  private getHeadingType(element: HTMLElement): 'title' | 'intro' | 'heading' {
    if (element.classList.contains('resume-position') || 
        element.classList.contains('resume-education')) {
      return 'title';
    }
    return 'heading';
  }
}

