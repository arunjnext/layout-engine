/**
 * Shared types and interfaces
 */

export interface PageConfig {
    pageHeight: number;
    headerHeight?: number;
    footerHeight?: number;
    marginTop?: number;
    marginBottom?: number;
  }
  
  export interface SpaceBreakdown {
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
  
  export interface ComponentMeasurement {
    totalHeight: number;
    breakdown: ComponentBreakdown;
    component: HTMLElement;
  }
  
  export interface ComponentBreakdown {
    title: number;
    intro: number;
    statements: {
      total: number;
      items: Array<{ index: number; height: number; lineCount: number }>;
    };
  }
  
  export interface PlacementResult {
    success: boolean;
    placed: boolean;
    split?: boolean;
    component?: HTMLElement;
    usedHeight?: number;
    remainingSpace: number;
    reason?: string;
  }
  
  export interface TemplateConfig {
    style: {
      fontFamily?: string;
      fontSize?: string;
      lineHeight?: string | number;
      heights?: {
        statementLineHeight?: number;
        skillRowHeight?: number;
      };
      spaces?: {
        work?: {
          marginTop?: number;
          marginBottom?: number;
          intro?: {
            marginTop?: number;
          };
          statements?: {
            list?: {
              marginTop?: number;
            };
            item?: {
              marginTop?: number;
            };
          };
        };
        education?: {
          marginTop?: number;
          marginBottom?: number;
        };
        skills?: {
          marginTop?: number;
          marginBottom?: number;
        };
        [key: string]: any;
      };
    };
  }