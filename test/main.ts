import type { Position } from 'resume-layout-engine';
import { ResumeLayoutEngine } from 'resume-layout-engine';
import { testScenarios } from './test-scenarios';

let engine: ResumeLayoutEngine | null = null;

// Initialize engine
function initEngine() {
  const container = document.getElementById('resume-container');
  if (!container) throw new Error('Container not found');
  
  container.innerHTML = ''; // Clear previous
  
  engine = new ResumeLayoutEngine({
    container,
    page: {
      height: 1123, // A4 at 96 DPI
      marginTop: 20,
      marginBottom: 20,
      header: { height: 10 },
      footer: { height: 10 },
    },
    template: {
      style: {
        fontFamily: 'Arial, sans-serif',
        fontSize: '12px',
        lineHeight: 1.5,
        spacing: {
          experience: {
            marginTop: 10,
            marginBottom: 0,
            intro: { marginTop: 5 },
            statements: {
              list: { marginTop: 5 },
              item: { marginTop: 3 },
            },
          },
          education: {
            marginTop: 10,
            marginBottom: 0,
            statements: {
              list: { marginTop: 5 },
              item: { marginTop: 3 },
            },
          },
        },
      },
    },
    splitGuidelines: {
      minSplitPercentage: 0.3,
      minRemainingSpace: 100,
      preferStatementSplits: true,
      enableSmartSplitting: true,
    },
    events: {
      onPageCreated: (pageIndex, pageElement) => {
        console.log(`Page ${pageIndex + 1} created`);
        updateInfo(`✅ Page ${pageIndex + 1} created`);
      },
      onContentPlaced: (result) => {
        console.log('Content placed:', result);
        if (result.split) {
          updateInfo(`✂️ Content split! Used: ${result.usedHeight}px, Remaining: ${result.remainingSpace}px`);
        } else {
          updateInfo(`✓ Content placed on page ${(result.pageIndex || 0) + 1}. Remaining: ${result.remainingSpace}px`);
        }
      },
      onOverflow: (contentType, required, available) => {
        console.warn(`Overflow: ${contentType} needs ${required}px, only ${available}px available`);
        updateInfo(`⚠️ Overflow: ${contentType} needs ${required}px, only ${available}px available`);
      },
    },
  });
  
  return engine;
}

function updateInfo(message: string) {
  const infoContent = document.getElementById('info-content');
  if (infoContent) {
    const timestamp = new Date().toLocaleTimeString();
    const div = document.createElement('div');
    div.textContent = `[${timestamp}] ${message}`;
    infoContent.appendChild(div);
    infoContent.scrollTop = infoContent.scrollHeight;
  }
}

// Test buttons
document.getElementById('test-smart-split')?.addEventListener('click', async () => {
  engine = initEngine();
  updateInfo('🧪 Testing smart split with large experience entry...');
    const largePositions = testScenarios.largePosition()
    const getSmallPositions = testScenarios.smallPosition();
    const getLargeEducation = testScenarios.largeEducation();   
    await engine.addExperience(largePositions);
    await engine.addEducation(getLargeEducation);
    await engine.addExperience(getSmallPositions);
    await engine.addExperience(getSmallPositions);
    await engine.addExperience(largePositions);
    await engine.addExperience(largePositions);
  const pageCount = engine.getPageCount();
  updateInfo(`✅ Test complete! Total pages: ${pageCount}`);
});

document.getElementById('test-whole-move')?.addEventListener('click', async () => {
  engine = initEngine();
  updateInfo('🧪 Testing whole block move (filling page first, then adding new entry)...');
  
  // Fill page with content first
  for (let i = 0; i < 11; i++) {
    await engine.addExperience({
      _id: `fill-${i}`,
      title: `Position ${i + 1}`,
      company: 'Company',
      startDate: '2020-01',
      endDate: '2021-12',
      description: [`Task 1 for position ${i + 1}`, `Task 2 for position ${i + 1}`, `Task 3 for position ${i + 1}`],
    });
  }
  
  // Now add one that should move entirely
  await engine.addExperience({
    _id: 'move-test',
    title: 'New Position',
    company: 'New Company',
    startDate: '2022-01',
    endDate: '2023-12',
    description: ['This should move to next page entirely'],
  });
  
  const pageCount = engine.getPageCount();
  updateInfo(`✅ Test complete! Total pages: ${pageCount}`);
});

document.getElementById('test-multiple')?.addEventListener('click', async () => {
  engine = initEngine();
  updateInfo('🧪 Testing multiple positions with smart splitting...');
  
  const positions: Position[] = [
    {
      _id: 'multi-1',
      title: 'Senior Engineer',
      company: 'Company A',
      startDate: '2020-01',
      endDate: '2022-12',
      description: Array(8).fill(0).map((_, i) => `Task ${i + 1} for position 1: Detailed description of accomplishment`),
    },
    {
      _id: 'multi-2',
      title: 'Lead Developer',
      company: 'Company B',
      startDate: '2018-01',
      endDate: '2020-12',
      description: Array(6).fill(0).map((_, i) => `Task ${i + 1} for position 2: Another detailed accomplishment`),
    },
  ];
  
  for (const position of positions) {
    await engine.addExperience(position);
  }
  
  const pageCount = engine.getPageCount();
  updateInfo(`✅ Test complete! Total pages: ${pageCount}`);
});

document.getElementById('test-education')?.addEventListener('click', async () => {
  engine = initEngine();
  updateInfo('🧪 Testing education smart splitting...');
  
  const education = testScenarios.largeEducation();
  await engine.addEducation(education);
  
  const pageCount = engine.getPageCount();
  updateInfo(`✅ Education test complete! Total pages: ${pageCount}`);
});

document.getElementById('test-small-fit')?.addEventListener('click', async () => {
  engine = initEngine();
  updateInfo('🧪 Testing small entry that should fit entirely...');
  
  const smallPosition = testScenarios.smallPosition();
  await engine.addExperience(smallPosition);
  
  const remainingSpace = engine.getRemainingSpace();
  const pageCount = engine.getPageCount();
  updateInfo(`✅ Small entry test complete! Pages: ${pageCount}, Remaining space: ${remainingSpace}px`);
});

document.getElementById('clear')?.addEventListener('click', () => {
  if (engine) {
    engine.reset();
  }
  const container = document.getElementById('resume-container');
  if (container) container.innerHTML = '';
  const infoContent = document.getElementById('info-content');
  if (infoContent) infoContent.innerHTML = 'Cleared. Click a test button to start.';
});

// Initialize on load
initEngine();

