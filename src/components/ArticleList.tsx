
import React from "react";
import { Article } from "../types";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "../utils/format";

interface ArticleListProps {
  articles: Article[];
  onArticleClick: (article: Article) => void;
  isLoading: boolean;
}

const ArticleList = ({ articles, onArticleClick, isLoading }: ArticleListProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, index) => (
          <Card key={index} className="h-64 animate-pulse">
            <CardHeader className="h-12 bg-muted rounded-md"></CardHeader>
            <CardContent className="space-y-2">
              <div className="h-4 bg-muted rounded"></div>
              <div className="h-4 bg-muted rounded w-4/5"></div>
              <div className="h-4 bg-muted rounded w-3/5"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {articles.map((article) => (
        <Card 
          key={article.id} 
          className="cursor-pointer transition-all hover:shadow-md"
          onClick={() => onArticleClick(article)}
        >
          {article.featuredImage && (
            <div className="w-full h-40 overflow-hidden">
              <img 
                src={article.featuredImage} 
                alt={article.title} 
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <h3 className="font-semibold text-lg truncate">{article.title}</h3>
              <Badge variant={article.status === 'published' ? 'default' : 'outline'}>
                {article.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pb-2">
            <p className="text-muted-foreground text-sm truncate-2 mb-2">{article.content}</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {article.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {article.tags.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{article.tags.length - 3}
                </Badge>
              )}
            </div>
          </CardContent>
          <CardFooter className="text-xs text-muted-foreground">
            <div className="flex justify-between w-full">
              <span>{article.author}</span>
              <span>{formatDate(article.publishedDate)}</span>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default ArticleList;
