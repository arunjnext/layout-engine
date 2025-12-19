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
   */
  async addExperience(position: Position): Promise<PlacementResult> {
    try {
      const result = await this.engine.addExperience(position);
      return result;
    } catch (error) {
      this.config.events?.onError?.(error as Error);
      throw error;
    }
  }

  /**
   * Add education to the resume
   */
  async addEducation(education: Education): Promise<PlacementResult> {
    try {
      const result = await this.engine.addEducation(education);
      return result;
    } catch (error) {
      this.config.events?.onError?.(error as Error);
      throw error;
    }
  }

  /**
   * Add skills section to the resume
   */
  async addSkills(skills: Skill[]): Promise<PlacementResult> {
    try {
      const result = await this.engine.addSkills(skills);
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
   */
  getRemainingSpace(): number {
    return this.engine.getRemainingSpace();
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

