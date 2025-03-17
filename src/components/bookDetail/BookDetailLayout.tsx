
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import BookCover from './BookCover';
import BookInfo from './BookInfo';
import BookReview from '@/components/BookReview';
import RecommendedBooks from '@/components/RecommendedBooks';
import { Book } from '@/services/openLibraryService';

interface BookDetailLayoutProps {
  book: Book;
  interaction?: {
    hasRead?: boolean;
  };
  onInteractionUpdate: () => void;
}

const BookDetailLayout: React.FC<BookDetailLayoutProps> = ({ 
  book, 
  interaction,
  onInteractionUpdate 
}) => {
  const navigate = useNavigate();
  
  return (
    <div className="container mx-auto px-4">
      <Button 
        variant="ghost" 
        className="mb-6"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="mr-2" size={16} />
        Back
      </Button>
      
      <div className="flex flex-col md:flex-row gap-8">
        <BookCover book={book} interaction={interaction} />
        <BookInfo book={book} />
      </div>
      
      <Separator className="my-10" />
      
      <BookReview book={book} onUpdate={onInteractionUpdate} />
      
      <RecommendedBooks book={book} />
    </div>
  );
};

export default BookDetailLayout;
