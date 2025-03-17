
import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search as SearchIcon } from 'lucide-react';
import { debounce } from 'lodash';

interface SearchBarProps {
  initialQuery?: string;
  onSearch?: (query: string) => void;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  initialQuery = '', 
  onSearch,
  className = ''
}) => {
  const [query, setQuery] = useState(initialQuery);
  const navigate = useNavigate();

  // Debounced search handler for on-the-fly searching
  const debouncedSearch = useCallback(
    debounce((searchQuery: string) => {
      if (onSearch && searchQuery.trim()) {
        onSearch(searchQuery.trim());
      }
    }, 500),
    [onSearch]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    
    if (onSearch) {
      debouncedSearch(newQuery);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (query.trim()) {
      if (onSearch) {
        onSearch(query.trim());
      } else {
        navigate(`/?search=${encodeURIComponent(query.trim())}`);
      }
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className={`relative flex w-full ${className}`}
    >
      <div className="relative w-full">
        <Input
          type="text"
          placeholder="Search for books, authors, genres..."
          value={query}
          onChange={handleInputChange}
          className="pr-10 bg-background/60 backdrop-blur-lg border-border/60 focus-visible:border-primary focus-visible:ring-primary/60"
        />
        <Button 
          type="submit" 
          size="icon" 
          variant="ghost" 
          className="absolute right-0 top-0 h-full aspect-square text-muted-foreground hover:text-foreground"
        >
          <SearchIcon size={18} />
        </Button>
      </div>
    </form>
  );
};

export default SearchBar;
