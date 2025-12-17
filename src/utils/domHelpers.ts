/**
 * DOM utility functions
 */

/**
 * Get computed line height
 */
export function getLineHeight(element: HTMLElement): number {
    const styles = window.getComputedStyle(element);
    const lineHeight = parseFloat(styles.lineHeight);
    
    if (isNaN(lineHeight)) {
      return parseFloat(styles.fontSize) * 1.5; // Default 1.5x font size
    }
    
    return lineHeight;
  }
  
  /**
   * Calculate number of lines in element
   */
  export function calculateLineCount(element: HTMLElement): number {
    const lineHeight = getLineHeight(element);
    const height = element.offsetHeight;
    return Math.ceil(height / lineHeight);
  }
  
  /**
   * Get margin top from computed styles
   */
  export function getMarginTop(element: HTMLElement): number {
    const styles = window.getComputedStyle(element);
    return parseFloat(styles.marginTop) || 0;
  }
  
  /**
   * Get margin bottom from computed styles
   */
  export function getMarginBottom(element: HTMLElement): number {
    const styles = window.getComputedStyle(element);
    return parseFloat(styles.marginBottom) || 0;
  }
  
  /**
   * Force browser reflow (layout calculation)
   */
  export function forceReflow(element: HTMLElement): void {
    void element.offsetHeight;
  }
  
  /**
   * Create hidden measurement container
   */
  export function createMeasurementContainer(): HTMLElement {
    const container = document.createElement('div');
    container.className = 'measurement-container';
    container.style.cssText = `
      position: absolute;
      visibility: hidden;
      top: -9999px;
      left: -9999px;
      width: 210mm;
      height: auto;
      overflow: visible;
    `;
    document.body.appendChild(container);
    return container;
  }