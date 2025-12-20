import type { LayoutEngineConfig, PlacementResult, SpaceBreakdown } from '../types';
import type { Education, Position, Skill } from '../types/resume';
import { resolveContainer } from '../utils/domHelpers';
import { LayoutEngine } from './LayoutEngine';

/**
 * Resume Layout Engine - Headless layout engine for resume page splitting
 * 
 * This is the main public API for the library. It provides a clean, framework-agnostic
 * interface for automatic page splitting and layout management.
 * 
 * @example
 * ```typescript
 * const engine = new ResumeLayoutEngine({
 *   container: '#resume-container',
 *   template: {
 *     style: {
 *       fontFamily: 'Arial, sans-serif',
 *       fontSize: '12px'
 *     }
 *   }
 * });
 * 
 * await engine.addExperience({
 *   _id: 'work-1',
 *   title: 'Software Engineer',
 *   company: 'Tech Corp',
 *   description: ['Built APIs', 'Led team']
 * });
 * ```
 */
export class ResumeLayoutEngine {
  private engine: LayoutEngine;
  private config: LayoutEngineConfig;

  constructor(config: LayoutEngineConfig) {
    this.config = config;

    // Resolve container
    const container = resolveContainer(config.container);

    // Set default page config
    const pageConfig = {
      pageHeight: config.page?.height || 1123, // A4 at 96 DPI
      width: config.page?.width,
      padding: config.page?.padding,
      headerHeight: config.page?.header?.height || 50,
      footerHeight: config.page?.footer?.height || 30,
      marginTop: config.page?.marginTop || 20,
      marginBottom: config.page?.marginBottom || 20
    };

    // Set default template config
    const templateConfig = config.template || {
      style: {
        fontFamily: 'Arial, sans-serif',
        fontSize: '12px',
        lineHeight: 1.5
      }
    };

    // Create internal engine
    this.engine = new LayoutEngine(
      container,
      pageConfig,
      templateConfig,
      config.events,
      config.splitGuidelines
    );
  }

  /**
   * Add work experience to the resume
   * @param position - The position/experience data to add
   * @param columnIndex - The column index to place the content in (0-based, default: 0)
   * @example
   * ```typescript
   * // Single column layout
   * await engine.addExperience(position);
   *
   * // Multi-column layout - add to left column
   * await engine.addExperience(position, 0);
   *
   * // Multi-column layout - add to right column
   * await engine.addExperience(position, 1);
   * ```
   */
  async addExperience(position: Position, columnIndex: number = 0): Promise<PlacementResult> {
    try {
      const result = await this.engine.addExperience(position, columnIndex);
      return result;
    } catch (error) {
      this.config.events?.onError?.(error as Error);
      throw error;
    }
  }

  /**
   * Add education to the resume
   * @param education - The education data to add
   * @param columnIndex - The column index to place the content in (0-based, default: 0)
   * @example
   * ```typescript
   * // Single column layout
   * await engine.addEducation(education);
   *
   * // Multi-column layout - add to left column
   * await engine.addEducation(education, 0);
   *
   * // Multi-column layout - add to right column
   * await engine.addEducation(education, 1);
   * ```
   */
  async addEducation(education: Education, columnIndex: number = 0): Promise<PlacementResult> {
    try {
      const result = await this.engine.addEducation(education, columnIndex);
      return result;
    } catch (error) {
      this.config.events?.onError?.(error as Error);
      throw error;
    }
  }

  /**
   * Add skills section to the resume
   * @param skills - The skills array to add
   * @param columnIndex - The column index to place the content in (0-based, default: 0)
   * @example
   * ```typescript
   * // Single column layout
   * await engine.addSkills(skills);
   *
   * // Multi-column layout - add to left column
   * await engine.addSkills(skills, 0);
   *
   * // Multi-column layout - add to right column
   * await engine.addSkills(skills, 1);
   * ```
   */
  async addSkills(skills: Skill[], columnIndex: number = 0): Promise<PlacementResult> {
    try {
      const result = await this.engine.addSkills(skills, columnIndex);
      return result;
    } catch (error) {
      this.config.events?.onError?.(error as Error);
      throw error;
    }
  }

  /**
   * Update an existing experience
   */
  async updateExperience(positionId: string, position: Position): Promise<PlacementResult> {
    this.removeExperience(positionId);
    return await this.addExperience(position);
  }

  /**
   * Update an existing education entry
   */
  async updateEducation(educationId: string, education: Education): Promise<PlacementResult> {
    this.removeEducation(educationId);
    return await this.addEducation(education);
  }

  /**
   * Remove experience by ID
   */
  removeExperience(positionId: string): void {
    this.engine.removeContent(positionId);
  }

  /**
   * Remove education by ID
   */
  removeEducation(educationId: string): void {
    this.engine.removeContent(educationId);
  }

  /**
   * Get remaining space on current page
   * @param columnIndex - The column index to check (0-based, default: 0)
   * @example
   * ```typescript
   * // Single column layout
   * const space = engine.getRemainingSpace();
   *
   * // Multi-column layout - check left column
   * const spaceCol0 = engine.getRemainingSpace(0);
   *
   * // Multi-column layout - check right column
   * const spaceCol1 = engine.getRemainingSpace(1);
   * ```
   */
  getRemainingSpace(columnIndex: number = 0): number {
    return this.engine.getRemainingSpace(columnIndex);
  }

  /**
   * Get total number of pages
   */
  getPageCount(): number {
    return this.engine.getPageCount();
  }

  /**
   * Get all page elements
   */
  getPages(): HTMLElement[] {
    return this.engine.getPages();
  }

  /**
   * Get current page index (0-based)
   */
  getCurrentPageIndex(): number {
    return this.engine.getCurrentPageIndex();
  }

  /**
   * Get detailed space breakdown for current page
   */
  getSpaceBreakdown(): SpaceBreakdown | null {
    return this.engine.getSpaceBreakdown();
  }

  /**
   * Reset the engine - clear all pages and start fresh
   */
  reset(): void {
    this.engine.reset();
  }

  /**
   * Destroy the engine - cleanup all resources
   * Call this when you're done with the engine to prevent memory leaks
   */
  destroy(): void {
    this.engine.destroy();
  }
}

