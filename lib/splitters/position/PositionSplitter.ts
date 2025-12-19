import type { TemplateConfig, SplitGuidelines } from '../../types/config';
import type { Position, SplitIndexes } from '../../types/resume';
import type { BaseSplitter, SplitOptions, SplitResult } from '../base/BaseSplitter';
import { PositionHeightCalculator } from './PositionHeightCalculator';

/**
 * Position Splitter - Handles smart splitting of work/education positions
 */
export class PositionSplitter implements BaseSplitter {
  private heightCalculator: PositionHeightCalculator;
  private defaultGuidelines: Required<SplitGuidelines>;
  
  constructor(guidelines?: SplitGuidelines) {
    this.heightCalculator = new PositionHeightCalculator();
    this.defaultGuidelines = {
      minSplitPercentage: guidelines?.minSplitPercentage ?? 0.3,
      minRemainingSpace: guidelines?.minRemainingSpace ?? 100,
      preferStatementSplits: guidelines?.preferStatementSplits ?? true,
      keepTitleWithContent: guidelines?.keepTitleWithContent ?? true,
      enableSmartSplitting: guidelines?.enableSmartSplitting ?? true,
    };
  }
  
  async split(options: SplitOptions): Promise<SplitResult> {
    const { content, availableSpace, templateConfig, splitGuidelines, margins } = options;
    const guidelines = { ...this.defaultGuidelines, ...splitGuidelines };
    
    // If smart splitting is disabled, use simple move logic
    if (!guidelines.enableSmartSplitting) {
      return this.simpleMove(content, availableSpace, templateConfig, margins);
    }
    
    // Calculate total height
    const totalHeight = this.calculateHeight(content, templateConfig);
    const requiredSpace = totalHeight + (margins?.top || 0) + (margins?.bottom || 0);
    
    // Check if it fits entirely
    if (requiredSpace <= availableSpace) {
      return {
        fitsOnCurrentPage: true,
        currentPageContent: content,
        nextPageContent: null,
        splitIndexes: this.createEmptySplitIndexes(),
        usedHeight: totalHeight,
        wasSplit: false
      };
    }
    
    // Check if we should attempt split or move entirely
    const shouldSplit = this.shouldAttemptSplit(totalHeight, availableSpace, guidelines);
    
    if (!shouldSplit) {
      // Move entire block to next page
      return {
        fitsOnCurrentPage: false,
        currentPageContent: null,
        nextPageContent: content,
        splitIndexes: this.createEmptySplitIndexes(),
        usedHeight: 0,
        wasSplit: false
      };
    }
    
    // Attempt smart split
    return await this.performSmartSplit(content, availableSpace, templateConfig, guidelines, margins);
  }
  
  /**
   * Decision logic: Should we attempt to split or move entirely?
   */
  private shouldAttemptSplit(
    totalHeight: number,
    availableSpace: number,
    guidelines: Required<SplitGuidelines>
  ): boolean {
    // Rule 1: Need minimum space to attempt split
    if (availableSpace < guidelines.minRemainingSpace) {
      return false;
    }
    
    // Rule 2: At least minSplitPercentage must fit
    const fitPercentage = availableSpace / totalHeight;
    if (fitPercentage < guidelines.minSplitPercentage) {
      return false;
    }
    
    return true;
  }
  
  /**
   * Perform the actual smart split
   */
  private async performSmartSplit(
    position: Position,
    availableSpace: number,
    templateConfig: TemplateConfig,
    guidelines: Required<SplitGuidelines>,
    margins?: { top?: number; bottom?: number }
  ): Promise<SplitResult> {
    const accomplishmentsConfig = templateConfig.style?.spaces?.work || 
                                  templateConfig.style?.spacing?.experience || 
                                  {};
    const lineHeight = this.getLineHeight(templateConfig);
    
    // Estimate title height
    const titleHeight = this.estimateTitleHeight(lineHeight);
    const marginTop = margins?.top || accomplishmentsConfig.marginTop || 0;
    let usedHeight = titleHeight + marginTop;
    
    // Strategy 1: Try splitting at statement boundaries (preferred)
    if (guidelines.preferStatementSplits && 
        position.description && 
        position.description.length > 1) {
      const statementSplit = this.splitAtStatements(
        position,
        availableSpace,
        usedHeight,
        accomplishmentsConfig,
        lineHeight,
        templateConfig,
        margins
      );
      
      if (statementSplit) {
        return statementSplit;
      }
    }
    
    // Strategy 2: Try splitting intro (if no statements or statement split failed)
    if (position.intro && position.intro.length > 0) {
      const introSplit = this.splitAtIntro(
        position,
        availableSpace,
        usedHeight,
        accomplishmentsConfig,
        lineHeight,
        templateConfig,
        margins
      );
      
      if (introSplit) {
        return introSplit;
      }
    }
    
    // Strategy 3: Fallback - move entire block
    return {
      fitsOnCurrentPage: false,
      currentPageContent: null,
      nextPageContent: position,
      splitIndexes: this.createEmptySplitIndexes(),
      usedHeight: 0,
      wasSplit: false
    };
  }
  
