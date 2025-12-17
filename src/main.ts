import { RealtimeResumeEditor } from './layout/RealtimeResumeEditor';
import type { TemplateConfig } from './types';
import type { Position } from './types/resume';

/**
 * Main entry point
 */

// Template configuration
const templateConfig: TemplateConfig = {
  style: {
    fontFamily: 'Arial, sans-serif',
    fontSize: '12px',
    lineHeight: 1.5,
    heights: {
      statementLineHeight: 20,
      skillRowHeight: 30
    },
    spaces: {
      work: {
        marginTop: 10,
        marginBottom: 0,
        intro: {
          marginTop: 5
        },
        statements: {
          list: {
            marginTop: 5
          },
          item: {
            marginTop: 3
          }
        }
      },
      education: {
        marginTop: 10,
        marginBottom: 0
      },
      skills: {
        marginTop: 10,
        marginBottom: 0
      }
    }
  }
};

// Wait for DOM to be ready
function initApp() {
  // Initialize editor
  const editor = new RealtimeResumeEditor('resume-content-area', templateConfig);

  // Example: User adds experience
  const wor1: Position = {
    _id: 'work-1',
    title: 'Software Engineer',
    company: 'Tech Corp',
    startDate: '2020-01',
    endDate: '2023-12',
    intro: 'Led development of scalable systems',
    description: [
      'Built REST API serving 1M+ requests/day',
      'Improved performance by 50%',
      'Led team of 5 developers'
    ]
  };

  const wor2: Position = {
    _id: 'work-2',
    title: 'Software Engineer',
    company: 'Tech Corp',
    startDate: '2020-01',
    endDate: '2023-12',
    intro: 'Led development of scalable systems',
    description: [
      'Built REST API serving 1M+ requests/day',
      'Improved performance by 50%',
      'Led team of 5 developers'
    ]
  };


  const wor3: Position = {
    _id: 'work-3',
    title: 'Software Engineer',
    company: 'Tech Corp',
    startDate: '2020-01',
    endDate: '2023-12',
    intro: 'Led development of scalable systems',
    description: [
      'Built REST API serving 1M+ requests/day',
      'Improved performance by 50%',
      'Led team of 5 developers'
    ]
  };

  const wor4: Position = {
    _id: 'work-4',
    title: 'Software Engineer',
    company: 'Tech Corp',
    startDate: '2020-01',
    endDate: '2023-12',
    intro: 'Led development of scalable systems',
    description: [
      'Built REST API serving 1M+ requests/day',
      'Improved performance by 50%',
      'Led team of 5 developers'
    ]
  };
  const wor5: Position = {
    _id: 'work-5',
    title: 'Frontend Developer',
    company: 'Tech Corp',
    startDate: '2020-01',
    endDate: '2023-12',
    intro: 'Led development of scalable systems',
    description: [
      'Built REST API serving 1M+ requests/day',
      'Improved performance by 50%',
      'Led team of 5 developers'
    ]
  };
  const wor6: Position = {
    _id: 'work-6',
    title: 'Software Engineer',
    company: 'Tech Corp',
    startDate: '2020-01',
    endDate: '2023-12',
    intro: 'Led development of scalable systems',
    description: [
      'Built REST API serving 1M+ requests/day',
      'Improved performance by 50%',

      'Led team of 5 developers'
    ]
  };

  const wor7: Position = {
    _id: 'work-7',
    title: 'React Developer',
    company: 'Tech Corp',
    startDate: '2020-01',
    endDate: '2023-12',
    intro: 'Led development of scalable systems',
    description: [
      'Built REST API serving 1M+ requests/day',
      'Improved performance by 50%',
      'Led team of 5 developers'
    ]
  };

  // Add experience
  editor.onExperienceAdded(wor1);
  editor.onExperienceAdded(wor2);
  editor.onExperienceAdded(wor3);
  editor.onExperienceAdded(wor4);
  editor.onExperienceAdded(wor5);
  editor.onExperienceAdded(wor6);
  editor.onExperienceAdded(wor7);

  return editor;
}

// Initialize when DOM is ready
let editor: RealtimeResumeEditor;
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    editor = initApp();
  });
} else {
  // DOM is already ready
  editor = initApp();
}

// Export for use in other modules
export { editor, templateConfig };
