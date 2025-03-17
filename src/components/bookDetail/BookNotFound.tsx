
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const BookNotFound = () => {
  const navigate = useNavigate();
  
  return (
    <div className="container mx-auto px-4 text-center">
      <h1 className="text-2xl font-bold mb-4">Book Not Found</h1>
      <p className="mb-6 text-muted-foreground">Sorry, we couldn't find the book you're looking for.</p>
      <Button onClick={() => navigate('/')}>
        <ArrowLeft className="mr-2" size={16} />
        Back to Home
      </Button>
    </div>
  );
};

export default BookNotFound;
