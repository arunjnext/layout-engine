import { ComponentFactory } from '../services/ComponentFactory';
import { MeasurementService } from '../services/MeasurementService';
import type { ComponentMeasurement, EventCallbacks, PlacementResult, TemplateConfig } from '../types';
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
  private pageCalculators: Map<number, SpaceCalculator> = new Map();
  private eventCallbacks?: EventCallbacks;
  
  constructor(
    pagesContainer: HTMLElement,
    pageConfig: PageConfig,
    templateConfig: TemplateConfig,
    eventCallbacks?: EventCallbacks
  ) {
    this.componentFactory = new ComponentFactory();
    this.measurementService = new MeasurementService();
    this.pagesContainer = pagesContainer;
    this.pageConfig = pageConfig;
    this.templateConfig = templateConfig;
    this.eventCallbacks = eventCallbacks;
    
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
    
    this.pagesContainer.appendChild(page);
    this.pages.push(page);
    
    // Create new space calculator for this page
    const pageCalculator = new SpaceCalculator(this.pageConfig);
    this.pageCalculators.set(this.pages.length - 1, pageCalculator);
    
    // Update current page index
    this.currentPageIndex = this.pages.length - 1;
    
    // Update main space calculator to match new page
    this.spaceCalculator = pageCalculator;
    
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
   */
  async addExperience(position: Position): Promise<PlacementResult> {
    const component = this.componentFactory.createPositionComponent(position);
    const measurement = this.measurementService.measureComponent(component, this.templateConfig);
    const margins = this.getMargins('experience');

    // Use the measured component (which has styles applied) instead of the original
    return await this.placeContent(measurement.component, measurement, margins, 'experience', position._id);
  }
  
  /**
   * Add education to layout
   */
  async addEducation(education: Education): Promise<PlacementResult> {
    const component = this.componentFactory.createEducationComponent(education);
    const measurement = this.measurementService.measureComponent(component, this.templateConfig);
    const margins = this.getMargins('education');

    // Use the measured component (which has styles applied) instead of the original
    return await this.placeContent(measurement.component, measurement, margins, 'education', education._id);
  }
  
  /**
   * Add skills to layout
   */
  async addSkills(skills: Skill[]): Promise<PlacementResult> {
    const component = this.componentFactory.createSkillsComponent(skills);
    const measurement = this.measurementService.measureComponent(component, this.templateConfig);
    const margins = this.getMargins('skills');

    // Use the measured component (which has styles applied) instead of the original
    return await this.placeContent(measurement.component, measurement, margins, 'skills', 'skills-section');
  }
  
  /**
   * Core placement logic
   */
  private async placeContent(
    component: HTMLElement,
    measurement: ComponentMeasurement,
    margins: { top?: number; bottom?: number },
    contentType: string,
    contentId: string
  ): Promise<PlacementResult> {
    // Ensure we're using the correct page's calculator
    const currentPageCalculator = this.pageCalculators.get(this.currentPageIndex);
    if (currentPageCalculator) {
      this.spaceCalculator = currentPageCalculator;
    }

    // Check available space on current page
    const remainingSpace = this.spaceCalculator.calculateRemainingSpace();
    const requiredSpace = measurement.totalHeight + (margins.top || 0) + (margins.bottom || 0);

    if (requiredSpace <= remainingSpace) {
      return await this.placeComponentOnCurrentPage(component, measurement, margins, contentType, contentId);
    } else {
      return await this.handleOverflow(component, measurement, margins, contentType, contentId, remainingSpace);
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
    contentId: string
  ): Promise<PlacementResult> {
    const currentPage = this.getCurrentPage();

    // Apply margins
    if (margins.top) {
      component.style.marginTop = `${margins.top}px`;
    }
    if (margins.bottom) {
      component.style.marginBottom = `${margins.bottom}px`;
    }

    // Append to current page
    currentPage.appendChild(component);

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
    currentRemainingSpace: number
  ): Promise<PlacementResult> {
    const requiredSpace = measurement.totalHeight + (margins.top || 0) + (margins.bottom || 0);

    // Trigger overflow event
    this.eventCallbacks?.onOverflow?.(contentType, requiredSpace, currentRemainingSpace);

    // Create new page
    this.createNewPage();

    // Get the new page's remaining space
    const newPageRemainingSpace = this.spaceCalculator.calculateRemainingSpace();

    // Verify it fits on the new page
    if (requiredSpace <= newPageRemainingSpace) {
      return await this.placeComponentOnCurrentPage(component, measurement, margins, contentType, contentId);
    } else {
      // Content is too large even for a fresh page
      console.warn(`Content too large for new page. Required: ${requiredSpace}px, Available: ${newPageRemainingSpace}px`);
      // Place it anyway (it will overflow, but at least it's visible)
      return await this.placeComponentOnCurrentPage(component, measurement, margins, contentType, contentId);
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
  getRemainingSpace(): number {
    const currentPageCalculator = this.pageCalculators.get(this.currentPageIndex);
    if (currentPageCalculator) {
      return currentPageCalculator.calculateRemainingSpace();
    }
    return 0;
  }

  /**
   * Get space breakdown for current page
   */
  getSpaceBreakdown() {
    const currentPageCalculator = this.pageCalculators.get(this.currentPageIndex);
    if (currentPageCalculator) {
      return currentPageCalculator.getBreakdown();
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

