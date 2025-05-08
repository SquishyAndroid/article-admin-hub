
import React, { useState } from "react";
import { Article, ArticleSection, SectionType } from "../types";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heading, Image, Paragraph } from "lucide-react";

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

  const handleSectionTypeChange = (
    sectionId: string,
    newType: SectionType
  ) => {
    const updatedSections = editedArticle.sections.map((section) =>
      section.id === sectionId ? { ...section, sectionType: newType } : section
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
      sectionType: "PARAGRAPH"
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

  const getSectionTypeIcon = (type: SectionType) => {
    switch (type) {
      case "ARTICLE_TITLE":
        return <Heading className="h-4 w-4" />;
      case "PARAGRAPH":
        return <Paragraph className="h-4 w-4" />;
      case "INLINE_IMAGE":
      case "HERO_IMAGE":
        return <Image className="h-4 w-4" />;
      default:
        return <Paragraph className="h-4 w-4" />;
    }
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
                      <div className="flex items-center gap-2 w-4/5">
                        {getSectionTypeIcon(section.sectionType)}
                        <Input
                          value={section.title}
                          onChange={(e) => handleSectionChange(e, section.id, "title")}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
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
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor={`section-type-${section.id}`}>Section Type</Label>
                          <Select
                            value={section.sectionType}
                            onValueChange={(value: SectionType) => handleSectionTypeChange(section.id, value)}
                          >
                            <SelectTrigger id={`section-type-${section.id}`}>
                              <SelectValue placeholder="Select a section type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ARTICLE_TITLE">Article Title</SelectItem>
                              <SelectItem value="PARAGRAPH">Paragraph</SelectItem>
                              <SelectItem value="INLINE_IMAGE">Inline Image</SelectItem>
                              <SelectItem value="HERO_IMAGE">Hero Image</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`section-content-${section.id}`}>Content</Label>
                          <Textarea
                            id={`section-content-${section.id}`}
                            value={section.content}
                            onChange={(e) => handleSectionChange(e, section.id, "content")}
                            rows={6}
                          />
                        </div>
                      </div>
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
