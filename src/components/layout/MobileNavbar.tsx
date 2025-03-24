
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Home, Pickaxe, Wallet, BarChart, UserPlus } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const MobileNavbar = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  
  if (!isMobile) return null;

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { name: 'Home', path: '/', icon: <Home className="h-5 w-5" /> },
    { name: 'Mining', path: '/mining', icon: <Pickaxe className="h-5 w-5" /> },
    { name: 'Wallet', path: '/wallet', icon: <Wallet className="h-5 w-5" /> },
    { name: 'Refer', path: '/referrals', icon: <UserPlus className="h-5 w-5" /> },
    { name: 'Leaderboard', path: '/leaderboard', icon: <BarChart className="h-5 w-5" /> },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-t">
      <div className="flex justify-between items-center px-2">
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={cn(
              'flex flex-col items-center py-3 px-2 text-xs',
              isActive(link.path)
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {link.icon}
            <span className="mt-1">{link.name}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default MobileNavbar;