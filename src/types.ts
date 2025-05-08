
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

export type SectionType = 'ARTICLE_TITLE' | 'PARAGRAPH' | 'INLINE_IMAGE' | 'HERO_IMAGE';

export interface ArticleSection {
  id: string;
  title: string;
  content: string;
  order: number;
  sectionType: SectionType;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}
