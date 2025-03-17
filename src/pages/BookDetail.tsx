
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Book, getBookDetails, getUserBookInteraction } from '@/services/openLibraryService';
import BookDetailSkeleton from '@/components/bookDetail/BookDetailSkeleton';
import BookNotFound from '@/components/bookDetail/BookNotFound';
import BookDetailLayout from '@/components/bookDetail/BookDetailLayout';

const BookDetail = () => {
  const { bookKey } = useParams<{ bookKey: string }>();
  const [book, setBook] = useState<Book | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [interaction, setInteraction] = useState(bookKey ? getUserBookInteraction(bookKey) : undefined);

  // Clean the book key from the URL
  const cleanBookKey = bookKey?.startsWith('/') ? bookKey : `/${bookKey}`;

  useEffect(() => {
    const loadBookDetails = async () => {
      setIsLoading(true);
      try {
        if (cleanBookKey) {
          const details = await getBookDetails(cleanBookKey);
          setBook(details);
        }
      } catch (error) {
        console.error('Error loading book details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadBookDetails();
  }, [cleanBookKey]);

  // Update local interaction state when the interaction changes
  const handleInteractionUpdate = () => {
    if (cleanBookKey) {
      setInteraction(getUserBookInteraction(cleanBookKey));
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="py-12">
        {isLoading ? (
          <BookDetailSkeleton />
        ) : !book ? (
          <BookNotFound />
        ) : (
          <BookDetailLayout 
            book={book} 
            interaction={interaction} 
            onInteractionUpdate={handleInteractionUpdate} 
          />
        )}
      </main>
      
      <footer className="py-6 bg-muted/30 border-t border-border">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2023 Book Haven. Data provided by Open Library.</p>
        </div>
      </footer>
    </div>
  );
};

export default BookDetail;
