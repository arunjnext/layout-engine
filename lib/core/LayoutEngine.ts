import { ComponentFactory } from '../services/ComponentFactory';
import { MeasurementService } from '../services/MeasurementService';
import { SplitterFactory } from '../splitters/SplitterFactory';
import type { ComponentMeasurement, EventCallbacks, PlacementResult, SplitGuidelines, TemplateConfig } from '../types';
import type { PageConfig } from '../types/measurement';
import type { Education, Position, Skill } from '../types/resume';
import { SpaceCalculator } from '../utils/SpaceCalculator';

/**
 * Internal Layout Engine - Handles component → measurement → placement
 * This is the core engine that manages the layout logic
 */
export class LayoutEngine {
  private componentFactory: ComponentFactory;
  private measurementService: MeasurementService;
  private spaceCalculator: SpaceCalculator;
  private pagesContainer: HTMLElement;
  private pages: HTMLElement[] = [];
  private currentPageIndex: number = 0;
  private templateConfig: TemplateConfig;
  private pageConfig: PageConfig;
  private placedComponents: Map<string, HTMLElement> = new Map();
  private pageCalculators: Map<number, SpaceCalculator[]> = new Map();
  private eventCallbacks?: EventCallbacks;
  private splitterFactory: SplitterFactory;
  private splitGuidelines?: SplitGuidelines;

  constructor(
    pagesContainer: HTMLElement,
    pageConfig: PageConfig,
    templateConfig: TemplateConfig,
    eventCallbacks?: EventCallbacks,
    splitGuidelines?: SplitGuidelines
  ) {
    this.componentFactory = new ComponentFactory();
    this.measurementService = new MeasurementService();
    this.pagesContainer = pagesContainer;
    this.pageConfig = pageConfig;
    this.templateConfig = templateConfig;
    this.eventCallbacks = eventCallbacks;
    this.splitGuidelines = splitGuidelines;

    // Create splitter factory with guidelines
    this.splitterFactory = new SplitterFactory(splitGuidelines);

    // Create initial space calculator
    this.spaceCalculator = new SpaceCalculator(pageConfig);

    // Create first page
    this.createNewPage();
  }

  /**
   * Create a new page
   */
  private createNewPage(): HTMLElement {
    const page = document.createElement('div');
    page.className = 'resume-page';
    page.dataset.pageNumber = this.pages.length.toString();

    // Check column config
    const columnCount = this.templateConfig.style?.columnCount || 1;
    const columnGap = this.templateConfig.style?.columnGap || 20;

    const calculators: SpaceCalculator[] = [];

    if (columnCount > 1) {
      page.classList.add('multi-column');
      page.style.display = 'grid';

      // Get column widths from config or default to equal widths
      const columnWidths = this.templateConfig.style?.columnWidths;

      if (columnWidths && columnWidths.length === columnCount) {
        // Use custom ratios (e.g., [2, 1] becomes "2fr 1fr")
        page.style.gridTemplateColumns = columnWidths.map(w => `${w}fr`).join(' ');
      } else {
        // Default: equal widths
        page.style.gridTemplateColumns = `repeat(${columnCount}, 1fr)`;

        // Warn if columnWidths is provided but doesn't match columnCount
        if (columnWidths && columnWidths.length !== columnCount) {
          console.warn(
            `columnWidths array length (${columnWidths.length}) does not match columnCount (${columnCount}). Using equal widths.`
          );
        }
      }

      page.style.gap = `${columnGap}px`;

      // Create columns
      for (let i = 0; i < columnCount; i++) {
        const column = document.createElement('div');
        column.className = `resume-column column-${i}`;
        column.dataset.columnIndex = i.toString();
        // Ensure columns stretch to fill height
        column.style.height = '100%';
        page.appendChild(column);

        // Create calculator for this column
        const calculator = new SpaceCalculator(this.pageConfig);
        calculators.push(calculator);
      }
    } else {
      const calculator = new SpaceCalculator(this.pageConfig);
      calculators.push(calculator);
    }

    this.pagesContainer.appendChild(page);
    this.pages.push(page);

    // Store calculators
    this.pageCalculators.set(this.pages.length - 1, calculators);

    // Update current page index
    this.currentPageIndex = this.pages.length - 1;

    // Update main space calculator to match new page (default to first column)
    this.spaceCalculator = calculators[0];

    // Trigger event
    this.eventCallbacks?.onPageCreated?.(this.currentPageIndex, page);

    return page;
  }

