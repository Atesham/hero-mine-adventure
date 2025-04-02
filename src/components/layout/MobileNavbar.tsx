// import React from 'react';
// import { Link, useLocation } from 'react-router-dom';
// import { cn } from '@/lib/utils';
// import { Home, Pickaxe, Wallet, MessageSquare, UserPlus } from 'lucide-react';
// import { useIsMobile } from '@/hooks/use-mobile';
// import { motion } from 'framer-motion';

// const MobileNavbar = () => {
//   const location = useLocation();
//   const isMobile = useIsMobile();
  
//   if (!isMobile) return null;

//   const isActive = (path: string) => location.pathname === path;

//   const navLinks = [
//     { name: 'Home', path: '/', icon: Home },
//     { name: 'Mining', path: '/mining', icon: Pickaxe },
//     { name: 'Wallet', path: '/wallet', icon: Wallet },
//     { name: 'Chat', path: '/chat', icon: MessageSquare },
//     { name: 'Refer', path: '/referrals', icon: UserPlus },
//   ];

//   return (
//     <motion.nav 
//       initial={{ y: 100 }}
//       animate={{ y: 0 }}
//       transition={{ type: 'spring', stiffness: 300, damping: 30 }}
//       className="md:hidden fixed bottom-0 left-4 right-4 z-50"
//     >
//       <div className="bg-background/90 backdrop-blur-lg border rounded-xl shadow-lg p-1">
//         <div className="flex justify-around items-center">
//           {navLinks.map((link) => {
//             const Icon = link.icon;
//             return (
//               <Link
//                 key={link.path}
//                 to={link.path}
//                 className={cn(
//                   'relative flex flex-col items-center py-2 px-1 text-xs transition-all duration-200',
//                   isActive(link.path) ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
//                 )}
//               >
//                 {isActive(link.path) && (
//                   <motion.span
//                     layoutId="mobile-nav-indicator"
//                     className="absolute -top-1 h-1 w-6 rounded-full bg-primary"
//                     transition={{ type: 'spring', stiffness: 300, damping: 30 }}
//                   />
//                 )}
//                 <div className={cn(
//                   'p-2 rounded-lg transition-colors',
//                   isActive(link.path) ? 'bg-primary/10' : 'hover:bg-muted/50'
//                 )}>
//                   <Icon className={cn(
//                     "h-5 w-5 transition-all",
//                     isActive(link.path) ? "stroke-[2.5px]" : "stroke-[2px]"
//                   )} />
//                 </div>
//                 <span className="mt-1 font-medium">{link.name}</span>
//               </Link>
//             );
//           })}
//         </div>
//       </div>
//     </motion.nav>
//   );
// };

// export default MobileNavbar;


import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Home, Pickaxe, Wallet, MessageSquare, UserPlus } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { motion } from 'framer-motion';

const MobileNavbar = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  
  // Don't show navbar if not mobile or if on chat page
  if (!isMobile || location.pathname === '/chat') return null;

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Mining', path: '/mining', icon: Pickaxe },
    { name: 'Wallet', path: '/wallet', icon: Wallet },
    { name: 'Chat', path: '/chat', icon: MessageSquare },
    { name: 'Refer', path: '/referrals', icon: UserPlus },
  ];

  return (
    <motion.nav 
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="md:hidden fixed bottom-0 left-4 right-4 z-50"
    >
      <div className="bg-background/90 backdrop-blur-lg border rounded-xl shadow-lg p-1">
        <div className="flex justify-around items-center">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  'relative flex flex-col items-center py-2 px-1 text-xs transition-all duration-200',
                  isActive(link.path) ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {isActive(link.path) && (
                  <motion.span
                    layoutId="mobile-nav-indicator"
                    className="absolute -top-1 h-1 w-6 rounded-full bg-primary"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <div className={cn(
                  'p-2 rounded-lg transition-colors',
                  isActive(link.path) ? 'bg-primary/10' : 'hover:bg-muted/50'
                )}>
                  <Icon className={cn(
                    "h-5 w-5 transition-all",
                    isActive(link.path) ? "stroke-[2.5px]" : "stroke-[2px]"
                  )} />
                </div>
                <span className="mt-1 font-medium">{link.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </motion.nav>
  );
};

export default MobileNavbar;