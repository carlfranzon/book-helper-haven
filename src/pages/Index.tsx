
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import BookGrid from '@/components/BookGrid';
import SearchBar from '@/components/SearchBar';
import { Book, searchBooks, getTrendingBooks } from '@/services/openLibraryService';
import { Button } from '@/components/ui/button';
import { Pagination } from '@/components/ui/pagination';
import { PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { ArrowLeft, ArrowRight, Book as BookIcon, Sparkles } from 'lucide-react';

const Index = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const initialQuery = searchParams.get('search') || '';
  const pageParam = searchParams.get('page');
  const initialPage = pageParam ? parseInt(pageParam) : 1;

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [books, setBooks] = useState<Book[]>([]);
  const [trendingBooks, setTrendingBooks] = useState<Book[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [isTrendingLoading, setIsTrendingLoading] = useState(false);
  
  const resultsPerPage = 10;
  const totalPages = Math.ceil(totalResults / resultsPerPage);

  // Load trending books on initial page load
  useEffect(() => {
    const loadTrendingBooks = async () => {
      setIsTrendingLoading(true);
      try {
        const trending = await getTrendingBooks();
        setTrendingBooks(trending);
      } catch (error) {
        console.error('Error loading trending books:', error);
      } finally {
        setIsTrendingLoading(false);
      }
    };

    if (!initialQuery) {
      loadTrendingBooks();
    }
  }, [initialQuery]);

  // Perform search when query or page changes
  useEffect(() => {
    const performSearch = async () => {
      if (!searchQuery) {
        setBooks([]);
        setTotalResults(0);
        return;
      }

      setIsSearchLoading(true);
      try {
        const result = await searchBooks(searchQuery, currentPage, resultsPerPage);
        setBooks(result.books);
        setTotalResults(result.totalResults);
      } catch (error) {
        console.error('Error searching books:', error);
      } finally {
        setIsSearchLoading(false);
      }
    };

    performSearch();
  }, [searchQuery, currentPage]);

  // Update URL when search query or page changes
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) {
      params.set('search', searchQuery);
      if (currentPage > 1) {
        params.set('page', currentPage.toString());
      }
    }
    
    navigate(`/?${params.toString()}`, { replace: true });
  }, [searchQuery, currentPage, navigate]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const createPageItem = (pageNum: number) => (
      <PaginationItem key={pageNum}>
        <PaginationLink
          onClick={(e) => {
            e.preventDefault();
            handlePageChange(pageNum);
          }}
          isActive={currentPage === pageNum}
        >
          {pageNum}
        </PaginationLink>
      </PaginationItem>
    );

    const pages = [];
    if (totalPages <= 7) {
      // If 7 or fewer pages, show all
      for (let i = 1; i <= totalPages; i++) {
        pages.push(createPageItem(i));
      }
    } else {
      // Always show first page
      pages.push(createPageItem(1));
      
      // Show ellipsis if not starting from page 2
      if (currentPage > 3) {
        pages.push(
          <PaginationItem key="ellipsis-1">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
      
      // Show pages around current page
      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(createPageItem(i));
      }
      
      // Show ellipsis if not ending at second-to-last page
      if (currentPage < totalPages - 2) {
        pages.push(
          <PaginationItem key="ellipsis-2">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
      
      // Always show last page
      pages.push(createPageItem(totalPages));
    }

    return (
      <Pagination className="my-8">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={(e) => {
                e.preventDefault();
                if (currentPage > 1) handlePageChange(currentPage - 1);
              }}
              className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
            />
          </PaginationItem>
          
          {pages}
          
          <PaginationItem>
            <PaginationNext
              onClick={(e) => {
                e.preventDefault();
                if (currentPage < totalPages) handlePageChange(currentPage + 1);
              }}
              className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        <section className="py-12 px-4 md:px-8">
          <div className="container mx-auto">
            <div className="max-w-2xl mx-auto text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 animate-fade-in">
                Discover Your Next Great Read
              </h1>
              <p className="text-lg text-muted-foreground mb-8 animate-slide-up">
                Search for books, read reviews, and find your next literary adventure
              </p>
              
              <div className="animate-slide-up" style={{ animationDelay: '100ms' }}>
                <SearchBar 
                  initialQuery={searchQuery} 
                  onSearch={handleSearch} 
                  className="max-w-lg mx-auto" 
                />
              </div>
            </div>
            
            {searchQuery ? (
              <div className="mt-12 animate-fade-in">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-serif font-medium">
                    {isSearchLoading ? 'Searching...' : `Results for "${searchQuery}"`}
                  </h2>
                  
                  <div className="flex items-center text-sm text-muted-foreground">
                    {!isSearchLoading && totalResults > 0 && (
                      <span>
                        Showing {(currentPage - 1) * resultsPerPage + 1}-
                        {Math.min(currentPage * resultsPerPage, totalResults)} of {totalResults} results
                      </span>
                    )}
                  </div>
                </div>
                
                <BookGrid 
                  books={books} 
                  isLoading={isSearchLoading}
                  emptyMessage={`No books found for "${searchQuery}". Try another search term.`}
                />
                
                {renderPagination()}
              </div>
            ) : (
              <div className="mt-16 animate-fade-in">
                <div className="flex items-center mb-8">
                  <Sparkles size={24} className="text-primary mr-2" />
                  <h2 className="text-2xl font-serif font-medium">Popular Books</h2>
                </div>
                
                <BookGrid 
                  books={trendingBooks} 
                  isLoading={isTrendingLoading}
                  emptyMessage="Failed to load trending books. Please try again later."
                />
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className="py-6 bg-muted/30 border-t border-border">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2023 Book Haven. Data provided by Open Library.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