  /**
   * Get current page container
   */
  private getCurrentPage(): HTMLElement {
    return this.pages[this.currentPageIndex];
  }

  /**
   * Add experience/position to layout
   * @param position - The position/experience data to add
   * @param columnIndex - The column index to place the content in (0-based, default: 0)
   */
  async addExperience(position: Position, columnIndex: number = 0): Promise<PlacementResult> {
    const maxWidth = this.calculateColumnWidth(columnIndex);

    const component = this.componentFactory.createPositionComponent(position);
    const measurement = this.measurementService.measureComponent(component, this.templateConfig, maxWidth);
    const margins = this.getMargins('experience');

    // Use the measured component (which has styles applied) instead of the original
    // Pass original position for smart splitting
    return await this.placeContent(measurement.component, measurement, margins, 'experience', position._id, position, columnIndex);
  }

  /**
   * Add education to layout
   * @param education - The education data to add
   * @param columnIndex - The column index to place the content in (0-based, default: 0)
   */
  async addEducation(education: Education, columnIndex: number = 0): Promise<PlacementResult> {
    const maxWidth = this.calculateColumnWidth(columnIndex);

    const component = this.componentFactory.createEducationComponent(education);
    const measurement = this.measurementService.measureComponent(component, this.templateConfig, maxWidth);
    const margins = this.getMargins('education');

    // Use the measured component (which has styles applied) instead of the original
    // Pass original education as position for smart splitting (education uses same structure)
    return await this.placeContent(measurement.component, measurement, margins, 'education', education._id, education as any, columnIndex);
  }

  /**
   * Add skills to layout
   * @param skills - The skills array to add
   * @param columnIndex - The column index to place the content in (0-based, default: 0)
   */
  async addSkills(skills: Skill[], columnIndex: number = 0): Promise<PlacementResult> {
    const maxWidth = this.calculateColumnWidth(columnIndex);

    const component = this.componentFactory.createSkillsComponent(skills);
    const measurement = this.measurementService.measureComponent(component, this.templateConfig, maxWidth);
    const margins = this.getMargins('skills');

    // Use the measured component (which has styles applied) instead of the original
    return await this.placeContent(measurement.component, measurement, margins, 'skills', 'skills-section', undefined, columnIndex);
  }

  /**
   * Core placement logic
   */
  private async placeContent(
    component: HTMLElement,
    measurement: ComponentMeasurement,
    margins: { top?: number; bottom?: number },
    contentType: string,
    contentId: string,
    originalPosition?: Position | Education,
    columnIndex: number = 0
  ): Promise<PlacementResult> {
    // Ensure we're using the correct page's calculator
    const pageCalculators = this.pageCalculators.get(this.currentPageIndex);
    if (pageCalculators && pageCalculators[columnIndex]) {
      this.spaceCalculator = pageCalculators[columnIndex];
    } else if (pageCalculators && pageCalculators.length > 0) {
      // Fallback
      this.spaceCalculator = pageCalculators[0];
    }

    // Check available space on current page
    const remainingSpace = this.spaceCalculator.calculateRemainingSpace();
    const requiredSpace = measurement.totalHeight + (margins.top || 0) + (margins.bottom || 0);

    if (requiredSpace <= remainingSpace) {
      return await this.placeComponentOnCurrentPage(component, measurement, margins, contentType, contentId, columnIndex);
    } else {
      // Try smart splitting first (for experience/education)
      if ((contentType === 'experience' || contentType === 'education') && originalPosition) {
        const splitResult = await this.trySmartSplit(
          originalPosition as Position,
          measurement,
          margins,
          contentType,
          contentId,
          remainingSpace,
          columnIndex
        );

        if (splitResult) {
          return splitResult;
        }
      }

      // Fallback to whole block move
      return await this.handleOverflow(component, measurement, margins, contentType, contentId, remainingSpace, columnIndex);
    }
  }

