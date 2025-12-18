/**
 * DOM utility functions for measurement and layout
 */

/**
 * Get computed line height from an element
 * Handles edge cases like "normal" value
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
 * Calculate number of lines in an element
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
 * This ensures measurements are accurate
 */
export function forceReflow(element: HTMLElement): void {
  void element.offsetHeight;
}

/**
 * Create hidden measurement container
 * Used to measure components before placing them on the page
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

/**
 * Resolve container from element or selector
 */
export function resolveContainer(container: HTMLElement | string): HTMLElement {
  if (typeof container === 'string') {
    const element = document.querySelector(container);
    if (!element) {
      throw new Error(`Container element not found: ${container}`);
    }
    return element as HTMLElement;
  }
  return container;
}

