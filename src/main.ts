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
async function initApp() {
  // Initialize editor
  const editor = new RealtimeResumeEditor('resume-pages-container', templateConfig);

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


  const wor8: Position = {
    _id: 'work-8',
    title: 'Full Stack Developer',
    company: 'Tech Corp',
    startDate: '2020-01',
    endDate: '2023-12',
    intro: 'Led development of scalable systems',
    description: [
      'Built REST API serving 1M+ requests/day',
      'Improved performance by 50%',
      'Led team of 5 developers',
      'Built REST API serving 1M+ requests/day',
    ]
  };

  const wor9: Position = {
    _id: 'work-9',
    title: 'Software Engineer',
    company: 'Tech Corp',
    startDate: '2020-01',
    endDate: '2023-12',
    intro: 'Led development of scalable systems',
    description: [
      
    ]
  };

  const wor10: Position = {
    _id: 'work-10',
    title: 'Software Engineer',
    company: 'Tech Corp',
    startDate: '2020-01',
    endDate: '2023-12',
    intro: 'Led development of scalable systems',
    description: [
      'Improved performance by 50%',
      'Led team of 5 developers'
    ]
  };

  const wor11: Position = {
    _id: 'work-11',
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
  // Add experience sequentially to ensure proper page tracking
  await editor.onExperienceAdded(wor1);
  await editor.onExperienceAdded(wor2);
  await editor.onExperienceAdded(wor11);
  await editor.onExperienceAdded(wor10);
  await editor.onExperienceAdded(wor9);
  await editor.onExperienceAdded(wor8);


  return editor;
}

// Initialize when DOM is ready
let editor: RealtimeResumeEditor | undefined;
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', async () => {
    editor = await initApp();
  });
} else {
  // DOM is already ready
  initApp().then(e => { editor = e; });
}

// Export for use in other modules
export { editor, templateConfig };
