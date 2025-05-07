
export interface Article {
  id: string;
  title: string;
  url: string;
  content: string;
  author: string;
  publishedDate: string;
  tags: string[];
  sections: ArticleSection[];
  status: 'published' | 'draft';
  featuredImage?: string;
}

export interface ArticleSection {
  id: string;
  title: string;
  content: string;
  order: number;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}
