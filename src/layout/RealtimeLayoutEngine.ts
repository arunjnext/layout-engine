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
  private contentArea: HTMLElement;
  private templateConfig: TemplateConfig;
  private placedComponents: Map<string, HTMLElement> = new Map();
  
  constructor(
    contentAreaId: string,
    spaceCalculator: SpaceCalculator,
    templateConfig: TemplateConfig
  ) {
    this.componentFactory = new ComponentFactory();
    this.measurementService = new MeasurementService();
    this.spaceCalculator = spaceCalculator;
    
    // Get content area element with error handling
    const contentAreaElement = document.getElementById(contentAreaId);
    if (!contentAreaElement) {
      throw new Error(
        `Content area element with id "${contentAreaId}" not found. ` +
        `Make sure the element exists in the DOM before initializing RealtimeLayoutEngine.`
      );
    }
    this.contentArea = contentAreaElement;
    this.templateConfig = templateConfig;
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
    
    // Step 3: Check available space
    const remainingSpace = this.spaceCalculator.calculateRemainingSpace();
    
    // Step 4: Decide if it fits
    const margins = this.getMarginsForPosition(position);
    const requiredSpace = measurement.totalHeight + 
                         (margins.top || 0) + 
                         (margins.bottom || 0);
    
    if (requiredSpace <= remainingSpace) {
      return await this.placeComponent(component, measurement, margins);
    } else {
      return await this.handleOverflow(component, measurement, remainingSpace);
    }
  }
  
  private async placeComponent(
    component: HTMLElement,
    measurement: ComponentMeasurement,
    margins: { top?: number; bottom?: number }
  ): Promise<PlacementResult> {
    // Apply margins
    if (margins.top) {
      component.style.marginTop = `${margins.top}px`;
    }
    if (margins.bottom) {
      component.style.marginBottom = `${margins.bottom}px`;
    }
    
    // Append to content area
    this.contentArea.appendChild(component);
    
    // Track it
    const positionId = component.dataset.positionId!;
    this.placedComponents.set(positionId, component);
    
    // Update space calculator
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
    _component: HTMLElement,
    _measurement: ComponentMeasurement,
    remainingSpace: number
  ): Promise<PlacementResult> {
    // Simplified: for now just return that it doesn't fit
    // You'd integrate your split logic here
    return {
      success: false,
      placed: false,
      reason: 'insufficient_space',
      remainingSpace
    };
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
}