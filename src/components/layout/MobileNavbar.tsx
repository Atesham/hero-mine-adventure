// import React, { useState, useEffect } from 'react';
// import { Link, useLocation } from 'react-router-dom';
// import { cn } from '@/lib/utils';
// import { Home, Pickaxe, Wallet, MessageSquare, UserPlus } from 'lucide-react';
// import { useIsMobile } from '@/hooks/use-mobile';
// import { motion, useAnimation, AnimatePresence } from 'framer-motion';

// const MobileNavbar = () => {
//   const location = useLocation();
//   const isMobile = useIsMobile();
//   const [lastScrollY, setLastScrollY] = useState(0);
//   const [hidden, setHidden] = useState(false);
//   const controls = useAnimation();

//   const isActive = (path: string) => location.pathname === path;

//   useEffect(() => {
//     if (!isMobile || location.pathname === '/chat') return;

//     const handleScroll = () => {
//       const currentScrollY = window.scrollY;
//       const scrollingDown = currentScrollY > lastScrollY;
      
//       if (Math.abs(currentScrollY - lastScrollY) > 10) {
//         if (scrollingDown && currentScrollY > 30 && !hidden) {
//           setHidden(true);
//           controls.start("hidden");
//         } else if (!scrollingDown && hidden) {
//           setHidden(false);
//           controls.start("visible");
//         }
//       }
      
//       setLastScrollY(currentScrollY);
//     };

//     window.addEventListener('scroll', handleScroll, { passive: true });
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, [hidden, lastScrollY, controls, isMobile, location.pathname]);

//   const navLinks = [
//     { name: 'Home', path: '/', icon: Home },
//     { name: 'Mining', path: '/mining', icon: Pickaxe },
//     { name: 'Wallet', path: '/wallet', icon: Wallet },
//     { name: 'Chat', path: '/chat', icon: MessageSquare },
//     { name: 'Refer', path: '/referrals', icon: UserPlus },
//   ];

//   const variants = {
//     visible: { y: 0 },
//     hidden: { y: '100%' }
//   };

//   if (!isMobile || location.pathname === '/chat') return null;

//   return (
//     <AnimatePresence>
//       <motion.nav
//         initial="visible"
//         animate={controls}
//         variants={variants}
//         transition={{ 
//           type: 'spring', 
//           stiffness: 500,
//           damping: 30,
//           mass: 0.5
//         }}
//         className="md:hidden fixed bottom-0 left-0 right-0 z-50 px-2"
//       >
//         <div className="bg-background/95 backdrop-blur-lg border-t rounded-t-2xl shadow-lg">
//           <div className="flex justify-around items-center py-1.5">
//             {navLinks.map((link) => {
//               const Icon = link.icon;
//               return (
//                 <Link
//                   key={link.path}
//                   to={link.path}
//                   className={cn(
//                     'relative flex flex-col items-center w-full p-1 text-xs transition-all',
//                     isActive(link.path) ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
//                   )}
//                 >
//                   {isActive(link.path) && (
//                     <motion.span
//                       layoutId="mobile-nav-indicator"
//                       className="absolute -top-1 h-1 w-5 rounded-full bg-primary"
//                       transition={{ type: 'spring', stiffness: 500, damping: 30 }}
//                     />
//                   )}
//                   <div className={cn(
//                     'p-1.5 rounded-lg transition-colors',
//                     isActive(link.path) ? 'bg-primary/10' : 'hover:bg-muted/50'
//                   )}>
//                     <Icon className={cn(
//                       "h-[1.2rem] w-[1.2rem] transition-all",
//                       isActive(link.path) ? "stroke-[2.5px]" : "stroke-[2px]"
//                     )} />
//                   </div>
//                   <span className="mt-0.5 text-[0.7rem] font-medium">{link.name}</span>
//                 </Link>
//               );
//             })}
//           </div>
//         </div>
//       </motion.nav>
//     </AnimatePresence>
//   );
// };

// export default MobileNavbar;


import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Home, Pickaxe, Wallet, MessageSquare, UserPlus } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';

const MobileNavbar = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [lastScrollY, setLastScrollY] = useState(0);
  const [hidden, setHidden] = useState(false);
  const controls = useAnimation();

  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    if (!isMobile || location.pathname === '/chat') return;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollingDown = currentScrollY > lastScrollY;
      
      if (Math.abs(currentScrollY - lastScrollY) > 10) {
        if (scrollingDown && currentScrollY > 30 && !hidden) {
          setHidden(true);
          controls.start("hidden");
        } else if (!scrollingDown && hidden) {
          setHidden(false);
          controls.start("visible");
        }
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hidden, lastScrollY, controls, isMobile, location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Mining', path: '/mining', icon: Pickaxe },
    { name: 'Wallet', path: '/wallet', icon: Wallet },
    { name: 'Chat', path: '/chat', icon: MessageSquare },
    { name: 'Refer', path: '/referrals', icon: UserPlus },
  ];

  const variants = {
    visible: { y: 0 },
    hidden: { y: '100%' }
  };

  if (!isMobile || location.pathname === '/chat') return null;

  return (
    <AnimatePresence>
      <motion.nav
        initial="visible"
        animate={controls}
        variants={variants}
        transition={{ 
          type: 'spring', 
          stiffness: 500,
          damping: 30,
          mass: 0.5
        }}
        className="md:hidden fixed bottom-0 left-0 right-0 z-50"
      >
        <div className="bg-background/95 backdrop-blur-lg border-t shadow-lg rounded-tl-2xl rounded-tr-2xl">
          <div className="flex justify-around items-center py-1.5">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    'relative flex flex-col items-center w-full p-1 text-xs transition-all',
                    isActive(link.path) ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {isActive(link.path) && (
                    <motion.span
                      layoutId="mobile-nav-indicator"
                      className="absolute -top-1 h-1 w-5 rounded-full bg-primary"
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                  <div className={cn(
                    'p-1.5 rounded-lg transition-colors',
                    isActive(link.path) ? 'bg-primary/10' : 'hover:bg-muted/50'
                  )}>
                    <Icon className={cn(
                      "h-[1.2rem] w-[1.2rem] transition-all",
                      isActive(link.path) ? "stroke-[2.5px]" : "stroke-[2px]"
                    )} />
                  </div>
                  <span className="mt-0.5 text-[0.7rem] font-medium">{link.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </motion.nav>
    </AnimatePresence>
  );
};

export default MobileNavbar;