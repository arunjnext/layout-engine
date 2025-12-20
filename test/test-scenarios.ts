import type { Education, Position } from 'resume-layout-engine';

export const testScenarios = {
  // Large position that should split
  largePosition: (): Position => ({
    _id: 'large-1',
    title: 'Senior Software Engineer',
    company: 'Tech Corporation Inc.',
    startDate: '2020-01',
    endDate: '2024-12',
    intro: 'Led a team of 10 engineers in developing scalable web applications. Responsible for architecture decisions and code reviews. Worked closely with product managers to define technical requirements and ensure timely delivery of features.',
    description: [
      'Architected and implemented microservices architecture serving 1M+ users daily',
      'Led migration from monolithic to microservices, reducing deployment time by 80%',
      'Mentored 5 junior developers and conducted weekly code reviews',
      'Implemented CI/CD pipelines reducing release cycle from 2 weeks to 2 days',
      'Optimized database queries reducing average response time by 60%',
      'Designed and implemented real-time notification system using WebSockets',
      'Collaborated with product team to define technical requirements and timelines',
      'Participated in on-call rotation and incident response, maintaining 99.9% uptime',
      'Contributed to open-source projects with 500+ stars on GitHub',
      'Presented technical talks at 3 industry conferences',
      'Implemented automated testing increasing code coverage from 60% to 85%',
      'Redesigned authentication system improving security and user experience',
      'Implemented automated testing increasing code coverage from 60% to 85%',
      'Redesigned authentication system improving security and user experience',
      'Implemented automated testing increasing code coverage from 60% to 85%',
    ],
  }),
  

  // Small position that should fit
  smallPosition: (): Position => ({
    _id: 'small-1',
    title: 'Junior Developer',
    company: 'Startup Inc.',
    startDate: '2022-01',
    endDate: '2023-12',
    description: [
      'Developed features for web application',
      'Fixed bugs and improved code quality',
    ],
  }),
  
  // Position with only intro (no statements)
  introOnly: (): Position => ({
    _id: 'intro-1',
    title: 'Full Stack Developer',
    company: 'Web Solutions',
    startDate: '2021-01',
    endDate: '2022-12',
    intro: 'This is a very long intro paragraph that should be split across pages if needed. It contains multiple sentences and describes the role in detail. The text continues to demonstrate how intro splitting works when there are no bullet points or statements to split at. This allows testing the fallback splitting strategy.',
    description: [],
  }),
  
  // Position that should move entirely (too small percentage fits)
  tinyFit: (): Position => ({
    _id: 'tiny-1',
    title: 'Software Engineer',
    company: 'Big Tech',
    startDate: '2019-01',
    endDate: '2024-12',
    intro: 'Worked on various projects',
    description: Array(20).fill(0).map((_, i) => 
      `Accomplishment ${i + 1}: Detailed description of a significant achievement that demonstrates skills and impact`
    ),
  }),
  
  // Education entry for testing
  largeEducation: (): Education => ({
    _id: 'edu-1',
    degree: 'Master of Science in Computer Science',
    institution: 'University of Technology',
    year: '2018',
    description: [
      'Thesis: Machine Learning Applications in Web Development',
      'GPA: 3.9/4.0 (Summa Cum Laude)',
      'Relevant Coursework: Algorithms, Data Structures, Database Systems, Distributed Systems',
      'Research Assistant in Distributed Systems Lab for 2 years',
      'Published 2 papers in peer-reviewed journals',
      'Teaching Assistant for Advanced Algorithms course',
      'Dean\'s List for 4 consecutive semesters',
      'Graduated with distinction',
    ],
  }),

  // Position designed to test orphan detection
  // This has a title, intro, and just a few statements
  // If the statements don't fit, the title+intro would be orphaned
  orphanTestPosition: (): Position => ({
    _id: 'orphan-test-1',
    title: 'Technical Lead',
    company: 'Innovation Labs',
    startDate: '2023-01',
    endDate: 'Present',
    intro: 'Led technical initiatives and mentored team members in modern development practices.',
    description: [
      'Architected cloud-native solutions using AWS and Kubernetes',
      'Implemented DevOps best practices reducing deployment time by 70%',
      'Mentored 8 engineers in system design and code quality',
    ],
  }),

  // Position with many statements to test orphan prevention
  // When split, should ensure title isn't left alone
  manyStatementsPosition: (): Position => ({
    _id: 'many-statements-1',
    title: 'Principal Engineer',
    company: 'Enterprise Solutions Corp',
    startDate: '2020-01',
    endDate: '2024-12',
    intro: 'Drove technical excellence across multiple product teams and established engineering standards.',
    description: Array(15).fill(0).map((_, i) =>
      `Key achievement ${i + 1}: Delivered significant impact through technical leadership and hands-on development`
    ),
  }),
};

