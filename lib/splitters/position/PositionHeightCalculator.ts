import type { TemplateConfig } from '../../types/config';
import { getLineHeight } from '../../utils/domHelpers';

/**
 * Calculates heights of position components
 */
export class PositionHeightCalculator {
  /**
   * Calculate total height of a position component
   */
  calculatePositionHeight(
    position: { intro?: string; description?: string[] },
    templateConfig: TemplateConfig,
    element?: HTMLElement
  ): number {
    const lineHeight = this.getLineHeight(templateConfig, element);
    const accomplishmentsConfig = this.getAccomplishmentsConfig(templateConfig);
    
    let totalHeight = 0;
    
    // Title section height (estimated or measured)
    const titleHeight = element 
      ? this.measureTitleHeight(element)
      : this.estimateTitleHeight(lineHeight);
    totalHeight += titleHeight;
    
    // Intro height
    if (position.intro) {
      const introHeight = this.calculateIntroHeight(
        position.intro,
        accomplishmentsConfig,
        lineHeight,
        element
      );
      totalHeight += introHeight;
    }
    
    // Statements height
    if (position.description && position.description.length > 0) {
      const statementsHeight = this.calculateStatementsHeight(
        position.description,
        accomplishmentsConfig,
        lineHeight,
        !!position.intro,
        element
      );
      totalHeight += statementsHeight;
    }
    
    return totalHeight;
  }
  
  /**
   * Calculate height of intro text
   */
  calculateIntroHeight(
    intro: string,
    accomplishmentsConfig: any,
    lineHeight: number,
    element?: HTMLElement
  ): number {
    if (element) {
      const introElement = element.querySelector('.position-intro') as HTMLElement;
      if (introElement) {
        return introElement.offsetHeight + (accomplishmentsConfig.intro?.marginTop || 0);
      }
    }
    
    // Estimate: approximate lines based on text length
    const avgCharsPerLine = 80; // Rough estimate
    const lines = Math.ceil(intro.length / avgCharsPerLine);
    return lines * lineHeight + (accomplishmentsConfig.intro?.marginTop || 0);
  }
  
  /**
   * Calculate height of statements list
   */
  calculateStatementsHeight(
    statements: string[],
    accomplishmentsConfig: any,
    lineHeight: number,
    hasIntro: boolean,
    element?: HTMLElement
  ): number {
    if (element) {
      const statementsList = element.querySelector('.position-statements') as HTMLElement;
      if (statementsList) {
        return statementsList.offsetHeight;
      }
    }
    
    let totalHeight = 0;
    
    // Add list margin if there's an intro or it's the first element
    if (hasIntro || statements.length > 0) {
      totalHeight += accomplishmentsConfig.statements?.list?.marginTop || 0;
    }
    
    // Calculate each statement height
    statements.forEach((statement, index) => {
      const statementHeight = this.calculateStatementHeight(
        statement,
        accomplishmentsConfig,
        lineHeight,
        index,
        hasIntro
      );
      totalHeight += statementHeight;
    });
    
    return totalHeight;
  }
  
  /**
   * Calculate height of a single statement
   */
  calculateStatementHeight(
    statement: string,
    accomplishmentsConfig: any,
    lineHeight: number,
    index: number,
    hasIntro: boolean
  ): number {
    // Estimate lines based on text length
    const avgCharsPerLine = 80;
    const lines = Math.ceil(statement.length / avgCharsPerLine);
    const height = lines * lineHeight;
    
    // Add margin top
    let marginTop = 0;
    if (index === 0 && hasIntro) {
      marginTop = accomplishmentsConfig.statements?.list?.marginTop || 0;
    } else if (index > 0) {
      marginTop = accomplishmentsConfig.statements?.item?.marginTop || 0;
    }
    
    return height + marginTop;
  }
  
  /**
   * Measure title section height from element
   */
  private measureTitleHeight(element: HTMLElement): number {
    const titleSection = element.querySelector('.position-title-section') as HTMLElement;
    return titleSection ? titleSection.offsetHeight : 0;
  }
  
  /**
   * Estimate title section height
   */
  private estimateTitleHeight(lineHeight: number): number {
    return lineHeight * 2; // Title + company line
  }
  
  /**
   * Get line height from template config
   */
  private getLineHeight(templateConfig: TemplateConfig, element?: HTMLElement): number {
    if (element) {
      return getLineHeight(element);
    }
    
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
   * Get accomplishments config from template
   */
  private getAccomplishmentsConfig(templateConfig: TemplateConfig): any {
    return templateConfig.style?.spaces?.work || 
           templateConfig.style?.spacing?.experience || 
           {};
  }
}