  /**
   * Try smart splitting before moving entire block
   */
  private async trySmartSplit(
    position: Position | Education,
    _measurement: ComponentMeasurement,
    margins: { top?: number; bottom?: number },
    contentType: string,
    contentId: string,
    availableSpace: number,
    columnIndex: number = 0
  ): Promise<PlacementResult | null> {
    try {
      const maxWidth = this.calculateColumnWidth(columnIndex);

      // Convert Education to Position format for splitting
      let positionForSplit: Position;
      if ('degree' in position) {
        // It's an Education, convert to Position format
        positionForSplit = {
          _id: position._id,
          title: position.degree,
          company: position.institution,
          endDate: position.year,
          description: position.description || []
        };
      } else {
        positionForSplit = position;
      }

      const splitResult = await this.splitterFactory.split({
        contentType,
        content: positionForSplit,
        availableSpace,
        templateConfig: this.templateConfig,
        splitGuidelines: this.splitGuidelines,
        margins
      });

      if (!splitResult.wasSplit) {
        // Splitter decided not to split - use normal overflow handling
        return null;
      }

      // Handle split result
      if (splitResult.currentPageContent) {
        // Convert back to Education format if needed
        let partialContent: Position | Education;
        let continuationContent: Position | Education | null = null;

        if (contentType === 'education' && 'degree' in position) {
          // Convert Position back to Education format
          const partialPos = splitResult.currentPageContent;
          partialContent = {
            _id: position._id,
            degree: partialPos.title,
            institution: partialPos.company,
            year: partialPos.endDate,
            description: partialPos.description
          };

          if (splitResult.nextPageContent) {
            const contPos = splitResult.nextPageContent;
            continuationContent = {
              _id: position._id,
              degree: contPos.title,
              institution: contPos.company,
              year: contPos.endDate,
              description: contPos.description
            };
          }
        } else {
          partialContent = splitResult.currentPageContent;
          continuationContent = splitResult.nextPageContent;
        }

        // Place partial content on current page
        const partialComponent = contentType === 'education' && 'degree' in partialContent
          ? this.componentFactory.createEducationComponent(partialContent as Education)
          : this.componentFactory.createPositionComponent(partialContent as Position);

        const partialMeasurement = this.measurementService.measureComponent(partialComponent, this.templateConfig, maxWidth);

        const currentPageResult = await this.placeComponentOnCurrentPage(
          partialMeasurement.component,
          partialMeasurement,
          margins,
          contentType,
          `${contentId}-partial`,
          columnIndex
        );

        // Now handle next page content
        if (continuationContent) {
          // Create new page
          this.createNewPage();

          // Ensure we're using the correct page's calculator for the requested column
          const pageCalculators = this.pageCalculators.get(this.currentPageIndex);
          if (pageCalculators && pageCalculators[columnIndex]) {
            this.spaceCalculator = pageCalculators[columnIndex];
          } else if (pageCalculators && pageCalculators.length > 0) {
            this.spaceCalculator = pageCalculators[0];
          }

          // Place continuation on new page
          const continuationComponent = contentType === 'education' && 'degree' in continuationContent
            ? this.componentFactory.createEducationComponent(continuationContent as Education)
            : this.componentFactory.createPositionComponent(continuationContent as Position);
          const continuationMeasurement = this.measurementService.measureComponent(continuationComponent, this.templateConfig, maxWidth);

          const nextPageResult = await this.placeComponentOnCurrentPage(
            continuationMeasurement.component,
            continuationMeasurement,
            margins,
            contentType,
            `${contentId}-continuation`,
            columnIndex
          );

          // Return combined result
          return {
            ...nextPageResult,
            split: true,
            usedHeight: currentPageResult.usedHeight || 0
          };
        }

        return {
          ...currentPageResult,
          split: true
        };
      }

      return null;
    } catch (error) {
      console.warn('Smart split failed, falling back to whole block move:', error);
      return null;
    }
  }

