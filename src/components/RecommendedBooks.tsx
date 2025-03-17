
import React, { useEffect, useState } from 'react';
import { Book, getSimilarBooks } from '@/services/openLibraryService';
import BookGrid from './BookGrid';

interface RecommendedBooksProps {
  book: Book;
}

const RecommendedBooks: React.FC<RecommendedBooksProps> = ({ book }) => {
  const [similarBooks, setSimilarBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSimilarBooks = async () => {
      try {
        setIsLoading(true);
        const books = await getSimilarBooks(book);
        setSimilarBooks(books);
      } catch (error) {
        console.error('Error fetching similar books:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (book.key) {
      fetchSimilarBooks();
    }
  }, [book]);

  if (!isLoading && similarBooks.length === 0) {
    return null;
  }

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-serif font-medium mb-6">You May Also Like</h2>
      <BookGrid 
        books={similarBooks} 
        isLoading={isLoading} 
        emptyMessage="No recommendations found" 
        size="medium" 
      />
    </div>
  );
};

export default RecommendedBooks;