  /**
   * Split at statement boundaries
   */
  private splitAtStatements(
    position: Position,
    availableSpace: number,
    startHeight: number,
    accomplishmentsConfig: any,
    lineHeight: number,
    _templateConfig: TemplateConfig,
    margins?: { top?: number; bottom?: number }
  ): SplitResult | null {
    let usedHeight = startHeight;
    const hasIntro = !!(position.intro && position.intro.length > 0);
    
    // Calculate intro height if present
    let introOnCurrentPage = true;
    if (hasIntro && position.intro) {
      const introHeight = this.heightCalculator.calculateIntroHeight(
        position.intro,
        accomplishmentsConfig,
        lineHeight
      );
      if (usedHeight + introHeight <= availableSpace) {
        usedHeight += introHeight;
      } else {
        introOnCurrentPage = false;
      }
    }
    
    // Try to fit as many statements as possible
    const statementsOnCurrentPage: number[] = [];
    const statementsListMargin = accomplishmentsConfig.statements?.list?.marginTop || 0;
    
    if (position.description && position.description.length > 0) {
      // Add list margin if we have intro or this is first statement
      if ((hasIntro && introOnCurrentPage) || statementsOnCurrentPage.length === 0) {
        if (usedHeight + statementsListMargin <= availableSpace) {
          usedHeight += statementsListMargin;
        }
      }
      
      for (let i = 0; i < position.description.length; i++) {
        const statement = position.description[i];
        const statementHeight = this.heightCalculator.calculateStatementHeight(
          statement,
          accomplishmentsConfig,
          lineHeight,
          i,
          hasIntro && introOnCurrentPage
        );
        
        if (usedHeight + statementHeight <= availableSpace) {
          statementsOnCurrentPage.push(i);
          usedHeight += statementHeight;
        } else {
          break; // Can't fit more statements
        }
      }
    }
    
    // Check if we got at least one statement on current page (or intro if no statements)
    if (statementsOnCurrentPage.length === 0 && !introOnCurrentPage) {
      // Can't split meaningfully - title alone isn't enough
      return null;
    }
    
    // Create split positions
    const currentPagePosition: Position = {
      ...position,
      intro: introOnCurrentPage ? position.intro : undefined,
      description: statementsOnCurrentPage.map(i => position.description![i]),
      _isPartial: true,
      _splitIndexes: {
        statementsStartIndex: 0,
        statementsEndIndex: statementsOnCurrentPage.length - 1
      }
    };
    
    const nextPageStatements = position.description?.filter((_, i) => 
      !statementsOnCurrentPage.includes(i)
    ) || [];
    
    const nextPagePosition: Position = {
      ...position,
      // Don't repeat intro on continuation if it was on current page
      intro: introOnCurrentPage ? undefined : position.intro,
      description: nextPageStatements,
      _splitContinuation: true,
      _splitIndexes: {
        statementsStartIndex: statementsOnCurrentPage.length,
        statementsEndIndex: (position.description?.length || 0) - 1
      }
    };
    
    // If we have statements on next page but no intro, we might want to show title again
    // For now, we'll keep it simple - continuation shows only remaining statements
    
    return {
      fitsOnCurrentPage: false,
      currentPageContent: currentPagePosition,
      nextPageContent: nextPagePosition,
      splitIndexes: {
        currentPage: {
          primary: {
            statementsStartIndex: 0,
            statementsEndIndex: statementsOnCurrentPage.length - 1
          },
          secondary: {}
        },
        nextPage: {
          primary: {
            statementsStartIndex: statementsOnCurrentPage.length,
            statementsEndIndex: (position.description?.length || 0) - 1
          },
          secondary: {}
        }
      },
      usedHeight: usedHeight + (margins?.bottom || 0),
      wasSplit: true
    };
  }
  
