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

