
import React from 'react';
import { Link } from 'react-router-dom';
import { Book, getCoverUrl } from '@/services/openLibraryService';
import { Badge } from '@/components/ui/badge';

interface BookCardProps {
  book: Book;
  size?: 'small' | 'medium' | 'large';
}

const BookCard: React.FC<BookCardProps> = ({ book, size = 'medium' }) => {
  const coverSize = size === 'small' ? 'S' : size === 'large' ? 'L' : 'M';
  const coverUrl = getCoverUrl(book.cover_i, coverSize as 'S' | 'M' | 'L');
  
  const sizeClasses = {
    small: 'w-32',
    medium: 'w-40',
    large: 'w-48',
  };
  
  // Clean the book key to ensure it works with our routing
  const bookPath = book.key?.startsWith('/') ? book.key.substring(1) : book.key;
  
  return (
    <Link to={`/book/${bookPath}`} className={`book-card block ${sizeClasses[size]} transition-transform hover:-translate-y-1`}>
      <div className="relative overflow-hidden rounded-lg book-cover-shadow">
        <img 
          src={coverUrl} 
          alt={`Cover of ${book.title}`}
          className="book-cover w-full h-auto aspect-[2/3] object-cover"
          loading="lazy"
        />
        
        {book.first_publish_year && (
          <Badge 
            variant="secondary" 
            className="absolute bottom-2 right-2 opacity-80"
          >
            {book.first_publish_year}
          </Badge>
        )}
      </div>
      
      <div className="mt-2 space-y-1">
        <h3 className="font-medium text-sm leading-tight line-clamp-2">{book.title}</h3>
        
        {book.author_name && book.author_name.length > 0 && (
          <p className="text-xs text-muted-foreground line-clamp-1">
            {book.author_name[0]}
          </p>
        )}
      </div>
    </Link>
  );
};

export default BookCard;
