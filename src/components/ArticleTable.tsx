
import React from "react";
import { Article } from "../types";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "../utils/format";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface ArticleTableProps {
  articles: Article[];
  onArticleClick: (article: Article) => void;
  isLoading: boolean;
}

const ArticleTable = ({ articles, onArticleClick, isLoading }: ArticleTableProps) => {
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const totalPages = Math.ceil(articles.length / rowsPerPage);
  const startIndex = (page - 1) * rowsPerPage;
  const paginatedArticles = articles.slice(startIndex, startIndex + rowsPerPage);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handleRowsPerPageChange = (value: string) => {
    setRowsPerPage(Number(value));
    setPage(1); // Reset to first page when changing rows per page
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-12 bg-muted rounded-md animate-pulse"></div>
        {[...Array(5)].map((_, index) => (
          <div key={index} className="h-16 bg-muted rounded-md animate-pulse"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">Author</TableHead>
              <TableHead className="hidden md:table-cell">Date</TableHead>
              <TableHead className="hidden md:table-cell">Tags</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedArticles.map((article) => (
              <TableRow 
                key={article.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => onArticleClick(article)}
              >
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    {article.featuredImage && (
                      <img 
                        src={article.featuredImage} 
                        alt={article.title}
                        className="h-10 w-10 rounded object-cover hidden sm:block"
                      />
                    )}
                    <span className="truncate">{article.title}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={article.status === 'published' ? 'default' : 'outline'}>
                    {article.status}
                  </Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">{article.author}</TableCell>
                <TableCell className="hidden md:table-cell">{formatDate(article.publishedDate)}</TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="flex flex-wrap gap-1">
                    {article.tags.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {article.tags.length > 2 && (
                      <Badge variant="secondary" className="text-xs">
                        +{article.tags.length - 2}
                      </Badge>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Rows per page:</span>
          <Select
            value={rowsPerPage.toString()}
            onValueChange={handleRowsPerPageChange}
          >
            <SelectTrigger className="h-8 w-16">
              <SelectValue placeholder={rowsPerPage} />
            </SelectTrigger>
            <SelectContent>
              {[5, 10, 20, 50].map((value) => (
                <SelectItem key={value} value={value.toString()}>
                  {value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span>
            {startIndex + 1}-{Math.min(startIndex + rowsPerPage, articles.length)} of{" "}
            {articles.length}
          </span>
        </div>

        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => handlePageChange(page - 1)} 
                className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
            
            {totalPages <= 5 ? (
              // Show all pages if 5 or fewer
              [...Array(totalPages)].map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    isActive={page === i + 1}
                    onClick={() => handlePageChange(i + 1)}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))
            ) : (
              // Show first, current with neighbors, and last
              <>
                <PaginationItem>
                  <PaginationLink
                    isActive={page === 1}
                    onClick={() => handlePageChange(1)}
                  >
                    1
                  </PaginationLink>
                </PaginationItem>
                
                {page > 3 && <PaginationEllipsis />}
                
                {page > 2 && (
                  <PaginationItem>
                    <PaginationLink onClick={() => handlePageChange(page - 1)}>
                      {page - 1}
                    </PaginationLink>
                  </PaginationItem>
                )}
                
                {page !== 1 && page !== totalPages && (
                  <PaginationItem>
                    <PaginationLink isActive onClick={() => handlePageChange(page)}>
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                )}
                
                {page < totalPages - 1 && (
                  <PaginationItem>
                    <PaginationLink onClick={() => handlePageChange(page + 1)}>
                      {page + 1}
                    </PaginationLink>
                  </PaginationItem>
                )}
                
                {page < totalPages - 2 && <PaginationEllipsis />}
                
                <PaginationItem>
                  <PaginationLink
                    isActive={page === totalPages}
                    onClick={() => handlePageChange(totalPages)}
                  >
                    {totalPages}
                  </PaginationLink>
                </PaginationItem>
              </>
            )}
            
            <PaginationItem>
              <PaginationNext 
                onClick={() => handlePageChange(page + 1)}
                className={page === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

const PaginationEllipsis = () => {
  return (
    <PaginationItem>
      <span className="flex h-9 w-9 items-center justify-center">
        <span className="h-4 w-4">...</span>
      </span>
    </PaginationItem>
  );
};

export default ArticleTable;
