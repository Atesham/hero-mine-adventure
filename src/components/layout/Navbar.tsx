
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Menu, X, Moon, Sun, Wallet, BarChart, Pickaxe, LogOut, LogIn, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
      closeMobileMenu();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Mining', path: '/mining', icon: <Pickaxe className="h-4 w-4 mr-1" /> },
    { name: 'Wallet', path: '/wallet', icon: <Wallet className="h-4 w-4 mr-1" /> },
    { name: 'Leaderboard', path: '/leaderboard', icon: <BarChart className="h-4 w-4 mr-1" /> },
  ];

  return (
    <header
      className={cn(
        'fixed w-full top-0 z-50 transition-all duration-300 px-4 md:px-6',
        isScrolled ? 'py-2 bg-background/80 backdrop-blur-lg border-b' : 'py-4'
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link 
          to="/" 
          className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70 transition-all"
          onClick={closeMobileMenu}
        >
          HeroCoin
        </Link>
        
        <nav className="hidden md:flex items-center space-x-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center',
                isActive(link.path)
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-secondary'
              )}
            >
              {link.icon && link.icon}
              {link.name}
            </Link>
          ))}
        </nav>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={toggleTheme}
          >
            {theme === 'light' ? (
              <Moon className="h-5 w-5 transition-all" />
            ) : (
              <Sun className="h-5 w-5 transition-all" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden rounded-full"
            onClick={toggleMobileMenu}
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
            <span className="sr-only">Toggle menu</span>
          </Button>
          
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="rounded-full">
                  <User className="h-5 w-5 mr-2" />
                  <span className="hidden md:inline-block truncate max-w-[100px]">
                    {user.displayName || user.email?.split('@')[0]}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/wallet">
                    <Wallet className="h-4 w-4 mr-2" />
                    Wallet
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/mining">
                    <Pickaxe className="h-4 w-4 mr-2" />
                    Mining
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Log Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              asChild
              className="hidden md:flex rounded-full"
              size="sm"
            >
              <Link to="/login">
                <LogIn className="h-4 w-4 mr-1" />
                Sign In
              </Link>
            </Button>
          )}
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 w-full px-4 py-3 bg-background/95 backdrop-blur-lg border-b md:hidden animate-fade-in">
          <div className="flex flex-col space-y-1 max-w-7xl mx-auto">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  'px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center',
                  isActive(link.path)
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-secondary'
                )}
                onClick={closeMobileMenu}
              >
                {link.icon && link.icon}
                {link.name}
              </Link>
            ))}
            
            {user ? (
              <Button
                variant="outline"
                className="w-full mt-2 rounded-full justify-start"
                size="sm"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Log Out
              </Button>
            ) : (
              <Button
                asChild
                className="w-full mt-2 rounded-full"
                size="sm"
              >
                <Link to="/login" onClick={closeMobileMenu}>
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign In
                </Link>
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
