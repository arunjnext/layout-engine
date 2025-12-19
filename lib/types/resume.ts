/**
 * Resume data types
 */

export interface Position {
  _id: string;
  title: string;
  company: string;
  startDate?: string;
  endDate?: string;
  intro?: string;
  description: string[];
  /** Internal: Indicates this is a partial/split position */
  _isPartial?: boolean;
  /** Internal: Indicates this is a continuation of a split position */
  _splitContinuation?: boolean;
  /** Internal: Split indexes for tracking split boundaries */
  _splitIndexes?: {
    introLineStartIndex?: number;
    introLineEndIndex?: number;
    statementsStartIndex?: number;
    statementsEndIndex?: number;
  };
}

export interface Skill {
  _id: string;
  name: string;
  category?: string;
}

export interface Education {
  _id: string;
  degree: string;
  institution: string;
  year?: string;
  description?: string[];
  /** Internal: Indicates this is a partial/split education entry */
  _isPartial?: boolean;
  /** Internal: Indicates this is a continuation of a split education entry */
  _splitContinuation?: boolean;
  /** Internal: Split indexes for tracking split boundaries */
  _splitIndexes?: {
    statementsStartIndex?: number;
    statementsEndIndex?: number;
  };
}

export interface ResumeData {
  work?: Position[];
  education?: Education[];
  skills?: Skill[];
  summary?: string;
  [key: string]: any;
}

export interface AccomplishmentLines {
  intro: string[];
  statements: string[][];
}

export interface SplitIndexes {
  currentPage: {
    primary: Record<string, any>;
    secondary: Record<string, any>;
  };
  nextPage: {
    primary: Record<string, any>;
    secondary: Record<string, any>;
  };
}

