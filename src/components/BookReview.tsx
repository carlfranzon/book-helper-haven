
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Book, saveUserBookInteraction, getUserBookInteraction } from '@/services/openLibraryService';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star, BookOpen, BookPlus, Pencil } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface BookReviewProps {
  book: Book;
  onUpdate?: () => void;
}

const BookReview: React.FC<BookReviewProps> = ({ book, onUpdate }) => {
  const { isAuthenticated, login, signup, isLoading } = useAuth();
  const bookInteraction = getUserBookInteraction(book.key);
  
  const [isEditing, setIsEditing] = useState(false);
  const [review, setReview] = useState(bookInteraction?.review || '');
  const [rating, setRating] = useState(bookInteraction?.rating || 0);
  const [hasRead, setHasRead] = useState(bookInteraction?.hasRead || false);
  
  // Auth modal state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

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

  // Auth functions
  const validateLogin = () => {
    const newErrors: Record<string, string> = {};
    
    if (!loginData.email) newErrors.loginEmail = 'Email is required';
    if (!loginData.password) newErrors.loginPassword = 'Password is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateSignup = () => {
    const newErrors: Record<string, string> = {};
    
    if (!signupData.name) newErrors.signupName = 'Name is required';
    if (!signupData.email) newErrors.signupEmail = 'Email is required';
    if (!signupData.password) newErrors.signupPassword = 'Password is required';
    if (signupData.password.length < 6) newErrors.signupPassword = 'Password must be at least 6 characters';
    if (signupData.password !== signupData.confirmPassword) newErrors.signupConfirmPassword = 'Passwords do not match';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateLogin()) return;
    
    try {
      await login(loginData.email, loginData.password);
      setIsAuthModalOpen(false);
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateSignup()) return;
    
    try {
      await signup(signupData.name, signupData.email, signupData.password);
      setIsAuthModalOpen(false);
    } catch (error) {
      console.error('Signup error:', error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="p-6 bg-muted/30 rounded-lg text-center">
        <h3 className="text-lg font-medium mb-3">Want to review this book?</h3>
        <p className="text-muted-foreground mb-4">Sign in to add your review and track your reading progress.</p>
        
        {/* Use a regular Button instead of AuthModal to avoid DialogTrigger issue */}
        <Button onClick={() => setIsAuthModalOpen(true)} className="bg-primary hover:bg-primary/90">
          Sign In
        </Button>
        
        {/* Auth dialog */}
        <Dialog open={isAuthModalOpen} onOpenChange={setIsAuthModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-center text-xl font-bold">Welcome to Book Haven</DialogTitle>
              <DialogDescription className="text-center">
                Sign in or create an account to track your books and write reviews
              </DialogDescription>
            </DialogHeader>
            
            <div className="tabs w-full">
              <div className="flex border-b mb-4">
                <button
                  className={`flex-1 py-2 text-center ${activeTab === 'login' ? 'border-b-2 border-primary font-medium' : 'text-muted-foreground'}`}
                  onClick={() => setActiveTab('login')}
                >
                  Login
                </button>
                <button
                  className={`flex-1 py-2 text-center ${activeTab === 'signup' ? 'border-b-2 border-primary font-medium' : 'text-muted-foreground'}`}
                  onClick={() => setActiveTab('signup')}
                >
                  Sign Up
                </button>
              </div>
              
              {activeTab === 'login' ? (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="login-email" className="text-sm font-medium">Email</label>
                    <input
                      id="login-email"
                      type="email"
                      placeholder="you@example.com"
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      className={`w-full px-3 py-2 border rounded-md ${errors.loginEmail ? "border-red-500" : "border-input"}`}
                    />
                    {errors.loginEmail && <p className="text-red-500 text-xs">{errors.loginEmail}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="login-password" className="text-sm font-medium">Password</label>
                    <input
                      id="login-password"
                      type="password"
                      placeholder="••••••••"
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      className={`w-full px-3 py-2 border rounded-md ${errors.loginPassword ? "border-red-500" : "border-input"}`}
                    />
                    {errors.loginPassword && <p className="text-red-500 text-xs">{errors.loginPassword}</p>}
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Please wait..." : "Sign In"}
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="signup-name" className="text-sm font-medium">Name</label>
                    <input
                      id="signup-name"
                      placeholder="Your name"
                      value={signupData.name}
                      onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                      className={`w-full px-3 py-2 border rounded-md ${errors.signupName ? "border-red-500" : "border-input"}`}
                    />
                    {errors.signupName && <p className="text-red-500 text-xs">{errors.signupName}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="signup-email" className="text-sm font-medium">Email</label>
                    <input
                      id="signup-email"
                      type="email"
                      placeholder="you@example.com"
                      value={signupData.email}
                      onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                      className={`w-full px-3 py-2 border rounded-md ${errors.signupEmail ? "border-red-500" : "border-input"}`}
                    />
                    {errors.signupEmail && <p className="text-red-500 text-xs">{errors.signupEmail}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="signup-password" className="text-sm font-medium">Password</label>
                    <input
                      id="signup-password"
                      type="password"
                      placeholder="••••••••"
                      value={signupData.password}
                      onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                      className={`w-full px-3 py-2 border rounded-md ${errors.signupPassword ? "border-red-500" : "border-input"}`}
                    />
                    {errors.signupPassword && <p className="text-red-500 text-xs">{errors.signupPassword}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="signup-confirm-password" className="text-sm font-medium">Confirm Password</label>
                    <input
                      id="signup-confirm-password"
                      type="password"
                      placeholder="••••••••"
                      value={signupData.confirmPassword}
                      onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                      className={`w-full px-3 py-2 border rounded-md ${errors.signupConfirmPassword ? "border-red-500" : "border-input"}`}
                    />
                    {errors.signupConfirmPassword && <p className="text-red-500 text-xs">{errors.signupConfirmPassword}</p>}
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Creating account..." : "Create Account"}
                  </Button>
                </form>
              )}
            </div>
          </DialogContent>
        </Dialog>
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

