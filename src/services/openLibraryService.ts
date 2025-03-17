
import { toast } from "@/components/ui/use-toast";

export interface Book {
  key: string;
  title: string;
  author_name?: string[];
  cover_i?: number;
  first_publish_year?: number;
  publisher?: string[];
  isbn?: string[];
  subject?: string[];
  rating?: number;
  description?: string;
}

interface SearchResponse {
  numFound: number;
  start: number;
  docs: Book[];
}

// Helper function to get book cover URL
export const getCoverUrl = (coverId: number | undefined, size: 'S' | 'M' | 'L' = 'M') => {
  if (!coverId) return 'https://via.placeholder.com/180x270?text=No+Cover';
  
  const sizeMap = {
    'S': '-S.jpg',
    'M': '-M.jpg',
    'L': '-L.jpg'
  };
  
  return `https://covers.openlibrary.org/b/id/${coverId}${sizeMap[size]}`;
};

// Search for books
export const searchBooks = async (query: string, page = 1, limit = 10): Promise<{ books: Book[], totalResults: number }> => {
  try {
    if (!query.trim()) {
      return { books: [], totalResults: 0 };
    }
    
    const offset = (page - 1) * limit;
    const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data: SearchResponse = await response.json();
    
    return {
      books: data.docs,
      totalResults: data.numFound
    };
  } catch (error) {
    console.error('Error searching books:', error);
    toast({
      title: "Search failed",
      description: "Failed to fetch books. Please try again later.",
      variant: "destructive",
    });
    return { books: [], totalResults: 0 };
  }
};

// Get book details by key
export const getBookDetails = async (key: string): Promise<Book | null> => {
  try {
    const response = await fetch(`https://openlibrary.org${key}.json`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Fetch additional author information if available
    let authorData = null;
    if (data.authors && data.authors.length > 0 && data.authors[0].author) {
      const authorResponse = await fetch(`https://openlibrary.org${data.authors[0].author.key}.json`);
      if (authorResponse.ok) {
        authorData = await authorResponse.json();
      }
    }
    
    // Fetch description if not present and work key is available
    let description = data.description;
    if (!description && data.works && data.works.length > 0) {
      const workResponse = await fetch(`https://openlibrary.org${data.works[0].key}.json`);
      if (workResponse.ok) {
        const workData = await workResponse.json();
        description = workData.description || null;
      }
    }
    
    // Format description if it's an object
    if (description && typeof description === 'object' && description.value) {
      description = description.value;
    }
    
    return {
      ...data,
      key: key,
      author_name: authorData ? [authorData.name] : undefined,
      description: description || undefined
    };
  } catch (error) {
    console.error('Error fetching book details:', error);
    toast({
      title: "Failed to load book details",
      description: "We couldn't fetch the details for this book. Please try again later.",
      variant: "destructive",
    });
    return null;
  }
};

// Get similar books based on subject, author, or other metadata
export const getSimilarBooks = async (book: Book): Promise<Book[]> => {
  try {
    if (!book.subject || book.subject.length === 0) {
      return [];
    }
    
    // Use the first few subjects to find similar books
    const subject = book.subject.slice(0, 2).join(' OR ');
    const authorFilter = book.author_name && book.author_name.length > 0 
      ? `&author=${encodeURIComponent(book.author_name[0])}`
      : '';
    
    const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(subject)}${authorFilter}&limit=6`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data: SearchResponse = await response.json();
    
    // Filter out the original book and return only unique results
    return data.docs
      .filter(similar => similar.key !== book.key)
      .slice(0, 5);
  } catch (error) {
    console.error('Error fetching similar books:', error);
    toast({
      title: "Failed to load recommendations",
      description: "We couldn't fetch book recommendations. Please try again later.",
      variant: "destructive",
    });
    return [];
  }
};

// Popular and trending books - for the homepage
export const getTrendingBooks = async (): Promise<Book[]> => {
  try {
    const queries = [
      'subject:bestseller',
      'subject:popular',
      'subject:fiction'
    ];
    
    const query = queries[Math.floor(Math.random() * queries.length)];
    const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=10`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data: SearchResponse = await response.json();
    
    return data.docs;
  } catch (error) {
    console.error('Error fetching trending books:', error);
    toast({
      title: "Failed to load trending books",
      description: "We couldn't fetch trending books. Please try again later.",
      variant: "destructive",
    });
    return [];
  }
};

// Mock local storage for user book ratings, reviews, and read status
export interface UserBookInteraction {
  bookKey: string;
  rating?: number;
  review?: string;
  hasRead: boolean;
  dateAdded: string;
}

export const getUserBookInteractions = (): UserBookInteraction[] => {
  const interactions = localStorage.getItem('userBookInteractions');
  return interactions ? JSON.parse(interactions) : [];
};

export const saveUserBookInteraction = (interaction: UserBookInteraction): void => {
  const interactions = getUserBookInteractions();
  const existingIndex = interactions.findIndex(i => i.bookKey === interaction.bookKey);
  
  if (existingIndex >= 0) {
    interactions[existingIndex] = {
      ...interactions[existingIndex],
      ...interaction
    };
  } else {
    interactions.push(interaction);
  }
  
  localStorage.setItem('userBookInteractions', JSON.stringify(interactions));
};

export const getUserBookInteraction = (bookKey: string): UserBookInteraction | undefined => {
  const interactions = getUserBookInteractions();
  return interactions.find(i => i.bookKey === bookKey);
};

export const removeUserBookInteraction = (bookKey: string): void => {
  const interactions = getUserBookInteractions();
  const filteredInteractions = interactions.filter(i => i.bookKey !== bookKey);
  localStorage.setItem('userBookInteractions', JSON.stringify(filteredInteractions));
};
