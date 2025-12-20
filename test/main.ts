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
      width: 793.7, // A4 width at 96 DPI (210mm)
      height: 1123, // A4 height at 96 DPI (297mm)
      padding: {
        top: 75.59,    // 20mm at 96 DPI
        right: 75.59,  // 20mm at 96 DPI
        bottom: 75.59, // 20mm at 96 DPI
        left: 75.59,   // 20mm at 96 DPI
      },
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

// Initialize engine with 2 columns
function initTwoColumnEngine() {
  const container = document.getElementById('resume-container');
  if (!container) throw new Error('Container not found');

  container.innerHTML = ''; // Clear previous

  engine = new ResumeLayoutEngine({
    container,
    page: {
      width: 793.7, // A4 width at 96 DPI (210mm)
      height: 1123, // A4 height at 96 DPI (297mm)
      padding: {
        top: 75.59,    // 20mm at 96 DPI
        right: 75.59,  // 20mm at 96 DPI
        bottom: 75.59, // 20mm at 96 DPI
        left: 75.59,   // 20mm at 96 DPI
      },
      marginTop: 20,
      marginBottom: 20,
      header: { height: 10 },
      footer: { height: 10 },
    },
    template: {
      style: {
        fontFamily: 'Arial, sans-serif',
        columnCount: 2,
        columnGap: 20,
        columnWidths: [1, 1], // 50%/50% ratio

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
          updateInfo(`✓ Content placed on page ${(result.pageIndex || 0) + 1} in column ${result.columnIndex || 0}. Remaining: ${result.remainingSpace}px`);
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

// Initialize engine with 2 columns and custom widths (60%/40%)
function initCustomWidthEngine() {
  const container = document.getElementById('resume-container');
  if (!container) throw new Error('Container not found');

  container.innerHTML = ''; // Clear previous

  engine = new ResumeLayoutEngine({
    container,
    page: {
      width: 793.7, // A4 width at 96 DPI (210mm)
      height: 1123, // A4 height at 96 DPI (297mm)
      padding: {
        top: 75.59,    // 20mm at 96 DPI
        right: 75.59,  // 20mm at 96 DPI
        bottom: 75.59, // 20mm at 96 DPI
        left: 75.59,   // 20mm at 96 DPI
      },
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
        columnCount: 2,
        columnGap: 20,
        columnWidths: [3, 2], // 60%/40% ratio
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
          skills: {
            marginTop: 10,
            marginBottom: 0,
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
          updateInfo(`✓ Content placed on page ${(result.pageIndex || 0) + 1} in column ${result.columnIndex || 0}. Remaining: ${result.remainingSpace}px`);
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

document.getElementById('test-two-columns')?.addEventListener('click', async () => {
  engine = initTwoColumnEngine();
  updateInfo('🧪 Testing 2-column layout (equal widths 50%/50%)...');

  // Add detailed position to Left Column (0)
  const leftPosition = testScenarios.largePosition();
  leftPosition.title = "Left Column Position";
  await engine.addExperience(leftPosition, 0); // Column 0

  // Add another position to Left Column (0)
  const leftPosition2 = testScenarios.smallPosition();
  leftPosition2.title = "Left Column Position 2";
  await engine.addExperience(leftPosition2, 0); // Column 0

  // Add detailed position to Right Column (1)
  const rightPosition = testScenarios.largePosition();
  rightPosition.title = "Right Column Position";
  await engine.addExperience(rightPosition, 1); // Column 1

  // Add education to Right Column (1)
  const education = testScenarios.largeEducation();
  await engine.addEducation(education, 1); // Column 1

  // Add skills to Right Column (1)
  await engine.addSkills([
    { _id: 'skill-1', name: 'JavaScript' },
    { _id: 'skill-2', name: 'TypeScript' },
    { _id: 'skill-3', name: 'React' },
    { _id: 'skill-4', name: 'Node.js' },
  ], 1); // Column 1

  const pageCount = engine.getPageCount();
  const spaceCol0 = engine.getRemainingSpace(0);
  const spaceCol1 = engine.getRemainingSpace(1);
  updateInfo(`✅ 2-column test complete! Pages: ${pageCount}, Col0 space: ${spaceCol0}px, Col1 space: ${spaceCol1}px`);
});

document.getElementById('test-custom-widths')?.addEventListener('click', async () => {
  engine = initCustomWidthEngine();
  updateInfo('🧪 Testing 2-column layout with custom widths (60%/40%)...');

  // Add content to wider left column (60%)
  const leftPosition = testScenarios.largePosition();
  leftPosition.title = "Wide Column Position";
  await engine.addExperience(leftPosition, 0); // Column 0 (60%)

  // Add content to narrower right column (40%)
  const rightPosition = testScenarios.smallPosition();
  rightPosition.title = "Narrow Column Position";
  await engine.addExperience(rightPosition, 1); // Column 1 (40%)

  // Add education to narrow column
  const education = testScenarios.largeEducation();
  await engine.addEducation(education, 1); // Column 1 (40%)

  // Add skills to narrow column
  await engine.addSkills([
    { _id: 'skill-1', name: 'JavaScript' },
    { _id: 'skill-2', name: 'TypeScript' },
    { _id: 'skill-3', name: 'React' },
    { _id: 'skill-4', name: 'Node.js' },
    { _id: 'skill-5', name: 'Python' },
  ], 1); // Column 1 (40%)

  const pageCount = engine.getPageCount();
  const spaceCol0 = engine.getRemainingSpace(0);
  const spaceCol1 = engine.getRemainingSpace(1);
  updateInfo(`✅ Custom widths test complete! Pages: ${pageCount}, Wide col (60%): ${spaceCol0}px, Narrow col (40%): ${spaceCol1}px`);
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