  /**
   * Place component on current page
   */
  private async placeComponentOnCurrentPage(
    component: HTMLElement,
    measurement: ComponentMeasurement,
    margins: { top?: number; bottom?: number },
    contentType: string,
    contentId: string,
    columnIndex: number = 0
  ): Promise<PlacementResult> {
    const currentPage = this.getCurrentPage();

    // Apply margins
    if (margins.top) {
      component.style.marginTop = `${margins.top}px`;
    }
    if (margins.bottom) {
      component.style.marginBottom = `${margins.bottom}px`;
    }

    // Append to current page (or column)
    const columnCount = this.templateConfig.style?.columnCount || 1;
    if (columnCount > 1) {
      const column = currentPage.querySelector(`.column-${columnIndex}`);
      if (column) {
        column.appendChild(component);
      } else {
        currentPage.appendChild(component);
      }
    } else {
      currentPage.appendChild(component);
    }

    // Track it
    this.placedComponents.set(contentId, component);

    // Update space calculator for current page
    this.spaceCalculator.placeContent(
      `${contentType}-${contentId}`,
      measurement.totalHeight,
      margins
    );

    const newRemainingSpace = this.spaceCalculator.calculateRemainingSpace();

    const result: PlacementResult = {
      success: true,
      placed: true,
      component,
      usedHeight: measurement.totalHeight,
      remainingSpace: newRemainingSpace,
      pageIndex: this.currentPageIndex,
      columnIndex,
      pageCount: this.pages.length
    };

    // Trigger event
    this.eventCallbacks?.onContentPlaced?.(result);

    return result;
  }

  /**
   * Handle overflow - create new page and place content
   */
  private async handleOverflow(
    component: HTMLElement,
    measurement: ComponentMeasurement,
    margins: { top?: number; bottom?: number },
    contentType: string,
    contentId: string,
    currentRemainingSpace: number,
    columnIndex: number = 0
  ): Promise<PlacementResult> {
    const requiredSpace = measurement.totalHeight + (margins.top || 0) + (margins.bottom || 0);

    // Trigger overflow event
    this.eventCallbacks?.onOverflow?.(contentType, requiredSpace, currentRemainingSpace);

    // Create new page
    this.createNewPage();

    // Ensure we're using the correct page's calculator for the requested column
    const pageCalculators = this.pageCalculators.get(this.currentPageIndex);
    if (pageCalculators && pageCalculators[columnIndex]) {
      this.spaceCalculator = pageCalculators[columnIndex];
    } else if (pageCalculators && pageCalculators.length > 0) {
      this.spaceCalculator = pageCalculators[0];
    }

    // Get the new page's remaining space
    const newPageRemainingSpace = this.spaceCalculator.calculateRemainingSpace();

    // Verify it fits on the new page
    if (requiredSpace <= newPageRemainingSpace) {
      return await this.placeComponentOnCurrentPage(component, measurement, margins, contentType, contentId, columnIndex);
    } else {
      // Content is too large even for a fresh page
      console.warn(`Content too large for new page. Required: ${requiredSpace}px, Available: ${newPageRemainingSpace}px`);
      // Place it anyway (it will overflow, but at least it's visible)
      return await this.placeComponentOnCurrentPage(component, measurement, margins, contentType, contentId, columnIndex);
    }
  }

