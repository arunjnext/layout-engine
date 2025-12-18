/**
 * Space Calculator - Tracks remaining vertical space on a page
 * 
 * Core Principle: 
 * Remaining Space = Page Height - (Fixed Elements + Dynamic Content)
 */

import type { PageConfig, SpaceBreakdown } from '../types/measurement';

export class SpaceCalculator {
  private pageHeight: number;
  private headerHeight: number;
  private footerHeight: number;
  private marginTop: number;
  private marginBottom: number;
  
  // Track what's been placed on current page
  private placedContent: Array<{
    contentType: string;
    height: number;
    marginTop?: number;
    marginBottom?: number;
  }> = [];
  
  constructor(config: PageConfig) {
    this.pageHeight = config.pageHeight; // 1123px for A4
    this.headerHeight = config.headerHeight || 0;
    this.footerHeight = config.footerHeight || 0;
    this.marginTop = config.marginTop || 0;
    this.marginBottom = config.marginBottom || 0;
  }
  
  /**
   * Calculate remaining space after all placed content
   */
  calculateRemainingSpace(): number {
    // Start with full page height
    let usedHeight = 0;
    
    // 1. Fixed elements (always present)
    usedHeight += this.headerHeight;
    usedHeight += this.footerHeight;
    usedHeight += this.marginTop;
    usedHeight += this.marginBottom;
    
    // 2. Dynamic content (what we've placed so far)
    this.placedContent.forEach((item, index) => {
      // Add margin-top for this item (except first item)
      if (index > 0 && item.marginTop) {
        usedHeight += item.marginTop;
      }
      
      // Add content height
      usedHeight += item.height;
      
      // Add margin-bottom
      if (item.marginBottom) {
        usedHeight += item.marginBottom;
      }
    });
    
    // 3. Calculate remaining
    const remaining = this.pageHeight - usedHeight;
    
    return Math.max(0, remaining); // Can't be negative
  }
  
  /**
   * Place content on page (updates tracking)
   */
  placeContent(
    contentType: string,
    height: number,
    margins?: { top?: number; bottom?: number }
  ): void {
    this.placedContent.push({
      contentType,
      height,
      marginTop: margins?.top,
      marginBottom: margins?.bottom
    });
  }
  
  /**
   * Get breakdown for debugging
   */
  getBreakdown(): SpaceBreakdown {
    const usedHeight = this.calculateUsedHeight();
    
    return {
      pageHeight: this.pageHeight,
      fixedElements: {
        header: this.headerHeight,
        footer: this.footerHeight,
        marginTop: this.marginTop,
        marginBottom: this.marginBottom,
        total: this.headerHeight + this.footerHeight + this.marginTop + this.marginBottom
      },
      dynamicContent: {
        items: this.placedContent,
        totalHeight: this.placedContent.reduce((sum, item) => sum + item.height, 0),
        totalMargins: this.calculateTotalMargins()
      },
      usedHeight,
      remainingSpace: this.calculateRemainingSpace()
    };
  }
  
  /**
   * Reset for new page
   */
  reset(): void {
    this.placedContent = [];
  }
  
  private calculateUsedHeight(): number {
    let total = 0;
    total += this.headerHeight + this.footerHeight + this.marginTop + this.marginBottom;
    
    this.placedContent.forEach((item, index) => {
      if (index > 0 && item.marginTop) total += item.marginTop;
      total += item.height;
      if (item.marginBottom) total += item.marginBottom;
    });
    
    return total;
  }
  
  private calculateTotalMargins(): number {
    let total = 0;
    this.placedContent.forEach((item, index) => {
      if (index > 0 && item.marginTop) total += item.marginTop;
      if (item.marginBottom) total += item.marginBottom;
    });
    return total;
  }
}

