import { ApiResponse, Article } from '../types';

// This is a mock API service - in a real application this would connect to your actual API
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock data
const mockArticles: Article[] = [
  {
    id: '1',
    title: 'Getting Started with React',
    url: 'getting-started-with-react',
    content: 'React is a popular JavaScript library for building user interfaces...',
    author: 'Jane Smith',
    publishedDate: '2025-04-15',
    tags: ['React', 'JavaScript', 'Frontend'],
    status: 'published',
    sections: [
      {
        id: 's1',
        title: 'Introduction',
        content: 'React is a JavaScript library created by Facebook. It is used for building user interfaces, specifically for single-page applications.',
        order: 1,
        sectionType: 'PARAGRAPH'
      },
      {
        id: 's2',
        title: 'Setting Up',
        content: 'To get started with React, you need Node.js installed. You can create a new React application using Create React App.',
        order: 2,
        sectionType: 'PARAGRAPH'
      },
    ],
    featuredImage: 'https://picsum.photos/800/400'
  },
  {
    id: '2',
    title: 'Understanding TypeScript',
    url: 'understanding-typescript',
    content: 'TypeScript is a typed superset of JavaScript that compiles to plain JavaScript...',
    author: 'John Doe',
    publishedDate: '2025-04-10',
    tags: ['TypeScript', 'JavaScript', 'Programming'],
    status: 'published',
    sections: [
      {
        id: 's1',
        title: 'What is TypeScript?',
        content: 'TypeScript is a free and open-source programming language developed and maintained by Microsoft.',
        order: 1,
        sectionType: 'ARTICLE_TITLE'
      },
      {
        id: 's2',
        title: 'Benefits',
        content: 'TypeScript adds static typing to JavaScript, which can help catch errors early and improve developer productivity.',
        order: 2,
        sectionType: 'PARAGRAPH'
      },
    ]
  },
  {
    id: '3',
    title: 'CSS Grid Layout',
    url: 'css-grid-layout',
    content: 'CSS Grid Layout is a two-dimensional grid system for the web...',
    author: 'Emma Wilson',
    publishedDate: '2025-04-05',
    tags: ['CSS', 'Web Design', 'Frontend'],
    status: 'draft',
    sections: [
      {
        id: 's1',
        title: 'Grid Basics',
        content: 'CSS Grid Layout is a two-dimensional system, meaning it can handle both columns and rows.',
        order: 1,
        sectionType: 'PARAGRAPH'
      },
      {
        id: 's2',
        title: 'Creating a Grid',
        content: 'To create a grid container, you set the display property to grid or inline-grid.',
        order: 2,
        sectionType: 'PARAGRAPH'
      },
    ],
    featuredImage: 'https://picsum.photos/800/401'
  },
  {
    id: '4',
    title: 'Introduction to API Development',
    url: 'intro-to-api-development',
    content: 'Learn how to design and develop RESTful APIs...',
    author: 'Michael Johnson',
    publishedDate: '2025-03-28',
    tags: ['API', 'Backend', 'REST'],
    status: 'published',
    sections: [
      {
        id: 's1',
        title: 'What is an API?',
        content: 'API stands for Application Programming Interface. It allows different software applications to communicate with each other.',
        order: 1,
        sectionType: 'ARTICLE_TITLE'
      },
      {
        id: 's2',
        title: 'REST Architecture',
        content: 'REST (Representational State Transfer) is an architectural style for designing networked applications.',
        order: 2,
        sectionType: 'PARAGRAPH'
      },
    ],
    featuredImage: 'https://picsum.photos/800/402'
  },
  {
    id: '5',
    title: 'Advanced JavaScript Patterns',
    url: 'advanced-javascript-patterns',
    content: 'Explore advanced design patterns in JavaScript...',
    author: 'Sarah Brown',
    publishedDate: '2025-03-20',
    tags: ['JavaScript', 'Design Patterns', 'Advanced'],
    status: 'draft',
    sections: [
      {
        id: 's1',
        title: 'Module Pattern',
        content: 'The Module pattern is used to create private and public methods and variables inside a single object.',
        order: 1,
        sectionType: 'PARAGRAPH'
      },
      {
        id: 's2',
        title: 'Singleton Pattern',
        content: 'The Singleton pattern ensures a class has only one instance and provides a global point of access to it.',
        order: 2,
        sectionType: 'PARAGRAPH'
      },
    ]
  }
];

export const fetchArticles = async (): Promise<ApiResponse<Article[]>> => {
  // Simulate API call delay
  await delay(800);
  
  return {
    success: true,
    data: mockArticles
  };
};

export const fetchArticleById = async (id: string): Promise<ApiResponse<Article | undefined>> => {
  // Simulate API call delay
  await delay(500);
  
  const article = mockArticles.find(article => article.id === id);
  
  return {
    success: true,
    data: article
  };
};

export const updateArticle = async (updatedArticle: Article): Promise<ApiResponse<Article>> => {
  // Simulate API call delay
  await delay(1000);
  
  // Find the index of the article to update
  const index = mockArticles.findIndex(article => article.id === updatedArticle.id);
  
  if (index !== -1) {
    // Update the article in our mock data
    mockArticles[index] = updatedArticle;
    return {
      success: true,
      data: updatedArticle,
      message: 'Article updated successfully'
    };
  }
  
  return {
    success: false,
    data: updatedArticle,
    message: 'Article not found'
  };
};

export const createArticle = async (url: string): Promise<ApiResponse<Article>> => {
  // Simulate API call delay
  await delay(1200);
  
  // Create a new article with default values
  const newArticle: Article = {
    id: `${mockArticles.length + 1}`,
    title: `New Article ${mockArticles.length + 1}`,
    url: url,
    content: 'This is a new article. Edit to add content.',
    author: 'Admin User',
    publishedDate: new Date().toISOString().split('T')[0],
    tags: ['New'],
    status: 'draft',
    sections: [
      {
        id: `s1-${Date.now()}`,
        title: 'New Section',
        content: 'Add your content here.',
        order: 1,
        sectionType: 'PARAGRAPH'
      }
    ]
  };
  
  // Add the new article to our mock data
  mockArticles.push(newArticle);
  
  return {
    success: true,
    data: newArticle,
    message: 'Article created successfully'
  };
};
