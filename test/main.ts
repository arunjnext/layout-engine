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

document.getElementById('test-smart-column-fill')?.addEventListener('click', async () => {
  engine = initTwoColumnEngine();
  updateInfo('🧪 Testing Smart Column Fill - Fill left column first, then add to right column...');

  // Step 1: Fill the left column (column 0) until it's nearly full
  updateInfo('📝 Step 1: Filling left column with large content...');
  const leftPosition1 = testScenarios.largePosition();
  leftPosition1.title = "Left Column - Position 1";
  await engine.addExperience(leftPosition1, 0);

  const leftPosition2 = testScenarios.largePosition();
  leftPosition2.title = "Left Column - Position 2";
  await engine.addExperience(leftPosition2, 0);

  const leftPosition3 = testScenarios.smallPosition();
  leftPosition3.title = "Left Column - Position 3";
  await engine.addExperience(leftPosition3, 0);

  // Check space after filling left column
  const spaceCol0AfterFill = engine.getRemainingSpace(0);
  const spaceCol1AfterFill = engine.getRemainingSpace(1);
  const pagesAfterLeftFill = engine.getPageCount();
  updateInfo(`📊 After filling left: Pages=${pagesAfterLeftFill}, Left space=${spaceCol0AfterFill}px, Right space=${spaceCol1AfterFill}px`);

  // Step 2: Now add content to RIGHT column (column 1)
  // This should fill page 1's right column first (which is still empty)
  // NOT create a new page
  updateInfo('📝 Step 2: Adding content to RIGHT column (should fill page 1 right column)...');

  const rightPosition1 = testScenarios.introOnly();
  rightPosition1.title = "Right Column - Position 1 (Should be on Page 1)";
  const result1 = await engine.addExperience(rightPosition1, 1);
  updateInfo(`✓ Right Position 1 placed on page ${(result1.pageIndex || 0) + 1}, column ${result1.columnIndex}`);

  const rightPosition2 = testScenarios.smallPosition();
  rightPosition2.title = "Right Column - Position 2 (Should be on Page 1)";
  const result2 = await engine.addExperience(rightPosition2, 1);
  updateInfo(`✓ Right Position 2 placed on page ${(result2.pageIndex || 0) + 1}, column ${result2.columnIndex}`);

  // Add education to right column
  const education = testScenarios.largeEducation();
  education.degree = "Right Column Education (Should be on Page 1)";
  const result3 = await engine.addEducation(education, 1);
  updateInfo(`✓ Education placed on page ${(result3.pageIndex || 0) + 1}, column ${result3.columnIndex}`);

  // Final stats
  const finalPages = engine.getPageCount();
  const finalSpaceCol0 = engine.getRemainingSpace(0);
  const finalSpaceCol1 = engine.getRemainingSpace(1);

  updateInfo(`📊 Final: Pages=${finalPages}, Left space=${finalSpaceCol0}px, Right space=${finalSpaceCol1}px`);

  // Verify the behavior
  if (result1.pageIndex === 0 && result2.pageIndex === 0 && result3.pageIndex === 0) {
    updateInfo(`✅ SUCCESS! All right column content correctly placed on page 1 (filled earlier page first)`);
  } else {
    updateInfo(`❌ ISSUE: Some content was placed on wrong page. Check placement above.`);
  }
});

// Orphan Detection Tests
document.getElementById('test-orphan-prevention')?.addEventListener('click', async () => {
  // Initialize engine with orphan detection enabled
  const container = document.getElementById('resume-container');
  if (!container) throw new Error('Container not found');
  container.innerHTML = '';

  engine = new ResumeLayoutEngine({
    container,
    page: {
      width: 793.7,
      height: 1123,
      padding: { top: 75.59, right: 75.59, bottom: 75.59, left: 75.59 },
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
            statements: { list: { marginTop: 5 }, item: { marginTop: 3 } },
          },
        },
      },
    },
    splitGuidelines: {
      enableSmartSplitting: true,
      preventOrphans: true,              // ✅ Orphan detection enabled
      minChildrenToAvoidOrphan: 1,
      cascadeOrphanDetection: true,
    },
    events: {
      onPageCreated: (pageIndex) => updateInfo(`✅ Page ${pageIndex + 1} created`),
      onContentPlaced: (result) => {
        if (result.split) {
          updateInfo(`✂️ Content split! Page ${(result.pageIndex || 0) + 1}`);
        } else {
          updateInfo(`✓ Content placed on page ${(result.pageIndex || 0) + 1}`);
        }
      },
    },
  });

  updateInfo('🛡️ Testing Orphan Prevention (ENABLED)...');
  updateInfo('📝 Scenario: Fill page, then add position that would orphan title');

  // Fill the page with content
  for (let i = 0; i < 10; i++) {
    await engine.addExperience({
      _id: `fill-${i}`,
      title: `Filler Position ${i + 1}`,
      company: 'Company',
      startDate: '2020-01',
      endDate: '2021-12',
      description: [`Task 1`, `Task 2`],
    });
  }

  // Now add the orphan test position
  // This has title + intro + 3 statements
  // If statements don't fit, orphan detection should move entire block
  const orphanTest = testScenarios.orphanTestPosition();
  const result = await engine.addExperience(orphanTest);

  updateInfo(`📊 Result: Position placed on page ${(result.pageIndex || 0) + 1}`);
  updateInfo(`✅ With orphan detection: Title should NOT be alone on previous page`);
  updateInfo(`💡 Check console for orphan detection logs`);
});

