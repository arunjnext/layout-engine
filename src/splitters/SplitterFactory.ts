import { AccomplishmentsSplitter } from './accomplishments/AccomplishmentsSplitter';
import type { BaseSplitter, SplitOptions, SplitResult } from './base';

/**
 * Splitter Factory - Routes to appropriate splitter based on contentType
 */
export class SplitterFactory {
  private splitters: Map<string, BaseSplitter> = new Map();
  
  constructor() {
    // Register all splitters
    const accomplishmentsSplitter = new AccomplishmentsSplitter();
    
    this.register('work', accomplishmentsSplitter);
    this.register('education', accomplishmentsSplitter);
    // Add more as needed:
    // this.register('skills', new SkillsSplitter());
    // this.register('summary', new SummarySplitter());
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
  async split(options: SplitOptions): Promise<SplitResult> {
    const splitter = this.getSplitter(options.contentType);
    return splitter.split(options);
  }
}