
import React from 'react';
import { Book } from '@/services/openLibraryService';
import { Badge } from '@/components/ui/badge';
import { Calendar, Library, Tag } from 'lucide-react';

interface BookInfoProps {
  book: Book;
}

const BookInfo: React.FC<BookInfoProps> = ({ book }) => {
  return (
    <div className="flex-1 animate-slide-up">
      <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2">{book.title}</h1>
      
      {book.author_name && book.author_name.length > 0 && (
        <div className="flex items-center text-lg mb-4">
          <span className="text-muted-foreground">by</span>
          <span className="ml-2 font-medium">{book.author_name[0]}</span>
        </div>
      )}
      
      <div className="flex flex-wrap gap-2 mb-6">
        {book.first_publish_year && (
          <Badge variant="secondary" className="flex items-center">
            <Calendar size={14} className="mr-1" />
            {book.first_publish_year}
          </Badge>
        )}
        
        {book.publisher && book.publisher.length > 0 && (
          <Badge variant="secondary" className="flex items-center">
            <Library size={14} className="mr-1" />
            {book.publisher[0]}
          </Badge>
        )}
      </div>
      
      {book.description && (
        <div className="mb-6">
          <h2 className="text-xl font-medium mb-2">About this book</h2>
          <p className="text-foreground leading-relaxed">
            {typeof book.description === 'string' 
              ? book.description
              : typeof book.description === 'object' && book.description !== null && 'value' in book.description 
                ? book.description.value 
                : ''}
          </p>
        </div>
      )}
      
      {book.subject && book.subject.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-medium mb-2">Subjects</h2>
          <div className="flex flex-wrap gap-2">
            {book.subject.slice(0, 8).map((subject, index) => (
              <Badge key={index} variant="outline" className="flex items-center">
                <Tag size={14} className="mr-1" />
                {subject}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BookInfo;
