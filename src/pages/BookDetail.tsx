
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import BookReview from '@/components/BookReview';
import RecommendedBooks from '@/components/RecommendedBooks';
import { Book, getBookDetails, getCoverUrl, getUserBookInteraction } from '@/services/openLibraryService';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Calendar, Tag, User, BookOpen, Library } from 'lucide-react';

const BookDetail = () => {
  const { bookKey } = useParams<{ bookKey: string }>();
  const navigate = useNavigate();
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

  const renderLoadingSkeleton = () => (
    <div className="container mx-auto px-4 animate-pulse">
      <div className="flex flex-col md:flex-row gap-8">
        <Skeleton className="w-64 h-96 rounded-lg flex-shrink-0" />
        
        <div className="flex-1 space-y-4">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-6 w-1/2" />
          <div className="flex space-x-2">
            <Skeleton className="h-8 w-20 rounded-full" />
            <Skeleton className="h-8 w-20 rounded-full" />
          </div>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="py-12">
          {renderLoadingSkeleton()}
        </main>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="py-12">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-2xl font-bold mb-4">Book Not Found</h1>
            <p className="mb-6 text-muted-foreground">Sorry, we couldn't find the book you're looking for.</p>
            <Button onClick={() => navigate('/')}>
              <ArrowLeft className="mr-2" size={16} />
              Back to Home
            </Button>
          </div>
        </main>
      </div>
    );
  }

  const coverUrl = getCoverUrl(book.cover_i, 'L');

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="py-12">
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
            {/* Book Cover */}
            <div className="flex-shrink-0">
              <div className="book-cover-shadow rounded-lg overflow-hidden w-64 mx-auto md:mx-0 animate-fade-in">
                <img 
                  src={coverUrl} 
                  alt={`Cover of ${book.title}`} 
                  className="w-full h-auto"
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
            
            {/* Book Details */}
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
                      : book.description.value || ''}
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
          </div>
          
          <Separator className="my-10" />
          
          <BookReview book={book} onUpdate={handleInteractionUpdate} />
          
          <RecommendedBooks book={book} />
        </div>
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
