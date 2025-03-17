
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Book, saveUserBookInteraction, getUserBookInteraction } from '@/services/openLibraryService';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star, BookOpen, BookPlus, Pencil } from 'lucide-react';
import { AuthModal } from './AuthModal';
import { toast } from '@/components/ui/use-toast';

interface BookReviewProps {
  book: Book;
  onUpdate?: () => void;
}

const BookReview: React.FC<BookReviewProps> = ({ book, onUpdate }) => {
  const { isAuthenticated } = useAuth();
  const bookInteraction = getUserBookInteraction(book.key);
  
  const [isEditing, setIsEditing] = useState(false);
  const [review, setReview] = useState(bookInteraction?.review || '');
  const [rating, setRating] = useState(bookInteraction?.rating || 0);
  const [hasRead, setHasRead] = useState(bookInteraction?.hasRead || false);

  const handleSaveReview = () => {
    saveUserBookInteraction({
      bookKey: book.key,
      rating,
      review,
      hasRead,
      dateAdded: bookInteraction?.dateAdded || new Date().toISOString(),
    });
    
    setIsEditing(false);
    toast({
      title: "Review saved",
      description: "Your review has been saved successfully.",
    });
    
    if (onUpdate) {
      onUpdate();
    }
  };

  const handleToggleReadStatus = () => {
    const newHasRead = !hasRead;
    setHasRead(newHasRead);
    
    saveUserBookInteraction({
      bookKey: book.key,
      rating: bookInteraction?.rating || rating,
      review: bookInteraction?.review || review,
      hasRead: newHasRead,
      dateAdded: bookInteraction?.dateAdded || new Date().toISOString(),
    });
    
    toast({
      title: newHasRead ? "Marked as read" : "Marked as unread",
      description: `This book has been ${newHasRead ? 'added to' : 'removed from'} your reading list.`,
    });
    
    if (onUpdate) {
      onUpdate();
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="p-6 bg-muted/30 rounded-lg text-center">
        <h3 className="text-lg font-medium mb-3">Want to review this book?</h3>
        <p className="text-muted-foreground mb-4">Sign in to add your review and track your reading progress.</p>
        <AuthModal />
      </div>
    );
  }

  return (
    <div className="bg-muted/30 rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Your Review</h3>
        
        <div className="flex space-x-2">
          <Button
            variant={hasRead ? "default" : "outline"}
            size="sm"
            onClick={handleToggleReadStatus}
            className="flex items-center space-x-1"
          >
            {hasRead ? <BookOpen size={16} /> : <BookPlus size={16} />}
            <span>{hasRead ? "Read" : "Want to Read"}</span>
          </Button>
          
          {(bookInteraction?.review || isEditing) && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center space-x-1"
            >
              <Pencil size={16} />
              <span>{isEditing ? "Cancel" : "Edit"}</span>
            </Button>
          )}
        </div>
      </div>
      
      {isEditing ? (
        <div className="space-y-4">
          <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Button
                key={star}
                variant="ghost"
                size="sm"
                onClick={() => setRating(star)}
                className={`p-1 ${rating >= star ? 'text-yellow-500' : 'text-gray-300'}`}
              >
                <Star size={20} fill={rating >= star ? 'currentColor' : 'none'} />
              </Button>
            ))}
          </div>
          
          <Textarea
            placeholder="Write your review here..."
            value={review}
            onChange={(e) => setReview(e.target.value)}
            className="min-h-[100px]"
          />
          
          <div className="flex justify-end">
            <Button onClick={handleSaveReview}>Save Review</Button>
          </div>
        </div>
      ) : bookInteraction?.review ? (
        <div>
          <div className="flex items-center space-x-1 mb-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star 
                key={star} 
                size={18} 
                className={bookInteraction.rating && bookInteraction.rating >= star ? 'text-yellow-500 fill-current' : 'text-gray-300'} 
              />
            ))}
          </div>
          
          <p className="text-foreground">{bookInteraction.review}</p>
        </div>
      ) : (
        <div className="text-center py-4">
          <p className="text-muted-foreground mb-3">You haven't reviewed this book yet.</p>
          <Button onClick={() => setIsEditing(true)}>Write a Review</Button>
        </div>
      )}
    </div>
  );
};

export default BookReview;
