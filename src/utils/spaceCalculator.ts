/**
 * Space Calculator - Tracks remaining vertical space on page
 * 
 * First Principle: 
 * Remaining Space = Page Height - (Fixed Elements + Dynamic Content)
 */
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
    
    /**
     * Reset for new page
     */
    reset(): void {
      this.placedContent = [];
    }
  }
  
  interface PageConfig {
    pageHeight: number;
    headerHeight?: number;
    footerHeight?: number;
    marginTop?: number;
    marginBottom?: number;
  }
  
  interface SpaceBreakdown {
    pageHeight: number;
    fixedElements: {
      header: number;
      footer: number;
      marginTop: number;
      marginBottom: number;
      total: number;
    };
    dynamicContent: {
      items: Array<{ contentType: string; height: number }>;
      totalHeight: number;
      totalMargins: number;
    };
    usedHeight: number;
    remainingSpace: number;
  }



  /**
 * Example: Placing content and tracking space
 */
function exampleUsage() {
    // Initialize with A4 dimensions
    const calculator = new SpaceCalculator({
      pageHeight: 1123, // A4 at 96 DPI
      headerHeight: 50,
      footerHeight: 30,
      marginTop: 20,
      marginBottom: 20
    });
    
    console.log('Initial remaining space:', calculator.calculateRemainingSpace());
    // Output: 1003px (1123 - 50 - 30 - 20 - 20)
    
    // Place section 1: Summary (100px tall)
    calculator.placeContent('summary', 100, { bottom: 15 });
    console.log('After summary:', calculator.calculateRemainingSpace());
    // Output: 888px (1003 - 100 - 15)
    
    // Place section 2: Work Experience header (30px)
    calculator.placeContent('work-header', 30, { top: 20, bottom: 10 });
    console.log('After work header:', calculator.calculateRemainingSpace());
    // Output: 838px (888 - 20 - 30 - 10)
    
    // Place position 1: Job 1 (250px tall)
    calculator.placeContent('work-position-1', 250, { top: 0, bottom: 0 });
    console.log('After position 1:', calculator.calculateRemainingSpace());
    // Output: 588px (838 - 250)
    
    // Place position 2: Job 2 (300px tall)
    calculator.placeContent('work-position-2', 300, { top: 10, bottom: 0 });
    console.log('After position 2:', calculator.calculateRemainingSpace());
    // Output: 278px (588 - 10 - 300)
    
    // Try to place position 3: Job 3 (350px tall)
    const position3Height = 350;
    const remaining = calculator.calculateRemainingSpace();
    
    if (position3Height <= remaining) {
      calculator.placeContent('work-position-3', position3Height);
      console.log('Position 3 fits!');
    } else {
      console.log(`Position 3 doesn't fit! Need ${position3Height}px, have ${remaining}px`);
      // Decision: Move to next page
    }
  }



  exampleUsage();