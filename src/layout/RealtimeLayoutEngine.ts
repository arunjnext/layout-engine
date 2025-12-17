import { MeasurementService } from '../services/measurement/MeasurementService';
import { ComponentFactory } from '../services/rendering';
import type { ComponentMeasurement, PlacementResult, TemplateConfig } from '../types';
import type { Position } from '../types/resume';
import { SpaceCalculator } from '../utils/spaceCalculator';

/**
 * Real-time Layout Engine - Handles component → measurement → placement
 */
export class RealtimeLayoutEngine {
  private componentFactory: ComponentFactory;
  private measurementService: MeasurementService;
  private spaceCalculator: SpaceCalculator;
  private pagesContainer: HTMLElement;
  private pages: HTMLElement[] = [];
  private currentPageIndex: number = 0;
  private templateConfig: TemplateConfig;
  private placedComponents: Map<string, HTMLElement> = new Map();
  private pageCalculators: Map<number, SpaceCalculator> = new Map();
  
  constructor(
    pagesContainerId: string,
    spaceCalculator: SpaceCalculator,
    templateConfig: TemplateConfig
  ) {
    this.componentFactory = new ComponentFactory();
    this.measurementService = new MeasurementService();
    this.spaceCalculator = spaceCalculator;
    this.templateConfig = templateConfig;
    
    // Get pages container element with error handling
    const pagesContainerElement = document.getElementById(pagesContainerId);
    if (!pagesContainerElement) {
      throw new Error(
        `Pages container element with id "${pagesContainerId}" not found. ` +
        `Make sure the element exists in the DOM before initializing RealtimeLayoutEngine.`
      );
    }
    this.pagesContainer = pagesContainerElement;
    
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
    const pageCalculator = new SpaceCalculator({
      pageHeight: 1123, // A4 at 96 DPI
      headerHeight: 50,
      footerHeight: 30,
      marginTop: 20,
      marginBottom: 20
    });
    this.pageCalculators.set(this.pages.length - 1, pageCalculator);
    
    // Update current page index
    this.currentPageIndex = this.pages.length - 1;
    
    // Update main space calculator to match new page
    this.spaceCalculator = pageCalculator;
    
    return page;
  }
  
  /**
   * Get current page container
   */
  private getCurrentPage(): HTMLElement {
    return this.pages[this.currentPageIndex];
  }
  
  /**
   * Main entry point: User adds/updates experience
   */
  async addExperience(position: Position): Promise<PlacementResult> {
    // Step 1: Create component
    const component = this.componentFactory.createPositionComponent(position);
    
    // Step 2: Measure component
    const measurement = this.measurementService.measureComponent(
      component,
      this.templateConfig
    );
    
    // Step 3: Ensure we're using the correct page's calculator
    const currentPageCalculator = this.pageCalculators.get(this.currentPageIndex);
    if (currentPageCalculator) {
      this.spaceCalculator = currentPageCalculator;
    }
    
    // Step 4: Check available space on current page
    const remainingSpace = this.spaceCalculator.calculateRemainingSpace();
    
    // Step 5: Decide if it fits
    const margins = this.getMarginsForPosition(position);
    const requiredSpace = measurement.totalHeight + 
                         (margins.top || 0) + 
                         (margins.bottom || 0);
    
    if (requiredSpace <= remainingSpace) {
      return await this.placeComponent(component, measurement, margins);
    } else {
      return await this.handleOverflow(component, position, measurement, remainingSpace, margins);
    }
  }
  
  private async placeComponent(
    component: HTMLElement,
    measurement: ComponentMeasurement,
    margins: { top?: number; bottom?: number }
  ): Promise<PlacementResult> {
    const currentPage = this.getCurrentPage();
    
    // Ensure we're using the correct page's calculator
    const currentPageCalculator = this.pageCalculators.get(this.currentPageIndex);
    if (currentPageCalculator) {
      this.spaceCalculator = currentPageCalculator;
    }
    
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
    const positionId = component.dataset.positionId!;
    this.placedComponents.set(positionId, component);
    
    // Update space calculator for current page
    this.spaceCalculator.placeContent(
      `work-${positionId}`,
      measurement.totalHeight,
      margins
    );
    
    const newRemainingSpace = this.spaceCalculator.calculateRemainingSpace();
    
    return {
      success: true,
      placed: true,
      component,
      usedHeight: measurement.totalHeight,
      remainingSpace: newRemainingSpace
    };
  }
  
  private async handleOverflow(
    component: HTMLElement,
    _position: Position,
    measurement: ComponentMeasurement,
    _remainingSpace: number,
    margins: { top?: number; bottom?: number }
  ): Promise<PlacementResult> {
    // Create new page first
    this.createNewPage();
    
    // Get the new page's remaining space (should be full page minus fixed elements)
    const newPageRemainingSpace = this.spaceCalculator.calculateRemainingSpace();
    const requiredSpace = measurement.totalHeight + 
                         (margins.top || 0) + 
                         (margins.bottom || 0);
    
    // Verify it fits on the new page (it should, since it's a fresh page)
    // But check anyway to be safe
    if (requiredSpace <= newPageRemainingSpace) {
      return await this.placeComponent(component, measurement, margins);
    } else {
      // This shouldn't happen for normal content, but handle it
      console.warn(`Position too large for new page. Required: ${requiredSpace}px, Available: ${newPageRemainingSpace}px`);
      // Place it anyway (it will overflow, but at least it's visible)
      return await this.placeComponent(component, measurement, margins);
    }
  }
  
  private getMarginsForPosition(_position: Position): { top?: number; bottom?: number } {
    const config = this.templateConfig.style.spaces?.work || {};
    return {
      top: config.marginTop,
      bottom: config.marginBottom
    };
  }
  
  removeExperience(positionId: string): void {
    const component = this.placedComponents.get(positionId);
    if (component) {
      component.remove();
      this.placedComponents.delete(positionId);
    }
  }
  
  /**
   * Get number of pages
   */
  getPageCount(): number {
    return this.pages.length;
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
  getCurrentPageRemainingSpace(): number {
    const currentPageCalculator = this.pageCalculators.get(this.currentPageIndex);
    if (currentPageCalculator) {
      return currentPageCalculator.calculateRemainingSpace();
    }
    return 0;
  }

  /**
   * Get space breakdown for current page
   */
  getCurrentPageSpaceBreakdown() {
    const currentPageCalculator = this.pageCalculators.get(this.currentPageIndex);
    if (currentPageCalculator) {
      return currentPageCalculator.getBreakdown();
    }
    return null;
  }
}
