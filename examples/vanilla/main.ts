import type { Position } from '../../lib';
import { ResumeLayoutEngine } from '../../lib';

/**
 * Vanilla JS Example - Resume Layout Engine
 */

// Sample resume data
const sampleExperiences: Position[] = [
  {
    _id: 'work-1',
    title: 'Senior Software Engineer',
    company: 'Tech Corp',
    startDate: '2020-01',
    endDate: '2023-12',
    intro: 'Led development of scalable cloud-based systems and microservices architecture',
    description: [
      'Built REST API serving 1M+ requests/day with 99.9% uptime',
      'Improved application performance by 50% through optimization',
      'Led team of 5 developers in agile environment',
      'Implemented CI/CD pipeline reducing deployment time by 70%'
    ]
  },
  {
    _id: 'work-2',
    title: 'Software Engineer',
    company: 'StartupXYZ',
    startDate: '2018-06',
    endDate: '2019-12',
    intro: 'Full-stack development for e-commerce platform',
    description: [
      'Developed React-based frontend with TypeScript',
      'Built Node.js backend with PostgreSQL database',
      'Integrated payment processing with Stripe API',
      'Implemented real-time notifications using WebSockets'
    ]
  },
  {
    _id: 'work-3',
    title: 'Junior Developer',
    company: 'Digital Agency',
    startDate: '2016-01',
    endDate: '2018-05',
    intro: 'Web development for client projects',
    description: [
      'Created responsive websites using HTML, CSS, JavaScript',
      'Worked with WordPress and custom CMS solutions',
      'Collaborated with designers to implement pixel-perfect UIs',
      'Maintained and updated existing client websites'
    ]
  },
  {
    _id: 'work-4',
    title: 'Frontend Developer Intern',
    company: 'Innovation Labs',
    startDate: '2015-06',
    endDate: '2015-12',
    intro: 'Internship focused on modern web technologies',
    description: [
      'Learned React and modern JavaScript frameworks',
      'Built interactive data visualizations with D3.js',
      'Participated in code reviews and team meetings'
    ]
  }
];

// Initialize the layout engine
async function initApp() {
  const engine = new ResumeLayoutEngine({
    container: '#resume-pages-container',
    page: {
      height: 1123, // A4 at 96 DPI
      marginTop: 20,
      marginBottom: 20,
      header: { height: 50 },
      footer: { height: 30 }
    },
    template: {
      style: {
        fontFamily: 'Arial, sans-serif',
        fontSize: '12px',
        lineHeight: 1.5,
        spaces: {
          work: {
            marginTop: 10,
            marginBottom: 0,
            intro: { marginTop: 5 },
            statements: {
              list: { marginTop: 5 },
              item: { marginTop: 3 }
            }
          }
        }
      }
    },
    events: {
      onPageCreated: (pageIndex) => {
        console.log(`Page ${pageIndex + 1} created`);
        updateStats(engine);
      },
      onContentPlaced: (result) => {
        console.log('Content placed:', result);
        updateStats(engine);
      },
      onOverflow: (contentType, required, available) => {
        console.log(`Overflow: ${contentType} needs ${required}px, only ${available}px available`);
      },
      onError: (error) => {
        console.error('Layout error:', error);
      }
    }
  });

  // Add experiences sequentially
  for (const experience of sampleExperiences) {
    await engine.addExperience(experience);
  }

  // Initial stats update
  updateStats(engine);

  return engine;
}

// Update stats display
function updateStats(engine: ResumeLayoutEngine) {
  const pageCount = engine.getPageCount();
  const remainingSpace = engine.getRemainingSpace();
  
  // Update page count
  const pageCountEl = document.getElementById('page-count');
  if (pageCountEl) {
    pageCountEl.textContent = pageCount.toString();
  }
  
  // Update remaining space
  const remainingSpaceEl = document.getElementById('remaining-space');
  if (remainingSpaceEl) {
    remainingSpaceEl.textContent = `${remainingSpace}px`;
    
    // Color code based on remaining space
    remainingSpaceEl.classList.remove('low', 'medium', 'high');
    if (remainingSpace < 100) {
      remainingSpaceEl.classList.add('low');
    } else if (remainingSpace < 300) {
      remainingSpaceEl.classList.add('medium');
    } else {
      remainingSpaceEl.classList.add('high');
    }
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initApp();
  });
} else {
  initApp();
}

