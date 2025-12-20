import type { TemplateConfig } from '../types';
import type { Position } from '../types/resume';
import { SpaceCalculator } from '../utils/spaceCalculator';
import { RealtimeLayoutEngine } from './RealtimeLayoutEngine';

/**
 * Real-time Resume Editor - User-facing API
 */
export class RealtimeResumeEditor {
  private layoutEngine: RealtimeLayoutEngine;

  constructor(pagesContainerId: string, templateConfig: TemplateConfig) {
    const initialSpaceCalculator = new SpaceCalculator({
      pageHeight: 1123,
      headerHeight: 50,
      footerHeight: 30,
      marginTop: 20,
      marginBottom: 20
    });

    this.layoutEngine = new RealtimeLayoutEngine(
      pagesContainerId,
      initialSpaceCalculator,
      templateConfig
    );
  }

  async onExperienceAdded(position: Position, columnIndex: number = 0): Promise<void> {
    try {
      const result = await this.layoutEngine.addExperience(position, columnIndex);

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

  async onExperienceUpdated(positionId: string, position: Position): Promise<void> {
    this.layoutEngine.removeExperience(positionId);
    await this.onExperienceAdded(position);
  }

  getRemainingSpace(): number {
    return this.layoutEngine.getCurrentPageRemainingSpace();
  }

  getSpaceBreakdown() {
    return this.layoutEngine.getCurrentPageSpaceBreakdown();
  }

  private updateRemainingSpaceDisplay(remaining: number): void {
    const currentPage = this.layoutEngine.getCurrentPageIndex() + 1;
    const totalPages = this.layoutEngine.getPageCount();

    const display = document.getElementById('remaining-space-display');
    if (display) {
      display.textContent = `Page ${currentPage}/${totalPages} - Remaining: ${remaining}px`;

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