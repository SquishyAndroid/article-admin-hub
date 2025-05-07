
import React, { useEffect, useState } from "react";
import { Article } from "../types";
import { fetchArticles, updateArticle, createArticle } from "../services/api";
import ArticleTable from "../components/ArticleTable";
import ArticleDetailModal from "../components/ArticleDetailModal";
import CreateArticleModal from "../components/CreateArticleModal";
import Header from "../components/Header";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const { toast } = useToast();
  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  useEffect(() => {
    const loadArticles = async () => {
      setIsLoading(true);
      try {
        const response = await fetchArticles();
        if (response.success) {
          setArticles(response.data);
          setFilteredArticles(response.data);
        } else {
          toast({
            title: "Error",
            description: "Failed to load articles",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error fetching articles:", error);
        toast({
          title: "Error",
          description: "Failed to load articles",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadArticles();
  }, [toast]);
  
  const handleArticleClick = (article: Article) => {
    setSelectedArticle(article);
    setIsDetailModalOpen(true);
  };
  
  const handleSaveArticle = async (updatedArticle: Article) => {
    setIsSaving(true);
    try {
      const response = await updateArticle(updatedArticle);
      if (response.success) {
        // Update the articles list with the updated article
        const updatedArticles = articles.map((article) =>
          article.id === updatedArticle.id ? updatedArticle : article
        );
        setArticles(updatedArticles);
        setFilteredArticles(
          filteredArticles.map((article) =>
            article.id === updatedArticle.id ? updatedArticle : article
          )
        );
        setIsDetailModalOpen(false);
        toast({
          title: "Success",
          description: "Article updated successfully",
        });
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to update article",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating article:", error);
      toast({
        title: "Error",
        description: "Failed to update article",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleCreateArticle = async (url: string) => {
    setIsSaving(true);
    try {
      const response = await createArticle(url);
      if (response.success) {
        // Add the new article to the list
        const newArticle = response.data;
        setArticles([newArticle, ...articles]);
        setFilteredArticles([newArticle, ...filteredArticles]);
        setIsCreateModalOpen(false);
        
        // Open the detail modal for the new article
        setSelectedArticle(newArticle);
        setIsDetailModalOpen(true);
        
        toast({
          title: "Success",
          description: "Article created successfully",
        });
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to create article",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error creating article:", error);
      toast({
        title: "Error",
        description: "Failed to create article",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleSearch = (query: string) => {
    if (!query) {
      setFilteredArticles(articles);
      return;
    }
    
    const lowercasedQuery = query.toLowerCase();
    const filtered = articles.filter(
      (article) =>
        article.title.toLowerCase().includes(lowercasedQuery) ||
        article.content.toLowerCase().includes(lowercasedQuery) ||
        article.author.toLowerCase().includes(lowercasedQuery) ||
        article.tags.some((tag) => tag.toLowerCase().includes(lowercasedQuery))
    );
    
    setFilteredArticles(filtered);
  };
  
  return (
    <div className="container py-6">
      <Header
        onCreateClick={() => setIsCreateModalOpen(true)}
        onSearch={handleSearch}
      />
      
      <ArticleTable
        articles={filteredArticles}
        onArticleClick={handleArticleClick}
        isLoading={isLoading}
      />
      
      <ArticleDetailModal
        article={selectedArticle}
        open={isDetailModalOpen}
        onOpenChange={setIsDetailModalOpen}
        onSave={handleSaveArticle}
        isLoading={isSaving}
      />
      
      <CreateArticleModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onCreate={handleCreateArticle}
        isLoading={isSaving}
      />
    </div>
  );
};

export default Index;
