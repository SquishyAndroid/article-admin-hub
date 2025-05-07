
import React, { useState } from "react";
import { Article, ArticleSection } from "../types";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "../utils/format";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

interface ArticleDetailModalProps {
  article: Article | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (article: Article) => void;
  isLoading: boolean;
}

const ArticleDetailModal = ({
  article,
  open,
  onOpenChange,
  onSave,
  isLoading,
}: ArticleDetailModalProps) => {
  const { toast } = useToast();
  const [editedArticle, setEditedArticle] = useState<Article | null>(article);
  
  // Update local state when article prop changes
  React.useEffect(() => {
    setEditedArticle(article);
  }, [article]);
  
  if (!article || !editedArticle) return null;
  
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: keyof Article
  ) => {
    setEditedArticle({
      ...editedArticle,
      [field]: e.target.value,
    });
  };
  
  const handleSectionChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    sectionId: string,
    field: keyof ArticleSection
  ) => {
    const updatedSections = editedArticle.sections.map((section) =>
      section.id === sectionId ? { ...section, [field]: e.target.value } : section
    );
    
    setEditedArticle({
      ...editedArticle,
      sections: updatedSections,
    });
  };
  
  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tagsString = e.target.value;
    const tagsArray = tagsString.split(",").map((tag) => tag.trim());
    
    setEditedArticle({
      ...editedArticle,
      tags: tagsArray,
    });
  };
  
  const handleStatusChange = (status: 'published' | 'draft') => {
    setEditedArticle({
      ...editedArticle,
      status,
    });
  };
  
  const handleSave = () => {
    if (!editedArticle) return;
    
    onSave(editedArticle);
    toast({
      title: "Article saved",
      description: "Your changes have been saved successfully.",
    });
  };
  
  const addSection = () => {
    const newSection: ArticleSection = {
      id: `s${Date.now()}`,
      title: "New Section",
      content: "Add your content here.",
      order: editedArticle.sections.length + 1,
    };
    
    setEditedArticle({
      ...editedArticle,
      sections: [...editedArticle.sections, newSection],
    });
  };
  
  const removeSection = (sectionId: string) => {
    const updatedSections = editedArticle.sections.filter(
      (section) => section.id !== sectionId
    );
    
    setEditedArticle({
      ...editedArticle,
      sections: updatedSections,
    });
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            <Input
              className="text-xl font-bold"
              value={editedArticle.title}
              onChange={(e) => handleInputChange(e, "title")}
            />
            <div className="flex items-center gap-2 mt-2">
              <Badge 
                variant={editedArticle.status === "published" ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => handleStatusChange(
                  editedArticle.status === "published" ? "draft" : "published"
                )}
              >
                {editedArticle.status}
              </Badge>
              <span className="text-xs text-muted-foreground">
                by {editedArticle.author} on {formatDate(editedArticle.publishedDate)}
              </span>
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="content" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="metadata">Metadata</TabsTrigger>
          </TabsList>
          
          <TabsContent value="content" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="main-content">Summary</Label>
              <Textarea
                id="main-content"
                value={editedArticle.content}
                onChange={(e) => handleInputChange(e, "content")}
                rows={4}
              />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">Sections</h3>
                <Button size="sm" onClick={addSection}>
                  Add Section
                </Button>
              </div>
              
              <Accordion type="multiple" className="w-full">
                {editedArticle.sections.map((section) => (
                  <AccordionItem key={section.id} value={section.id}>
                    <AccordionTrigger className="py-2">
                      <Input
                        value={section.title}
                        onChange={(e) => handleSectionChange(e, section.id, "title")}
                        onClick={(e) => e.stopPropagation()}
                        className="w-4/5"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeSection(section.id);
                        }}
                        className="ml-2 h-8 px-2 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                      >
                        Remove
                      </Button>
                    </AccordionTrigger>
                    <AccordionContent>
                      <Textarea
                        value={section.content}
                        onChange={(e) => handleSectionChange(e, section.id, "content")}
                        rows={6}
                        className="mt-2"
                      />
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </TabsContent>
          
          <TabsContent value="metadata" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="url">URL Slug</Label>
              <Input
                id="url"
                value={editedArticle.url}
                onChange={(e) => handleInputChange(e, "url")}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="author">Author</Label>
              <Input
                id="author"
                value={editedArticle.author}
                onChange={(e) => handleInputChange(e, "author")}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="publishedDate">Published Date</Label>
              <Input
                id="publishedDate"
                type="date"
                value={editedArticle.publishedDate}
                onChange={(e) => handleInputChange(e, "publishedDate")}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                value={editedArticle.tags.join(", ")}
                onChange={handleTagsChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="featuredImage">Featured Image URL</Label>
              <Input
                id="featuredImage"
                value={editedArticle.featuredImage || ""}
                onChange={(e) => handleInputChange(e, "featuredImage")}
                placeholder="https://..."
              />
              {editedArticle.featuredImage && (
                <div className="mt-2 w-full h-40 overflow-hidden rounded-md border">
                  <img
                    src={editedArticle.featuredImage}
                    alt="Featured"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
        
        <Separator />
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ArticleDetailModal;