document.getElementById('test-orphan-cascade')?.addEventListener('click', async () => {
  const container = document.getElementById('resume-container');
  if (!container) throw new Error('Container not found');
  container.innerHTML = '';

  engine = new ResumeLayoutEngine({
    container,
    page: {
      width: 793.7,
      height: 1123,
      padding: { top: 75.59, right: 75.59, bottom: 75.59, left: 75.59 },
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
            statements: { list: { marginTop: 5 }, item: { marginTop: 3 } },
          },
        },
      },
    },
    splitGuidelines: {
      enableSmartSplitting: true,
      preventOrphans: true,
      minChildrenToAvoidOrphan: 1,
      cascadeOrphanDetection: true,      // ✅ Cascading enabled
    },
    events: {
      onPageCreated: (pageIndex) => updateInfo(`✅ Page ${pageIndex + 1} created`),
      onContentPlaced: (result) => updateInfo(`✓ Placed on page ${(result.pageIndex || 0) + 1}`),
    },
  });

  updateInfo('🔗 Testing Cascading Orphan Detection...');
  updateInfo('📝 Scenario: Position with many statements that triggers cascade');

  // Fill page
  for (let i = 0; i < 9; i++) {
    await engine.addExperience({
      _id: `fill-${i}`,
      title: `Position ${i + 1}`,
      company: 'Company',
      startDate: '2020-01',
      endDate: '2021-12',
      description: [`Task 1`, `Task 2`, `Task 3`],
    });
  }

  // Add position with many statements
  const manyStatements = testScenarios.manyStatementsPosition();
  await engine.addExperience(manyStatements);

  updateInfo(`✅ Cascade test complete! Check that title+intro stay with statements`);
});

document.getElementById('test-orphan-disabled')?.addEventListener('click', async () => {
  const container = document.getElementById('resume-container');
  if (!container) throw new Error('Container not found');
  container.innerHTML = '';

  engine = new ResumeLayoutEngine({
    container,
    page: {
      width: 793.7,
      height: 1123,
      padding: { top: 75.59, right: 75.59, bottom: 75.59, left: 75.59 },
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
            statements: { list: { marginTop: 5 }, item: { marginTop: 3 } },
          },
        },
      },
    },
    splitGuidelines: {
      enableSmartSplitting: true,
      preventOrphans: false,             // ❌ Orphan detection DISABLED
      minChildrenToAvoidOrphan: 1,
      cascadeOrphanDetection: false,
    },
    events: {
      onPageCreated: (pageIndex) => updateInfo(`✅ Page ${pageIndex + 1} created`),
      onContentPlaced: (result) => updateInfo(`✓ Placed on page ${(result.pageIndex || 0) + 1}`),
    },
  });

  updateInfo('❌ Testing WITHOUT Orphan Detection (DISABLED)...');
  updateInfo('📝 Same scenario as test 1, but orphan detection is OFF');

  // Fill page
  for (let i = 0; i < 10; i++) {
    await engine.addExperience({
      _id: `fill-${i}`,
      title: `Filler Position ${i + 1}`,
      company: 'Company',
      startDate: '2020-01',
      endDate: '2021-12',
      description: [`Task 1`, `Task 2`],
    });
  }

  // Add orphan test position
  const orphanTest = testScenarios.orphanTestPosition();
  await engine.addExperience(orphanTest);

  updateInfo(`⚠️ Without orphan detection: Title MAY be orphaned on previous page`);
  updateInfo(`💡 Compare with test 1 to see the difference`);
});

document.getElementById('test-orphan-threshold')?.addEventListener('click', async () => {
  const container = document.getElementById('resume-container');
  if (!container) throw new Error('Container not found');
  container.innerHTML = '';

  engine = new ResumeLayoutEngine({
    container,
    page: {
      width: 793.7,
      height: 1123,
      padding: { top: 75.59, right: 75.59, bottom: 75.59, left: 75.59 },
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
            statements: { list: { marginTop: 5 }, item: { marginTop: 3 } },
          },
        },
      },
    },
    splitGuidelines: {
      enableSmartSplitting: true,
      preventOrphans: true,
      minChildrenToAvoidOrphan: 2,       // 📊 Require at least 2 children
      cascadeOrphanDetection: true,
    },
    events: {
      onPageCreated: (pageIndex) => updateInfo(`✅ Page ${pageIndex + 1} created`),
      onContentPlaced: (result) => updateInfo(`✓ Placed on page ${(result.pageIndex || 0) + 1}`),
    },
  });

  updateInfo('📊 Testing Min Children Threshold (minChildrenToAvoidOrphan: 2)...');
  updateInfo('📝 Title needs at least 2 children to avoid being orphaned');

  // Fill page
  for (let i = 0; i < 10; i++) {
    await engine.addExperience({
      _id: `fill-${i}`,
      title: `Position ${i + 1}`,
      company: 'Company',
      startDate: '2020-01',
      endDate: '2021-12',
      description: [`Task 1`, `Task 2`],
    });
  }

  // Add position with 3 statements
  const orphanTest = testScenarios.orphanTestPosition();
  await engine.addExperience(orphanTest);

  updateInfo(`✅ With threshold=2: Title needs 2+ children on same page`);
  updateInfo(`💡 If only 1 statement fits, entire block should move`);
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

