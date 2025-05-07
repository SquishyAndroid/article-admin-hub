
import React, { useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface CreateArticleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (url: string) => void;
  isLoading: boolean;
}

const CreateArticleModal = ({
  open,
  onOpenChange,
  onCreate,
  isLoading,
}: CreateArticleModalProps) => {
  const { toast } = useToast();
  const [url, setUrl] = useState<string>("");
  
  const handleCreate = () => {
    if (!url.trim()) {
      toast({
        title: "URL is required",
        description: "Please enter a URL for your new article",
        variant: "destructive",
      });
      return;
    }
    
    // Format URL: lowercase, replace spaces with hyphens, remove special chars
    const formattedUrl = url
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]/g, "");
    
    onCreate(formattedUrl);
    setUrl("");
    
    toast({
      title: "Creating article",
      description: "Your new article is being created...",
    });
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Article</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="url">URL Slug</Label>
            <Input
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="my-new-article"
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              This will be used as the URL slug for your article. Use only letters, 
              numbers, and hyphens.
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Article"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateArticleModal;