  /**
   * Split at intro (when no statements or statement split not viable)
   */
  private splitAtIntro(
    position: Position,
    availableSpace: number,
    startHeight: number,
    accomplishmentsConfig: any,
    lineHeight: number,
    _templateConfig: TemplateConfig,
    margins?: { top?: number; bottom?: number }
  ): SplitResult | null {
    if (!position.intro) {
      return null;
    }
    
    let usedHeight = startHeight;
    const introMargin = accomplishmentsConfig.intro?.marginTop || 0;
    const availableForIntro = availableSpace - usedHeight - introMargin;
    
    // Estimate how many lines of intro fit
    const avgCharsPerLine = 80;
    const totalLines = Math.ceil(position.intro.length / avgCharsPerLine);
    const linesPerHeight = Math.floor(availableForIntro / lineHeight);
    
    if (linesPerHeight <= 0) {
      return null; // Can't fit any intro
    }
    
    const introLinesOnCurrentPage = Math.min(linesPerHeight, totalLines);
    
    if (introLinesOnCurrentPage >= totalLines) {
      // Entire intro fits - this shouldn't happen if we're here, but handle it
      return null;
    }
    
    // Split intro text (rough approximation)
    const charsPerLine = Math.ceil(position.intro.length / totalLines);
    const splitIndex = introLinesOnCurrentPage * charsPerLine;
    
    const currentPageIntro = position.intro.substring(0, splitIndex);
    const nextPageIntro = position.intro.substring(splitIndex);
    
    // Create split positions
    const currentPagePosition: Position = {
      ...position,
      intro: currentPageIntro,
      description: [],
      _isPartial: true,
      _splitIndexes: {
        introLineStartIndex: 0,
        introLineEndIndex: introLinesOnCurrentPage - 1
      }
    };
    
    const nextPagePosition: Position = {
      ...position,
      intro: nextPageIntro,
      description: position.description || [],
      _splitContinuation: true,
      _splitIndexes: {
        introLineStartIndex: introLinesOnCurrentPage,
        introLineEndIndex: totalLines - 1
      }
    };
    
    return {
      fitsOnCurrentPage: false,
      currentPageContent: currentPagePosition,
      nextPageContent: nextPagePosition,
      splitIndexes: {
        currentPage: {
          primary: {
            introLineStartIndex: 0,
            introLineEndIndex: introLinesOnCurrentPage - 1
          },
          secondary: {}
        },
        nextPage: {
          primary: {
            introLineStartIndex: introLinesOnCurrentPage,
            introLineEndIndex: totalLines - 1
          },
          secondary: {}
        }
      },
      usedHeight: usedHeight + (introLinesOnCurrentPage * lineHeight) + introMargin + (margins?.bottom || 0),
      wasSplit: true
    };
  }
  
  /**
   * Simple move logic (when splitting is disabled)
   */
  private simpleMove(
    position: Position,
    availableSpace: number,
    templateConfig: TemplateConfig,
    margins?: { top?: number; bottom?: number }
  ): SplitResult {
    const totalHeight = this.calculateHeight(position, templateConfig);
    const requiredSpace = totalHeight + (margins?.top || 0) + (margins?.bottom || 0);
    
    if (requiredSpace <= availableSpace) {
      return {
        fitsOnCurrentPage: true,
        currentPageContent: position,
        nextPageContent: null,
        splitIndexes: this.createEmptySplitIndexes(),
        usedHeight: totalHeight,
        wasSplit: false
      };
    }
    
    return {
      fitsOnCurrentPage: false,
      currentPageContent: null,
      nextPageContent: position,
      splitIndexes: this.createEmptySplitIndexes(),
      usedHeight: 0,
      wasSplit: false
    };
  }
  
  /**
   * Helper: Create empty split indexes
   */
  private createEmptySplitIndexes(): SplitIndexes {
    return {
      currentPage: { primary: {}, secondary: {} },
      nextPage: { primary: {}, secondary: {} }
    };
  }
  
  /**
   * Get line height from template
   */
  private getLineHeight(templateConfig: TemplateConfig): number {
    const lineHeight = templateConfig.style?.lineHeight;
    const fontSize = parseFloat(templateConfig.style?.fontSize || '12px');
    
    if (typeof lineHeight === 'number') {
      return lineHeight * fontSize;
    } else if (typeof lineHeight === 'string') {
      const ratio = parseFloat(lineHeight);
      return isNaN(ratio) ? fontSize * 1.5 : ratio * fontSize;
    }
    
    return fontSize * 1.5; // Default
  }
  
  /**
   * Estimate title section height
   */
  private estimateTitleHeight(lineHeight: number): number {
    return lineHeight * 2; // Title + company line
  }
  
  calculateHeight(content: Position, config: TemplateConfig): number {
    return this.heightCalculator.calculatePositionHeight(content, config);
  }
  
  fitsInSpace(content: Position, availableSpace: number, config: TemplateConfig): boolean {
    const height = this.calculateHeight(content, config);
    return height <= availableSpace;
  }
}

