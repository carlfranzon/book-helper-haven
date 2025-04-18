
import React from 'react';
import { Book, getCoverUrl } from '@/services/openLibraryService';
import { Badge } from '@/components/ui/badge';
import { BookOpen } from 'lucide-react';

interface BookCoverProps {
  book: Book;
  interaction?: {
    hasRead?: boolean;
  };
}

const BookCover: React.FC<BookCoverProps> = ({ book, interaction }) => {
  // Fixed: Use a placeholder if cover_i is undefined
  const coverUrl = book.cover_i 
    ? getCoverUrl(book.cover_i, 'L')
    : 'https://via.placeholder.com/180x270?text=No+Cover';
  
  return (
    <div className="flex-shrink-0">
      <div className="book-cover-shadow rounded-lg overflow-hidden w-64 mx-auto md:mx-0 animate-fade-in">
        <img 
          src={coverUrl} 
          alt={`Cover of ${book.title}`} 
          className="w-full h-auto"
          onError={(e) => {
            // Fallback if the OpenLibrary image fails to load
            e.currentTarget.src = 'https://via.placeholder.com/180x270?text=No+Cover';
          }}
        />
      </div>
      
      {interaction && interaction.hasRead && (
        <div className="mt-4 flex justify-center md:justify-start">
          <Badge variant="outline" className="flex items-center gap-1">
            <BookOpen size={14} />
            <span>Read</span>
          </Badge>
        </div>
      )}
    </div>
  );
};

export default BookCover;
