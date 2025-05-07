
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface HeaderProps {
  onCreateClick: () => void;
  onSearch: (query: string) => void;
}

const Header = ({ onCreateClick, onSearch }: HeaderProps) => {
  const [searchQuery, setSearchQuery] = React.useState("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  return (
    <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div>
        <h1 className="text-3xl font-bold">Blog Admin</h1>
        <p className="text-muted-foreground">Manage your blog articles</p>
      </div>
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative w-full sm:w-64">
          <Input
            placeholder="Search articles..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full"
          />
        </div>
        <Button onClick={onCreateClick}>Create New Article</Button>
      </div>
    </header>
  );
};

export default Header;
