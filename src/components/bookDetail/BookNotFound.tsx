
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Search } from 'lucide-react';

const BookNotFound = () => {
  const navigate = useNavigate();
  
  return (
    <div className="container mx-auto px-4 py-12 text-center">
      <h1 className="text-3xl font-bold mb-4">Book Not Found</h1>
      <p className="mb-8 text-muted-foreground max-w-md mx-auto">
        Sorry, we couldn't find the book you're looking for. The book may have been removed or the URL might be incorrect.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button 
          onClick={() => navigate('/')}
          variant="outline"
        >
          <ArrowLeft className="mr-2" size={16} />
          Back to Home
        </Button>
        
        <Button onClick={() => navigate('/')}>
          <Search className="mr-2" size={16} />
          Search for Books
        </Button>
      </div>
    </div>
  );
};

export default BookNotFound;
