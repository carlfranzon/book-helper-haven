
import React from 'react';
import { Book } from '@/services/openLibraryService';
import BookCard from './BookCard';
import { Skeleton } from '@/components/ui/skeleton';

interface BookGridProps {
  books: Book[];
  isLoading?: boolean;
  emptyMessage?: string;
  title?: string;
  size?: 'small' | 'medium' | 'large';
}

const BookGrid: React.FC<BookGridProps> = ({ 
  books, 
  isLoading = false, 
  emptyMessage = "No books found", 
  title,
  size = 'medium' 
}) => {
  const renderSkeleton = () => {
    return Array(8).fill(null).map((_, index) => (
      <div key={index} className="flex flex-col space-y-2">
        <Skeleton className="w-40 h-60 rounded-lg" />
        <Skeleton className="w-40 h-4" />
        <Skeleton className="w-32 h-3" />
      </div>
    ));
  };

  return (
    <div className="w-full">
      {title && <h2 className="text-2xl font-serif font-medium mb-6">{title}</h2>}
      
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {renderSkeleton()}
        </div>
      ) : books.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {books.map((book) => (
            <BookCard key={book.key} book={book} size={size} />
          ))}
        </div>
      ) : (
        <div className="py-12 text-center">
          <p className="text-muted-foreground">{emptyMessage}</p>
        </div>
      )}
    </div>
  );
};

export default BookGrid;
