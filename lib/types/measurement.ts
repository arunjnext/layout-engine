/**
 * Measurement-related types
 */

/**
 * Result of measuring a component
 */
export interface ComponentMeasurement {
  /** Total height of the component including all parts */
  totalHeight: number;

  /** Detailed breakdown of component parts */
  breakdown: ComponentBreakdown;

  /** The measured component element */
  component: HTMLElement;
}

/**
 * Breakdown of component measurements
 */
export interface ComponentBreakdown {
  /** Height of the title section */
  title: number;

  /** Height of the intro section */
  intro: number;

  /** Measurements for statement/bullet list */
  statements: {
    /** Total height of all statements */
    total: number;

    /** Individual statement measurements */
    items: Array<{
      index: number;
      height: number;
      lineCount: number;
    }>;
  };
}

/**
 * Space breakdown for debugging
 */
export interface SpaceBreakdown {
  /** Total page height */
  pageHeight: number;

  /** Fixed elements that always take space */
  fixedElements: {
    header: number;
    footer: number;
    marginTop: number;
    marginBottom: number;
    total: number;
  };

  /** Dynamic content that has been placed */
  dynamicContent: {
    items: Array<{
      contentType: string;
      height: number;
      marginTop?: number;
      marginBottom?: number;
    }>;
    totalHeight: number;
    totalMargins: number;
  };

  /** Total used height */
  usedHeight: number;

  /** Remaining available space */
  remainingSpace: number;
}

/**
 * Page configuration for SpaceCalculator
 */
export interface PageConfig {
  pageHeight: number;
  width?: number;
  padding?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
  headerHeight?: number;
  footerHeight?: number;
  marginTop?: number;
  marginBottom?: number;
}

