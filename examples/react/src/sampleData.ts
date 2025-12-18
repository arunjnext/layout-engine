import type { Position } from 'resume-layout-engine';

/**
 * Sample work experiences for demonstrating the resume layout engine
 * This data is designed to span multiple pages to showcase the automatic page splitting
 */
export const sampleExperiences: Position[] = [
  {
    _id: 'work-1',
    title: 'Senior Software Engineer',
    company: 'Tech Innovations Inc.',
    startDate: '2021-06',
    endDate: '2024-12',
    intro: 'Led development of cloud-based enterprise solutions serving 500K+ daily active users. Architected scalable microservices infrastructure and mentored junior developers.',
    description: [
      'Designed and implemented RESTful APIs using Node.js and Express, serving 1M+ requests per day with 99.9% uptime',
      'Reduced application load time by 65% through code splitting, lazy loading, and performance optimization techniques',
      'Led migration from monolithic architecture to microservices, improving deployment frequency by 400%',
      'Implemented comprehensive testing strategy with Jest and Cypress, increasing code coverage from 40% to 95%',
      'Mentored team of 5 junior developers, conducting code reviews and pair programming sessions',
      'Collaborated with product managers and designers to deliver features ahead of schedule',
      'Optimized database queries and implemented caching strategies, reducing response time by 50%',
      'Established CI/CD pipelines using GitHub Actions, reducing deployment time from 2 hours to 15 minutes',
      'Introduced TypeScript to the codebase, improving type safety and developer experience',
      'Built reusable component library using React and Storybook, adopted across 3 product teams'
    ]
  },
  {
    _id: 'work-2',
    title: 'Full Stack Developer',
    company: 'Digital Solutions Co.',
    startDate: '2019-03',
    endDate: '2021-05',
    intro: 'Developed and maintained e-commerce platform handling $5M+ in annual transactions. Worked across the full stack with React, Node.js, and PostgreSQL.',
    description: [
      'Built responsive front-end using React, Redux, and Material-UI, serving 50K+ monthly active users',
      'Developed payment integration with Stripe and PayPal, processing $500K+ monthly transactions',
      'Implemented real-time inventory management system using WebSockets and Redis',
      'Created admin dashboard for managing products, orders, and customer data',
      'Optimized SQL queries and database schema, reducing query time by 40%',
      'Integrated third-party APIs including shipping providers and marketing automation tools',
      'Implemented JWT-based authentication and authorization system',
      'Wrote technical documentation and API specifications for internal and external developers',
      'Participated in agile ceremonies including sprint planning, daily standups, and retrospectives',
      'Collaborated with QA team to ensure high-quality deliverables and bug-free releases'
    ]
  },
  {
    _id: 'work-3',
    title: 'Junior Frontend Developer',
    company: 'StartUp Ventures',
    startDate: '2017-08',
    endDate: '2019-02',
    intro: 'Contributed to building a modern web application from the ground up using React and modern JavaScript. Gained experience in responsive design and cross-browser compatibility.',
    description: [
      'Developed responsive UI components using React, HTML5, CSS3, and JavaScript ES6+',
      'Implemented state management using Redux and Context API',
      'Collaborated with UX designers to translate wireframes and mockups into functional code',
      'Ensured cross-browser compatibility and mobile responsiveness across all features',
      'Participated in code reviews and contributed to improving code quality standards',
      'Fixed bugs and implemented minor features based on user feedback',
      'Built a simple chat application using Socket.io and React',
      'Implemented a simple authentication system using JWT and cookies',
    ]
  }
];

