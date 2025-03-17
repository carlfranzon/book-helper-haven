
import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Book, getBookDetails, getUserBookInteraction } from '@/services/openLibraryService';
import BookDetailSkeleton from '@/components/bookDetail/BookDetailSkeleton';
import BookNotFound from '@/components/bookDetail/BookNotFound';
import BookDetailLayout from '@/components/bookDetail/BookDetailLayout';

const BookDetail = () => {
  // Instead of bookKey param, we'll get the full path
  const location = useLocation();
  const [book, setBook] = useState<Book | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Extract the book key from the URL path
  // For example, from "/book/works/OL1892617W" we want "/works/OL1892617W"
  const pathSegments = location.pathname.split('/');
  const bookPath = pathSegments.slice(2).join('/'); 
  const bookKey = `/${bookPath}`;
  
  const [interaction, setInteraction] = useState(bookKey ? getUserBookInteraction(bookKey) : undefined);

  useEffect(() => {
    const loadBookDetails = async () => {
      setIsLoading(true);
      try {
        if (bookKey) {
          const details = await getBookDetails(bookKey);
          setBook(details);
        }
      } catch (error) {
        console.error('Error loading book details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadBookDetails();
  }, [bookKey]);

  // Update local interaction state when the interaction changes
  const handleInteractionUpdate = () => {
    if (bookKey) {
      setInteraction(getUserBookInteraction(bookKey));
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
