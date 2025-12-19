import type { SplitGuidelines } from '../types/config';
import type { BaseSplitter } from './base/BaseSplitter';
import { PositionSplitter } from './position/PositionSplitter';

/**
 * Splitter Factory - Routes to appropriate splitter based on contentType
 */
export class SplitterFactory {
  private splitters: Map<string, BaseSplitter> = new Map();
  
  constructor(guidelines?: SplitGuidelines) {
    // Register all splitters
    const positionSplitter = new PositionSplitter(guidelines);
    
    this.register('experience', positionSplitter);
    this.register('education', positionSplitter);
    // Add more as needed:
    // this.register('skills', new SkillsSplitter(guidelines));
  }
  
  register(contentType: string, splitter: BaseSplitter): void {
    this.splitters.set(contentType, splitter);
  }
  
  getSplitter(contentType: string): BaseSplitter {
    const splitter = this.splitters.get(contentType);
    if (!splitter) {
      throw new Error(`No splitter found for contentType: ${contentType}`);
    }
    return splitter;
  }
  
  /**
   * Main entry point - splits any section type
   */
  async split(options: Parameters<BaseSplitter['split']>[0]): Promise<ReturnType<BaseSplitter['split']>> {
    const splitter = this.getSplitter(options.contentType);
    return splitter.split(options);
  }
}

