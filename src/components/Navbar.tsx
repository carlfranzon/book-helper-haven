
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, User, LogOut, Menu, X } from 'lucide-react';
import { AuthModal } from './AuthModal';

const Navbar = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-serif font-bold tracking-tight">Book Haven</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-sm font-medium transition-colors hover:text-primary">
              Home
            </Link>
            <Link to="/explore" className="text-sm font-medium transition-colors hover:text-primary">
              Explore
            </Link>
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Search"
            >
              <Search size={20} />
            </button>

            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/profile" 
                  className="flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary"
                >
                  <User size={20} />
                  <span>{user?.name}</span>
                </Link>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={logout}
                  aria-label="Logout"
                >
                  <LogOut size={20} />
                </Button>
              </div>
            ) : (
              // Using Button instead of directly using AuthModal component
              <Button variant="default" onClick={() => {}}>
                Sign In
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 animate-slide-down">
          <div className="container mx-auto px-4 py-4 space-y-4">
            <Link 
              to="/" 
              className="block py-2 text-sm font-medium transition-colors hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/explore" 
              className="block py-2 text-sm font-medium transition-colors hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Explore
            </Link>
            <button 
              onClick={() => {
                setIsSearchOpen(true);
                setIsMenuOpen(false);
              }}
              className="flex items-center space-x-2 py-2 text-sm font-medium transition-colors hover:text-primary w-full"
            >
              <Search size={18} />
              <span>Search</span>
            </button>

            {isAuthenticated ? (
              <>
                <Link 
                  to="/profile" 
                  className="flex items-center space-x-2 py-2 text-sm font-medium transition-colors hover:text-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User size={18} />
                  <span>{user?.name}</span>
                </Link>
                <button 
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center space-x-2 py-2 text-sm font-medium transition-colors hover:text-primary w-full"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              // Using Button instead of directly using AuthModal component in mobile menu
              <Button 
                variant="default" 
                className="w-full justify-center"
                onClick={() => {
                  setIsMenuOpen(false);
                }}
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Search Dialog */}
      <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Search Books</DialogTitle>
            <DialogDescription>
              Find books by title, author, or subject
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search query</Label>
              <div className="flex space-x-2">
                <Input
                  id="search"
                  placeholder="Type book title, author, or subject..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1"
                  autoFocus
                />
                <Button type="submit">Search</Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </nav>
  );
};

export default Navbar;
