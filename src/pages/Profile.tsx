
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';
import { Book, getUserBookInteractions, removeUserBookInteraction } from '@/services/openLibraryService';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { BookOpen, Library, Star, Trash2, User } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import BookCard from '@/components/BookCard';

const Profile = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [readBooks, setReadBooks] = useState<any[]>([]);
  const [reviewedBooks, setReviewedBooks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Redirect if not authenticated
    if (!isAuthenticated) {
      navigate('/');
      return;
    }

    // Load user's books
    const interactions = getUserBookInteractions();
    
    setReadBooks(interactions.filter(interaction => interaction.hasRead));
    setReviewedBooks(interactions.filter(interaction => interaction.review));
    setIsLoading(false);
  }, [isAuthenticated, navigate]);

  const handleRemoveBook = (bookKey: string) => {
    removeUserBookInteraction(bookKey);
    
    setReadBooks(readBooks.filter(book => book.bookKey !== bookKey));
    setReviewedBooks(reviewedBooks.filter(book => book.bookKey !== bookKey));
    
    toast({
      title: "Book removed",
      description: "The book has been removed from your profile.",
    });
  };

  if (!isAuthenticated || !user) {
    return null; // Will redirect in useEffect
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="py-12">
        <div className="container mx-auto px-4">
          <Card className="mb-8 overflow-hidden">
            <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-500"></div>
            <CardHeader className="pb-2 -mt-12">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <Avatar className="h-24 w-24 border-4 border-white shadow-md">
                  <AvatarFallback className="text-2xl bg-primary text-white">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="mt-4 md:mt-12">
                  <CardTitle className="text-2xl">{user.name}</CardTitle>
                  <CardDescription>{user.email}</CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="flex flex-wrap gap-4 mt-4">
                <div className="flex items-center space-x-2">
                  <BookOpen size={18} className="text-muted-foreground" />
                  <span>{readBooks.length} books read</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Star size={18} className="text-muted-foreground" />
                  <span>{reviewedBooks.length} reviews</span>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="border-t bg-muted/20 flex justify-between">
              <Button variant="outline" onClick={() => navigate('/')}>Browse Books</Button>
              <Button variant="destructive" onClick={logout}>Sign Out</Button>
            </CardFooter>
          </Card>
          
          <Tabs defaultValue="read" className="w-full">
            <TabsList className="w-full max-w-md mx-auto grid grid-cols-2 mb-8">
              <TabsTrigger value="read" className="flex items-center gap-2">
                <BookOpen size={16} />
                <span>Books Read</span>
              </TabsTrigger>
              <TabsTrigger value="reviews" className="flex items-center gap-2">
                <Star size={16} />
                <span>Reviews</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="read" className="animate-fade-in">
              {isLoading ? (
                <div className="text-center py-12">
                  <p>Loading your books...</p>
                </div>
              ) : readBooks.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {readBooks.map((interaction) => (
                    <div key={interaction.bookKey} className="relative group">
                      <div className="book-card">
                        <Link 
                          to={`/book${interaction.bookKey}`} 
                          className="block"
                        >
                          <div className="aspect-[2/3] bg-gray-100 rounded-lg flex items-center justify-center">
                            <Library size={48} className="text-gray-300" />
                          </div>
                          <div className="mt-2">
                            <h3 className="font-medium line-clamp-1">
                              {interaction.bookKey.split('/').pop().replace(/_/g, ' ')}
                            </h3>
                            <p className="text-xs text-muted-foreground">
                              Added on {new Date(interaction.dateAdded).toLocaleDateString()}
                            </p>
                          </div>
                        </Link>
                      </div>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="destructive" 
                            size="icon" 
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Remove this book?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will remove the book from your reading list and delete any associated reviews.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleRemoveBook(interaction.bookKey)}
                            >
                              Remove
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium mb-2">No books yet</h3>
                  <p className="text-muted-foreground mb-6">You haven't added any books to your reading list yet.</p>
                  <Button onClick={() => navigate('/')}>Discover Books</Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="reviews" className="animate-fade-in">
              {isLoading ? (
                <div className="text-center py-12">
                  <p>Loading your reviews...</p>
                </div>
              ) : reviewedBooks.length > 0 ? (
                <div className="space-y-6">
                  {reviewedBooks.map((interaction) => (
                    <Card key={interaction.bookKey}>
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row gap-6">
                          <div className="md:w-1/4">
                            <Link to={`/book${interaction.bookKey}`}>
                              <div className="book-cover-shadow rounded-lg overflow-hidden w-40 h-60 mx-auto md:mx-0 bg-gray-100 flex items-center justify-center">
                                <Library size={48} className="text-gray-300" />
                              </div>
                            </Link>
                          </div>
                          
                          <div className="md:w-3/4">
                            <Link to={`/book${interaction.bookKey}`} className="hover:underline">
                              <h3 className="text-xl font-medium mb-2">
                                {interaction.bookKey.split('/').pop().replace(/_/g, ' ')}
                              </h3>
                            </Link>
                            
                            <div className="flex items-center mb-4">
                              {interaction.rating && (
                                <div className="flex items-center mr-4">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star 
                                      key={star} 
                                      size={16} 
                                      className={interaction.rating >= star ? 'text-yellow-500 fill-current' : 'text-gray-300'} 
                                    />
                                  ))}
                                </div>
                              )}
                              
                              <span className="text-sm text-muted-foreground">
                                Reviewed on {new Date(interaction.dateAdded).toLocaleDateString()}
                              </span>
                            </div>
                            
                            <p className="text-foreground mb-4">{interaction.review}</p>
                            
                            <div className="flex justify-end">
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700">
                                    <Trash2 size={16} className="mr-2" />
                                    Delete Review
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete this review?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This action cannot be undone. The review will be permanently deleted.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction 
                                      onClick={() => handleRemoveBook(interaction.bookKey)}
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium mb-2">No reviews yet</h3>
                  <p className="text-muted-foreground mb-6">You haven't written any book reviews yet.</p>
                  <Button onClick={() => navigate('/')}>Find Books to Review</Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <footer className="py-6 bg-muted/30 border-t border-border mt-auto">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2023 Book Haven. Data provided by Open Library.</p>
        </div>
      </footer>
    </div>
  );
};

export default Profile;
