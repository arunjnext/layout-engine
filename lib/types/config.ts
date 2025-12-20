/**
 * Configuration types for the Resume Layout Engine
 */

/**
 * Main configuration for the Resume Layout Engine
 */
export interface LayoutEngineConfig {
  /** Container element or selector where pages will be rendered */
  container: HTMLElement | string;

  /** Page configuration (dimensions, margins, header/footer) */
  page?: PageConfig;

  /** Template configuration (fonts, spacing, styles) */
  template?: TemplateConfig;

  /** Event callbacks for layout events */
  events?: EventCallbacks;

  /** Rendering options */
  rendering?: RenderingOptions;

  /** Smart splitting guidelines */
  splitGuidelines?: SplitGuidelines;
}

/**
 * Page configuration - dimensions and fixed elements
 */
export interface PageConfig {
  /** Page width in pixels (default: 793.7px for A4 at 96 DPI) */
  width?: number;

  /** Page height in pixels (default: 1123px for A4 at 96 DPI) */
  height?: number;

  /** Page padding */
  padding?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };

  /** Header configuration */
  header?: {
    height?: number;
    render?: () => HTMLElement;
  };

  /** Footer configuration */
  footer?: {
    height?: number;
    render?: () => HTMLElement;
  };

  /** Top margin (outside content area) */
  marginTop?: number;

  /** Bottom margin (outside content area) */
  marginBottom?: number;
}

/**
 * Template configuration - styling and spacing
 */
export interface TemplateConfig {
  style?: {
    fontFamily?: string;
    fontSize?: string;
    lineHeight?: string | number;

    /** Spacing configuration for different section types */
    spacing?: {
      experience?: SectionSpacing;
      education?: SectionSpacing;
      skills?: SectionSpacing;
    };

    /** Number of columns for the page layout (default: 1) */
    columnCount?: number;

    /** Gap between columns in pixels (default: 20) */
    columnGap?: number;

    /**
     * Column width ratios (e.g., [2, 1] for 2:1 ratio, [3, 2] for 3:2 ratio)
     * If not provided, columns will be equal width
     * Array length must match columnCount
     * @example
     * // Equal columns (default)
     * columnCount: 2 // Results in 50%/50%
     *
     * // 2:1 ratio (left column twice as wide)
     * columnCount: 2,
     * columnWidths: [2, 1] // Results in 66.67%/33.33%
     *
     * // 3:2 ratio (common for resumes)
     * columnCount: 2,
     * columnWidths: [3, 2] // Results in 60%/40%
     */
    columnWidths?: number[];

    /** Legacy support - will be deprecated */
    spaces?: {
      work?: any;
      education?: any;
      skills?: any;
    };
  };
}

/**
 * Spacing configuration for a section
 */
export interface SectionSpacing {
  marginTop?: number;
  marginBottom?: number;
  intro?: {
    marginTop?: number;
    marginBottom?: number;
  };
  statements?: {
    list?: {
      marginTop?: number;
      marginBottom?: number;
    };
    item?: {
      marginTop?: number;
      marginBottom?: number;
    };
  };
}

/**
 * Event callbacks for layout events
 */
export interface EventCallbacks {
  /** Called when a new page is created */
  onPageCreated?: (pageIndex: number, pageElement: HTMLElement) => void;

  /** Called when content is successfully placed */
  onContentPlaced?: (result: PlacementResult) => void;

  /** Called when content doesn't fit on current page */
  onOverflow?: (contentType: string, requiredSpace: number, availableSpace: number) => void;

  /** Called when an error occurs */
  onError?: (error: Error) => void;
}

/**
 * Rendering options
 */
export interface RenderingOptions {
  /** Automatically create new pages when needed (default: true) */
  autoCreatePages?: boolean;

  /** Enable content splitting across pages (default: false) */
  enableSplitting?: boolean;

  /** Measurement mode - 'accurate' uses hidden container, 'fast' estimates (default: 'accurate') */
  measurementMode?: 'accurate' | 'fast';
}

/**
 * Guidelines for smart splitting behavior
 */
export interface SplitGuidelines {
  /** Minimum percentage of content that must fit to attempt split (default: 0.3 = 30%) */
  minSplitPercentage?: number;

  /** Minimum space needed in pixels to attempt split (default: 100px) */
  minRemainingSpace?: number;

  /** Prefer splitting at statement boundaries (default: true) */
  preferStatementSplits?: boolean;

  /** Always keep title with some content (default: true) */
  keepTitleWithContent?: boolean;

  /** Enable smart splitting feature (default: true) */
  enableSmartSplitting?: boolean;
}

/**
 * Result of placing content on a page
 */
export interface PlacementResult {
  /** Whether the operation was successful */
  success: boolean;

  /** Whether the content was placed */
  placed: boolean;

  /** Whether the content was split across pages */
  split?: boolean;

  /** The placed component element */
  component?: HTMLElement;

  /** Height used by the component */
  usedHeight?: number;

  /** Remaining space on current page after placement */
  remainingSpace: number;

  /** Index of the page where content was placed */
  pageIndex?: number;

  /** Index of the column where content was placed (default: 0) */
  columnIndex?: number;

  /** Total number of pages */
  pageCount?: number;

  /** Reason for failure (if success is false) */
  reason?: string;
}

