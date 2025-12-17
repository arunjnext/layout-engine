import type { TemplateConfig } from '../types';
import type { Position } from '../types/resume';
import { SpaceCalculator } from '../utils/spaceCalculator';
import { RealtimeLayoutEngine } from './RealtimeLayoutEngine';

/**
 * Real-time Resume Editor - User-facing API
 */
export class RealtimeResumeEditor {
  private layoutEngine: RealtimeLayoutEngine;
  private spaceCalculator: SpaceCalculator;
  
  constructor(contentAreaId: string, templateConfig: TemplateConfig) {
    // Initialize space calculator
    this.spaceCalculator = new SpaceCalculator({
      pageHeight: 1123, // A4 at 96 DPI
      headerHeight: 50,
      footerHeight: 30,
      marginTop: 20,
      marginBottom: 20
    });
    
    // Initialize layout engine
    this.layoutEngine = new RealtimeLayoutEngine(
      contentAreaId,
      this.spaceCalculator,
      templateConfig
    );
  }
  
  /**
   * User adds new experience
   */
  async onExperienceAdded(position: Position): Promise<void> {
    try {
      const result = await this.layoutEngine.addExperience(position);
      
      if (result.success && result.placed) {
        this.updateRemainingSpaceDisplay(result.remainingSpace);
        
        if (result.split) {
          this.showSplitWarning();
        }
      } else {
        this.showOverflowWarning(result.remainingSpace);
      }
    } catch (error) {
      console.error('Error adding experience:', error);
      this.showError();
    }
  }
  
  /**
   * User updates existing experience
   */
  async onExperienceUpdated(positionId: string, position: Position): Promise<void> {
    this.layoutEngine.removeExperience(positionId);
    await this.onExperienceAdded(position);
  }
  
  /**
   * Get current remaining space
   */
  getRemainingSpace(): number {
    return this.spaceCalculator.calculateRemainingSpace();
  }
  
  /**
   * Get space breakdown for debugging
   */
  getSpaceBreakdown() {
    return this.spaceCalculator.getBreakdown();
  }
  
  private updateRemainingSpaceDisplay(remaining: number): void {
    const display = document.getElementById('remaining-space-display');
    if (display) {
      display.textContent = `Remaining space: ${remaining}px`;
      
      if (remaining < 100) {
        display.style.color = 'red';
      } else if (remaining < 300) {
        display.style.color = 'orange';
      } else {
        display.style.color = 'green';
      }
    }
  }
  
  private showSplitWarning(): void {
    console.warn('Content split across pages');
  }
  
  private showOverflowWarning(remaining: number): void {
    console.warn(`Not enough space. Remaining: ${remaining}px`);
  }
  
  private showError(): void {
    console.error('Error placing content');
  }
}