  /**
   * Calculate the width of a specific column based on configuration
   * @param columnIndex - The index of the column (0-based)
   * @returns The calculated width in pixels, or undefined for single-column layout
   */
  private calculateColumnWidth(columnIndex: number): number | undefined {
    const columnCount = this.templateConfig.style?.columnCount || 1;
    if (columnCount <= 1) return undefined;

    const pageWidth = this.pageConfig.width || 793.7; // A4 @ 96 DPI
    const paddingRight = this.pageConfig.padding?.right || 20;
    const paddingLeft = this.pageConfig.padding?.left || 20;
    const availableWidth = pageWidth - (paddingLeft + paddingRight);
    const columnGap = this.templateConfig.style?.columnGap || 20;
    const totalGapWidth = columnGap * (columnCount - 1);
    const contentWidth = availableWidth - totalGapWidth;

    const columnWidths = this.templateConfig.style?.columnWidths;

    if (columnWidths && columnWidths.length === columnCount) {
      // Calculate width based on ratio
      const totalRatio = columnWidths.reduce((sum, w) => sum + w, 0);
      const columnRatio = columnWidths[columnIndex];
      return (contentWidth * columnRatio) / totalRatio;
    } else {
      // Equal widths (default)
      return contentWidth / columnCount;
    }
  }

  /**
   * Get margins for content type
   */
  private getMargins(contentType: 'experience' | 'education' | 'skills'): { top?: number; bottom?: number } {
    const style = this.templateConfig.style;

    // Try new spacing config first
    const spacingMap = {
      experience: style?.spacing?.experience,
      education: style?.spacing?.education,
      skills: style?.spacing?.skills
    };

    let spacing = spacingMap[contentType];

    // Fallback to legacy config
    if (!spacing && style?.spaces) {
      const legacyMap = {
        experience: style.spaces.work,
        education: style.spaces.education,
        skills: style.spaces.skills
      };
      spacing = legacyMap[contentType];
    }

    return {
      top: spacing?.marginTop,
      bottom: spacing?.marginBottom
    };
  }

  /**
   * Remove content by ID
   */
  removeContent(contentId: string): void {
    const component = this.placedComponents.get(contentId);
    if (component) {
      component.remove();
      this.placedComponents.delete(contentId);
    }
  }

  /**
   * Get number of pages
   */
  getPageCount(): number {
    return this.pages.length;
  }

  /**
   * Get all pages
   */
  getPages(): HTMLElement[] {
    return [...this.pages];
  }

  /**
   * Get current page index
   */
  getCurrentPageIndex(): number {
    return this.currentPageIndex;
  }

  /**
   * Get remaining space on current page
   */
  getRemainingSpace(columnIndex: number = 0): number {
    const pageCalculators = this.pageCalculators.get(this.currentPageIndex);
    if (pageCalculators && pageCalculators[columnIndex]) {
      return pageCalculators[columnIndex].calculateRemainingSpace();
    }
    return 0;
  }

  /**
   * Get space breakdown for current page
   */
  getSpaceBreakdown(columnIndex: number = 0) {
    const pageCalculators = this.pageCalculators.get(this.currentPageIndex);
    if (pageCalculators && pageCalculators[columnIndex]) {
      return pageCalculators[columnIndex].getBreakdown();
    }
    return null;
  }

  /**
   * Reset the engine - clear all pages and start fresh
   */
  reset(): void {
    // Remove all pages from DOM
    this.pages.forEach(page => page.remove());

    // Clear tracking
    this.pages = [];
    this.placedComponents.clear();
    this.pageCalculators.clear();
    this.currentPageIndex = 0;

    // Create first page
    this.createNewPage();
  }

  /**
   * Destroy the engine - cleanup resources
   */
  destroy(): void {
    // Remove all pages
    this.pages.forEach(page => page.remove());

    // Cleanup measurement service
    this.measurementService.cleanup();

    // Clear all tracking
    this.pages = [];
    this.placedComponents.clear();
    this.pageCalculators.clear();
  }
}

