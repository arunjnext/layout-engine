import type { ComponentBreakdown, ComponentMeasurement, TemplateConfig } from '../../types';
import { createMeasurementContainer, forceReflow, getLineHeight } from '../../utils/domHelpers';

/**
 * Measurement Service - Measures components before placing them
 */
export class MeasurementService {
  private measurementContainer: HTMLElement;
  
  constructor() {
    this.measurementContainer = createMeasurementContainer();
  }
  
  /**
   * Measure component height (in hidden container)
   */
  measureComponent(
    component: HTMLElement, 
    templateConfig: TemplateConfig
  ): ComponentMeasurement {
    // Clone to avoid affecting original
    const clone = component.cloneNode(true) as HTMLElement;
    
    // Apply template styles to match final output
    this.applyTemplateStyles(clone, templateConfig);
    
    // Add to measurement container
    this.measurementContainer.appendChild(clone);
    
    // Force browser to calculate layout
    forceReflow(clone);
    
    // Measure total height
    const totalHeight = clone.offsetHeight;
    
    // Measure component breakdown
    const breakdown = this.measureBreakdown(clone);
    
    // Clean up
    this.measurementContainer.removeChild(clone);
    
    return {
      totalHeight,
      breakdown,
      component: clone
    };
  }
  
  private measureBreakdown(component: HTMLElement): ComponentBreakdown {
    const titleSection = component.querySelector('.position-title-section');
    const intro = component.querySelector('.position-intro');
    const statementsList = component.querySelector('.position-statements');
    
    // Measure each statement individually
    const statements = Array.from(statementsList?.children || []).map((li, index) => {
      const element = li as HTMLElement;
      const lineHeight = getLineHeight(element);
      return {
        index,
        height: element.offsetHeight,
        lineCount: Math.ceil(element.offsetHeight / lineHeight)
      };
    });
    
    return {
      title: (titleSection as HTMLElement)?.offsetHeight || 0,
      intro: (intro as HTMLElement)?.offsetHeight || 0,
      statements: {
        total: (statementsList as HTMLElement)?.offsetHeight || 0,
        items: statements
      }
    };
  }
  
  private applyTemplateStyles(element: HTMLElement, config: TemplateConfig): void {
    const style = config.style;
    
    // Apply base styles
    element.style.fontFamily = style.fontFamily || 'Arial, sans-serif';
    element.style.fontSize = style.fontSize || '12px';
    element.style.lineHeight = String(style.lineHeight || 1.5);
    
    // Apply section-specific styles
    const workStyles = style.spaces?.work;
    if (workStyles) {
      if (workStyles.marginTop) {
        element.style.marginTop = `${workStyles.marginTop}px`;
      }
      if (workStyles.marginBottom) {
        element.style.marginBottom = `${workStyles.marginBottom}px`;
      }
    }
  }
  
  /**
   * Cleanup measurement container
   */
  cleanup(): void {
    if (this.measurementContainer.parentNode) {
      this.measurementContainer.parentNode.removeChild(this.measurementContainer);
    }
  }
}