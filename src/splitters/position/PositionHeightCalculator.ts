import type { AccomplishmentLines } from '../../types/resume';

/**
 * Calculates heights of positions
 */
export class PositionHeightCalculator {
  /**
   * Calculate total height of all positions
   */
  getPositionsHeight(params: {
    accomplishmentsConfig: any;
    positionLines: AccomplishmentLines[];
    lineHeight: number;
  }): number {
    const { accomplishmentsConfig, positionLines, lineHeight } = params;
    let totalHeight = 0;
    
    positionLines.forEach((positionLineData, index) => {
      const itemHeight = this.getPositionItemHeight({
        accomplishmentsConfig,
        positionLines: positionLineData,
        index,
        lineHeight,
        positionIndex: index,
      });
      totalHeight += itemHeight.accomplishment;
    });
    
    return totalHeight;
  }
  
  /**
   * Calculate height of a single position item
   */
  getPositionItemHeight(params: {
    accomplishmentsConfig: any;
    positionLines: AccomplishmentLines;
    index: number;
    lineHeight: number;
    positionIndex: number;
    ignoreIntro?: boolean;
    ignoreIntroMargin?: boolean;
    statementsStartIndex?: number;
    startingStatementLineStartIndex?: number;
    introLineStartIndex?: number;
  }): { accomplishment: number; intro: number; statements: number } {
    const {
      accomplishmentsConfig,
      index,
      ignoreIntro,
      statementsStartIndex = 0,
      startingStatementLineStartIndex = 0,
      introLineStartIndex = 0,
      positionLines,
      lineHeight,
      positionIndex,
    } = params;
    
    // Calculate intro height
    const introHeight = ignoreIntro
      ? 0
      : this.getIntroHeight({
          accomplishmentsConfig,
          lines: positionLines.intro,
          index,
          ignoreIntroMargin: params.ignoreIntroMargin,
          lineHeight,
          lineStartIndex: introLineStartIndex,
        });
    
    // Calculate statements height
    const statementsHeight = this.getStatementsListHeight({
      accomplishmentsConfig,
      hasIntro: positionLines.intro.length > 0,
      statements: positionLines.statements,
      statementsStartIndex,
      startingStatementLineStartIndex,
      lineHeight,
      positionIndex,
    });
    
    let totalHeight = introHeight + statementsHeight;
    
    // Add margin top for first position
    if (index === 0 && !introLineStartIndex && !startingStatementLineStartIndex) {
      totalHeight += accomplishmentsConfig.marginTop || 0;
    }
    
    return {
      accomplishment: totalHeight,
      intro: introHeight,
      statements: statementsHeight,
    };
  }
  
  private getIntroHeight(params: {
    accomplishmentsConfig: any;
    lines: string[];
    index: number;
    ignoreIntroMargin?: boolean;
    lineHeight: number;
    lineStartIndex: number;
  }): number {
    const { accomplishmentsConfig, lines, index, ignoreIntroMargin, lineHeight, lineStartIndex } = params;
    
    if (!lines || lines.length === 0) return 0;
    
    const lineCount = lineStartIndex ? lines.length - lineStartIndex : lines.length;
    let height = lineCount * lineHeight;
    
    if (height > 0) {
      height += this.getIntroMarginTop({
        accomplishmentsConfig,
        index,
        ignoreIntroMargin,
        lineStartIndex,
      });
    }
    
    return height;
  }
  
  private getStatementsListHeight(params: {
    accomplishmentsConfig: any;
    hasIntro: boolean;
    statements: string[][];
    lineHeight: number;
    statementsStartIndex: number;
    startingStatementLineStartIndex: number;
    positionIndex: number;
  }): number {
    const {
      accomplishmentsConfig,
      hasIntro,
      statements,
      lineHeight,
      statementsStartIndex,
      startingStatementLineStartIndex,
      positionIndex,
    } = params;
    
    let totalHeight = 0;
    
    statements.forEach((statementLines, index) => {
      if (statementsStartIndex && index < statementsStartIndex) return;
      
      const lineStart = statementsStartIndex === index ? startingStatementLineStartIndex : 0;
      
      totalHeight += this.getStatementItemHeight({
        lineStartIndex: lineStart,
        lines: statementLines,
        lineHeight,
        index,
        hasIntro,
        accomplishmentsConfig,
        positionIndex,
      });
    });
    
    return totalHeight;
  }
  
  private getStatementItemHeight(params: {
    accomplishmentsConfig: any;
    lines: string[];
    lineHeight: number;
    index: number;
    hasIntro: boolean;
    lineStartIndex: number;
    positionIndex: number;
  }): number {
    const {
      accomplishmentsConfig,
      lines,
      lineHeight,
      index,
      hasIntro,
      lineStartIndex,
      positionIndex,
    } = params;
    
    if (!lines || lines.length === 0) return 0;
    
    const lineCount = lineStartIndex ? lines.length - lineStartIndex : lines.length;
    let height = lineCount * lineHeight;
    
    if (height > 0) {
      height += this.getStatementItemMarginTop({
        accomplishmentsConfig,
        hasIntro,
        index,
        lineStartIndex,
        positionIndex,
      });
    }
    
    return height;
  }
  
  private getStatementItemMarginTop(params: {
    accomplishmentsConfig: any;
    hasIntro: boolean;
    index: number;
    lineStartIndex: number;
    positionIndex: number;
  }): number {
    const { accomplishmentsConfig, hasIntro, index, lineStartIndex, positionIndex } = params;
    
    if (lineStartIndex > 0) return 0;
    
    let marginTop = accomplishmentsConfig.statements?.item?.marginTop || 0;
    
    if (index === 0 && hasIntro) {
      marginTop = accomplishmentsConfig.statements?.list?.marginTop || 0;
    }
    
    if (index === 0 && !hasIntro && positionIndex === 0) {
      marginTop = accomplishmentsConfig.marginTop || 0;
    }
    
    return marginTop;
  }
  
  private getIntroMarginTop(params: {
    accomplishmentsConfig: any;
    index: number;
    ignoreIntroMargin?: boolean;
    lineStartIndex: number;
  }): number {
    const { accomplishmentsConfig, index, ignoreIntroMargin, lineStartIndex } = params;
    
    if (lineStartIndex > 0) return 0;
    
    let marginTop = 0;
    
    if (index > 0 && !ignoreIntroMargin) {
      marginTop = accomplishmentsConfig.intro?.marginTop || 0;
    }
    
    if (index === 0 && !ignoreIntroMargin) {
      marginTop = accomplishmentsConfig.marginTop || 0;
    }
    
    return marginTop;
  }
}

