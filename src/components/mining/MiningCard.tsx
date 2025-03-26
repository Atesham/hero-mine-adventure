// import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
// import { Button } from '@/components/ui/button';
// import { Progress } from '@/components/ui/progress';
// import { PlayCircle, Clock, Loader2, Coins, LogIn } from 'lucide-react';
// import { toast } from 'sonner';
// import { useAuth } from '@/contexts/AuthContext';
// import { Link } from 'react-router-dom';
// import { doc, getDoc, setDoc, updateDoc, serverTimestamp, increment, collection, addDoc } from 'firebase/firestore';
// import { db } from '@/lib/firebase';
// import { useAdSense } from '@/hooks/useAdLoader';

// const MiningCard = () => {
//   const [isMining, setIsMining] = useState(false);
//   const [progress, setProgress] = useState(0);
//   const [timeRemaining, setTimeRemaining] = useState<null | number>(null);
//   const [adWatched, setAdWatched] = useState(0);
//   const resizeObserverRef = useRef<ResizeObserver>();

//   const { user } = useAuth();
//   const [showAd, setShowAd] = useState(false);
//   const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

//   // Refs
//   const adContainerRef = useRef<HTMLDivElement>(null);
//   const mountedRef = useRef(true);

//   const adRetryTimeoutRef = useRef<NodeJS.Timeout>();
//   const adTimeoutRef = useRef<NodeJS.Timeout>();
//   const currentAdRef = useRef<HTMLElement | null>(null);




//   useAdSense(showAd);

//   useEffect(() => {
//     if (!user) return;

//     // Check cooldown from Firestore
//     const checkCooldown = async () => {
//       try {
//         const userRef = doc(db, 'users', user.uid);
//         const userDoc = await getDoc(userRef);

//         if (userDoc.exists()) {
//           const userData = userDoc.data();
//           const lastMiningTime = userData.lastMiningTime?.toDate();

//           if (lastMiningTime) {
//             const cooldownEnd = new Date(lastMiningTime.getTime() + (12 * 60 * 60 * 1000)); // 12 hours cooldown
//             const now = new Date();

//             if (cooldownEnd > now) {
//               // Still in cooldown
//               setTimeRemaining(Math.ceil((cooldownEnd.getTime() - now.getTime()) / 1000));
//             }
//           }
//         } else {
//           // Create user document if it doesn't exist
//           await setDoc(userRef, {
//             displayName: user.displayName || user.email?.split('@')[0],
//             email: user.email,
//             coins: 0,
//             totalMined: 0,
//             createdAt: serverTimestamp(),
//           });
//         }
//       } catch (error) {
//         console.error('Error checking cooldown:', error);
//       }
//     };

//     checkCooldown();
//   }, [user]);

//   useEffect(() => {
//     let interval: NodeJS.Timeout;

//     if (isMining) {
//       interval = setInterval(() => {
//         setProgress((prev) => {
//           const newProgress = prev + 1;
//           if (newProgress >= 100) {
//             clearInterval(interval);
//             setIsMining(false);
//             setAdWatched((prev) => prev + 1);

//             if (adWatched === 1) {
//               // Both ads watched, mining complete
//               handleMiningComplete();
//             } else {
//               toast.success('First ad completed!', {
//                 description: 'Watch one more ad to complete mining'
//               });
//             }
//             return 0;
//           }
//           return newProgress;
//         });
//       }, 50);
//     }

//     return () => {
//       if (interval) clearInterval(interval);
//     };
//   }, [isMining, adWatched]);

//   useEffect(() => {
//     let interval: NodeJS.Timeout;

//     if (timeRemaining && timeRemaining > 0) {
//       interval = setInterval(() => {
//         setTimeRemaining((prev) => {
//           if (prev === null || prev <= 1) {
//             clearInterval(interval);
//             setTimeRemaining(null);
//             return null;
//           }
//           return prev - 1;
//         });
//       }, 1000);
//     }

//     return () => {
//       if (interval) clearInterval(interval);
//     };
//   }, [timeRemaining]);

//   const formatTimeRemaining = () => {
//     if (timeRemaining === null) return '';

//     const hours = Math.floor(timeRemaining / 3600);
//     const minutes = Math.floor((timeRemaining % 3600) / 60);
//     const seconds = timeRemaining % 60;

//     return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
//   };


//   const startMining = () => {
//     setShowAd(false);
//     setAdAttempts(0);
//     setAdError(false);
//     setAdLoaded(false);
//     setContainerReady(false);

//     setTimeout(() => {
//       if (mountedRef.current) {
//         setShowAd(true);
//       }
//     }, 100);
//   };



//   const handleMiningComplete = async () => {
//     if (!user) return;

//     try {
//       // Generate random coin reward (5-15 coins)
//       const randomCoins = Math.floor(Math.random() * 11) + 5;

//       // Update user's coin balance and set cooldown
//       const userRef = doc(db, 'users', user.uid);
//       await updateDoc(userRef, {
//         coins: increment(randomCoins),
//         totalMined: increment(randomCoins),
//         lastMiningTime: serverTimestamp()
//       });

//       // Add transaction record
//       await addDoc(collection(db, 'transactions'), {
//         userId: user.uid,
//         type: 'reward',
//         amount: randomCoins,
//         timestamp: serverTimestamp(),
//         description: 'Mining Reward'
//       });

//       // Set cooldown (12 hours)
//       const cooldownDuration = 12 * 60 * 60; // 12 hours in seconds
//       setTimeRemaining(cooldownDuration);
//       setAdWatched(0);

//       // Show success notification
//       toast.success(`Mining successful!`, {
//         description: `You've earned ${randomCoins} Hero Coins`
//       });
//     } catch (error) {
//       console.error('Error updating mining rewards:', error);
//       toast.error('Failed to update mining rewards');
//     }
//   };

//   // If user is not logged in, show login prompt
//   if (!user) {
//     return (
//       <div className="w-full max-w-md mx-auto">
//         <div className="glass-card rounded-3xl p-8 shadow-lg text-center">
//           <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
//             <Coins className="w-8 h-8 text-primary" />
//           </div>
//           <h2 className="text-2xl font-bold mb-2">Login Required</h2>
//           <p className="text-muted-foreground mb-6">
//             You need to be logged in to start mining Hero Coins
//           </p>

//           <Button asChild className="rounded-xl">
//             <Link to="/login">
//               <LogIn className="mr-2 h-5 w-5" />
//               Log In to Start Mining
//             </Link>
//           </Button>
//         </div>
//       </div>
//     );
//   }

//   // Track container size
//   useLayoutEffect(() => {
//     if (!adContainerRef.current || !showAd) return;

//     const observer = new ResizeObserver((entries) => {
//       const { width, height } = entries[0].contentRect;
//       if (width > 0 && height > 0) {
//         setContainerSize({ width, height });
//       }
//     });

//     observer.observe(adContainerRef.current);
//     resizeObserverRef.current = observer;

//     return () => {
//       if (resizeObserverRef.current) {
//         resizeObserverRef.current.disconnect();
//       }
//     };
//   }, [showAd]);


//   const [adError, setAdError] = useState(false);
//   const [adLoaded, setAdLoaded] = useState(false);
//   const [adAttempts, setAdAttempts] = useState(0);
//   const [containerReady, setContainerReady] = useState(false);

//   // Debug function
//   const logAdState = (message: string, extra = {}) => {
//     console.log(`[AdDebug] ${message}`, {
//       showAd,
//       adLoaded,
//       adError,
//       adAttempts,
//       containerReady,
//       hasAd: !!currentAdRef.current,
//       ...extra
//     });
//   };

// // Cleanup function
// const cleanupAd = () => {
//   if (adTimeoutRef.current) {
//     clearTimeout(adTimeoutRef.current);
//     adTimeoutRef.current = undefined;
//   }
  
//   if (currentAdRef.current && adContainerRef.current?.contains(currentAdRef.current)) {
//     adContainerRef.current.removeChild(currentAdRef.current);
//   }
//   currentAdRef.current = null;
// };

//    // Track container size
//    useLayoutEffect(() => {
//     if (!adContainerRef.current || !showAd) return;

//     const observer = new ResizeObserver((entries) => {
//       const { width, height } = entries[0].contentRect;
//       if (width > 0 && height > 0) {
//         setContainerSize({ width, height });
//       }
//     });

//     observer.observe(adContainerRef.current);
//     resizeObserverRef.current = observer;

//     return () => {
//       observer.disconnect();
//     };
//   }, [showAd]);



//   // Track container readiness
//   useLayoutEffect(() => {
//     if (!adContainerRef.current || !showAd) {
//       setContainerReady(false);
//       return;
//     }

//     const observer = new ResizeObserver((entries) => {
//       const { width, height } = entries[0].contentRect;
//       if (width > 50 && height > 50 && mountedRef.current) {
//         setContainerReady(true);
//       }
//     });

//     observer.observe(adContainerRef.current);

//     return () => {
//       observer.disconnect();
//       mountedRef.current = false;
//     };
//   }, [showAd]);


//   // Effect to handle ad loading
//   useEffect(() => {
//     mountedRef.current = true;
    
//     return () => {
//       mountedRef.current = false;
//       cleanupAd();
//     };
//   }, []);

//  // Main ad loading effect
//  useEffect(() => {
//   if (!showAd || !containerReady) {
//     cleanupAd();
//     return;
//   }

//   logAdState('Effect triggered', { containerReady });

//   if (adAttempts >= 3) {
//     logAdState('Max attempts reached');
//     setAdError(true);
//     return;
//   }

//   const loadAd = () => {
//     try {
//       if (!window.adsbygoogle) {
//         throw new Error('AdSense script not loaded');
//       }

//       cleanupAd();

//       const adElement = document.createElement('ins');
//       adElement.className = 'adsbygoogle';
//       adElement.style.display = 'block';
//       adElement.style.width = '100%';
//       adElement.style.minWidth = '300px';
//       adElement.style.height = '250px';
//       adElement.dataset.adClient = 'ca-pub-5478626290073215';
//       adElement.dataset.adSlot = '7643212953';
//       adElement.dataset.adFormat = 'auto';
//       adElement.dataset.fullWidthResponsive = 'true';

//       adContainerRef.current?.appendChild(adElement);
//       currentAdRef.current = adElement;

//       logAdState('Pushing new ad');
//       (window.adsbygoogle = window.adsbygoogle || []).push({});

//       adTimeoutRef.current = setTimeout(() => {
//         if (!mountedRef.current) return;
        
//         const status = adElement.getAttribute('data-adsbygoogle-status');
//         logAdState('Ad status check', { status });

//         if (status === 'done') {
//           logAdState('Ad loaded successfully');
//           setAdLoaded(true);
//           setAdError(false);
//         } else {
//           logAdState('Ad failed to load');
//           setAdError(true);
//           setAdAttempts(prev => prev + 1);
//           cleanupAd();
//         }
//       }, 3000);

//     } catch (err) {
//       logAdState(`Error: ${err.message}`);
//       setAdError(true);
//       setAdAttempts(prev => prev + 1);
//       cleanupAd();
//     }
//   };

//   adTimeoutRef.current = setTimeout(loadAd, 100);

//   return cleanupAd;
// }, [showAd, adAttempts, containerReady]);

//   return (
//     <div className="w-full max-w-md mx-auto">
//       <div className="glass-card rounded-3xl p-8 shadow-lg">
//         <div className="text-center mb-6">
//           <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
//             <Coins className="w-8 h-8 text-primary" />
//           </div>
//           <h2 className="text-2xl font-bold">Hero Coin Mining</h2>
//           <p className="text-muted-foreground mt-2">
//             Watch ads to earn Hero Coins
//           </p>
//         </div>

//         return (
//         <div className="w-full max-w-md mx-auto">
//           <div className="glass-card rounded-3xl p-8 shadow-lg">

        


//           {showAd && (
//           <div
//             ref={adContainerRef}
//             className="my-4 min-h-[250px] flex items-center justify-center w-full bg-gray-50 rounded-lg"
//             style={{ minWidth: '300px' }}
//             key={`ad-container-${adAttempts}`}
//           >
//             {adError ? (
//               <div className="text-center p-4">
//                 <p className="text-red-600">
//                   {adAttempts >= 3 ? 'Ad loading failed' : 'Error loading ad'}
//                 </p>
//                 {adAttempts < 3 && (
//                   <button
//                     onClick={() => setAdAttempts(prev => prev + 1)}
//                     className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
//                   >
//                     Try Again
//                   </button>
//                 )}
//               </div>
//             ) : !adLoaded ? (
//               <div className="text-center">
//                 <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
//                 <p className="mt-2">Loading advertisement</p>
//                 {!containerReady && (
//                   <p className="text-sm text-gray-500 mt-1">Preparing container...</p>
//                 )}
//               </div>
//             ) : null}
//           </div>
//         )}



//           </div>
//         </div>
//         );
//         <div className="space-y-6">
//           {/* Mining progress */}
//           {isMining && (
//             <div className="space-y-3">
//               <div className="flex items-center justify-between text-sm">
//                 <span>Mining progress</span>
//                 <span>{progress}%</span>
//               </div>
//               <Progress value={progress} className="h-2" />
//             </div>
//           )}

//           {/* Ads watched counter */}
//           <div className="bg-secondary/50 rounded-xl p-4">
//             <div className="flex items-center justify-between">
//               <span className="text-sm font-medium">Ads Watched</span>
//               <span className="text-sm font-semibold">{adWatched}/2</span>
//             </div>
//           </div>

//           {/* Cooldown timer */}
//           {timeRemaining !== null && (
//             <div className="bg-secondary/50 rounded-xl p-4">
//               <div className="flex items-center mb-2">
//                 <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
//                 <span className="text-sm font-medium">Next mining available in:</span>
//               </div>
//               <div className="text-2xl font-mono text-center font-bold">
//                 {formatTimeRemaining()}
//               </div>
//             </div>
//           )}

//           {/* Start mining button */}
//           <Button
//             className="w-full rounded-xl py-6 text-lg font-medium"
//             disabled={isMining || timeRemaining !== null}
//             onClick={startMining}
//           >
//             {isMining ? (
//               <>
//                 <Loader2 className="mr-2 h-5 w-5 animate-spin" />
//                 Mining...
//               </>
//             ) : timeRemaining !== null ? (
//               <>
//                 <Clock className="mr-2 h-5 w-5" />
//                 Cooling Down
//               </>
//             ) : (
//               <>
//                 <PlayCircle className="mr-2 h-5 w-5" />
//                 Start Mining
//               </>
//             )}
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// };
// export default MiningCard;



import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { PlayCircle, Clock, Loader2, Coins, LogIn, X } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp, increment, collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const MiningCard = () => {
  const [isMining, setIsMining] = useState(false);
  const [progress, setProgress] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [adWatched, setAdWatched] = useState(0);
  const [showAdPage, setShowAdPage] = useState(false);
  const [canCloseAd, setCanCloseAd] = useState(false);
  const [adError, setAdError] = useState(false);
  const [adLoading, setAdLoading] = useState(false);
  
  const adContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Check cooldown on mount
  useEffect(() => {
    if (!user) return;

    const checkCooldown = async () => {
      try {
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          const lastMiningTime = userData.lastMiningTime?.toDate();

          if (lastMiningTime) {
            const cooldownEnd = new Date(lastMiningTime.getTime() + (12 * 60 * 60 * 1000));
            const now = new Date();

            if (cooldownEnd > now) {
              setTimeRemaining(Math.ceil((cooldownEnd.getTime() - now.getTime()) / 1000));
            }
          }
        } else {
          await setDoc(userRef, {
            displayName: user.displayName || user.email?.split('@')[0],
            email: user.email,
            coins: 0,
            totalMined: 0,
            createdAt: serverTimestamp(),
          });
        }
      } catch (error) {
        console.error('Error checking cooldown:', error);
      }
    };

    checkCooldown();
  }, [user]);

  // Handle cooldown timer
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (timeRemaining && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev === null || prev <= 1) {
            clearInterval(interval);
            return null;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timeRemaining]);

 // Load AdSense ad with flexible container
//  useEffect(() => {
//   if (!showAdPage || !user) return;

//   const loadAd = () => {
//     setAdLoading(true);
//     setAdError(false);
//     setCanCloseAd(false);

//     // Ensure container has dimensions
//     if (adContainerRef.current) {
//       adContainerRef.current.style.minHeight = '250px';
//       adContainerRef.current.style.width = '100%';
//       adContainerRef.current.style.maxWidth = '100vw';
//     }

//     try {
//       // Clear previous ad if exists
//       if (adContainerRef.current) {
//         adContainerRef.current.innerHTML = '';
//       }

//       // Create flexible ad element
//       const adElement = document.createElement('ins');
//       adElement.className = 'adsbygoogle';
//       adElement.style.display = 'block';
      
//       // Use fluid ad size for maximum flexibility
//       adElement.dataset.adClient = 'ca-pub-5478626290073215';
//       adElement.dataset.adSlot = '7643212953';
//       adElement.dataset.adFormat = 'fluid';
//       adElement.dataset.adLayoutKey = '-gw-3+1f-3k+5z';
//       adElement.dataset.fullWidthResponsive = 'true';
// // For rectangle ads:
// adElement.dataset.adFormat = 'rectangle';
// adElement.style.width = '300px';
// adElement.style.height = '250px';

// // For vertical banners:
// adElement.dataset.adFormat = 'vertical';
// adElement.style.width = '120px';
// adElement.style.height = '600px';
//       if (adContainerRef.current) {
//         adContainerRef.current.appendChild(adElement);
//       }

//       // Push ad with error handling
//       const pushAd = () => {
//         try {
//           (window.adsbygoogle = window.adsbygoogle || []).push({});
//         } catch (e) {
//           console.error('Ad push error:', e);
//           setAdError(true);
//           setAdLoading(false);
//         }
//       };

//       // Small delay to ensure container is rendered
//       setTimeout(pushAd, 100);

//       // Allow closing after 30 seconds
//       const closeTimer = setTimeout(() => {
//         setCanCloseAd(true);
//         setAdLoading(false);
//       }, 30000);

//       return () => clearTimeout(closeTimer);

//     } catch (error) {
//       console.error('Error loading ad:', error);
//       setAdError(true);
//       setAdLoading(false);
//     }
//   };

//   const timer = setTimeout(loadAd, 300); // Slight delay to ensure container is ready

//   return () => {
//     clearTimeout(timer);
//     if (adContainerRef.current) {
//       adContainerRef.current.innerHTML = '';
//     }
//   };
// }, [showAdPage, user]);


const loadAd = () => {
  setAdLoading(true);
  setAdError(false);
  setCanCloseAd(false);

  // Ensure container exists and has dimensions
  if (!adContainerRef.current) {
    setAdError(true);
    setAdLoading(false);
    return;
  }

  // Set container styles
  adContainerRef.current.style.minHeight = '250px';
  adContainerRef.current.style.width = '100%';
  adContainerRef.current.style.maxWidth = '100vw';
  adContainerRef.current.innerHTML = '';

  try {
    // Create ad element - Choose ONE format (recommended: auto/fluid)
    const adElement = document.createElement('ins');
    adElement.className = 'adsbygoogle';
    adElement.style.display = 'block';
    
    // ===== RECOMMENDED CONFIG =====
    // For responsive ads (best for React apps)
    adElement.dataset.adClient = 'ca-pub-5478626290073215'; // Your real publisher ID
    adElement.dataset.adSlot = '7643212953'; // Your real slot ID
    adElement.dataset.adFormat = 'auto';
    adElement.dataset.fullWidthResponsive = 'true';

    // ===== ALTERNATIVE FORMATS =====
    // For fixed size ads (uncomment only one)
    // adElement.dataset.adFormat = 'rectangle';
    // adElement.style.width = '300px';
    // adElement.style.height = '250px';
    
    // OR for vertical banners:
    // adElement.dataset.adFormat = 'vertical';
    // adElement.style.width = '120px';
    // adElement.style.height = '600px';

    adContainerRef.current.appendChild(adElement);

    // Push ad with better error handling
    const pushAd = () => {
      try {
        if (!window.adsbygoogle) {
          throw new Error('AdSense script not loaded');
        }
        
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        
        // Verify ad loaded
        setTimeout(() => {
          const adStatus = adElement.getAttribute('data-adsbygoogle-status');
          if (adStatus !== 'done' && !canCloseAd) {
            setAdError(true);
            setAdLoading(false);
          }
        }, 2000);
      } catch (e) {
        console.error('Ad push error:', e);
        setAdError(true);
        setAdLoading(false);
      }
    };

    // Delay to ensure container stability
    const adLoadTimeout = setTimeout(pushAd, 150);

    // Allow closing after 30 seconds (minimum ad duration)
    const closeTimer = setTimeout(() => {
      setCanCloseAd(true);
      setAdLoading(false);
    }, 30000);

    return () => {
      clearTimeout(adLoadTimeout);
      clearTimeout(closeTimer);
    };

  } catch (error) {
    console.error('Ad creation error:', error);
    setAdError(true);
    setAdLoading(false);
  }
};

// Load ad with cleanup
const timer = setTimeout(() => {
  if (showAdPage && user) {
    loadAd();
  }
}, 300);

return () => {
  clearTimeout(timer);
  if (adContainerRef.current) {
    adContainerRef.current.innerHTML = '';
  }
};

  const startMining = () => {
    if (adWatched >= 2) return;
    setShowAdPage(true);
  };

  const handleAdComplete = () => {
    setShowAdPage(false);
    setAdWatched(prev => prev + 1);

    if (adWatched + 1 >= 2) {
      handleMiningComplete();
    } else {
      toast.info('Ad completed!', {
        description: 'Watch one more ad to complete mining'
      });
    }
  };

  const handleMiningComplete = async () => {
    if (!user) return;

    try {
      const randomCoins = Math.floor(Math.random() * 11) + 5; // 5-15 coins

      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        coins: increment(randomCoins),
        totalMined: increment(randomCoins),
        lastMiningTime: serverTimestamp()
      });

      await addDoc(collection(db, 'transactions'), {
        userId: user.uid,
        type: 'reward',
        amount: randomCoins,
        timestamp: serverTimestamp(),
        description: 'Mining Reward'
      });

      // Set 12 hour cooldown
      setTimeRemaining(12 * 60 * 60);
      setAdWatched(0);
      
      toast.success(`Mining successful!`, {
        description: `You've earned ${randomCoins} Hero Coins`
      });
    } catch (error) {
      console.error('Error updating mining rewards:', error);
      toast.error('Failed to update mining rewards');
    }
  };

  const formatTimeRemaining = () => {
    if (timeRemaining === null) return '';

    const hours = Math.floor(timeRemaining / 3600);
    const minutes = Math.floor((timeRemaining % 3600) / 60);
    const seconds = timeRemaining % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!user) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="glass-card rounded-3xl p-8 shadow-lg text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Coins className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Login Required</h2>
          <p className="text-muted-foreground mb-6">
            You need to be logged in to start mining Hero Coins
          </p>
          <Button asChild className="rounded-xl">
            <Link to="/login">
              <LogIn className="mr-2 h-5 w-5" />
              Log In to Start Mining
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  if (showAdPage) {
    return (
      <div className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-4xl bg-white rounded-lg overflow-hidden flex flex-col">
          {/* Close button (only visible when ad is complete) */}
          {canCloseAd && (
            <div className="flex justify-end p-2 bg-gray-100">
              <button
                onClick={handleAdComplete}
                className="text-gray-700 hover:text-gray-900 transition"
                aria-label="Close ad"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          )}
          
          {/* Flexible ad container */}
          <div 
            ref={adContainerRef}
            className="flex-1 flex items-center justify-center bg-gray-50"
            style={{
              minHeight: '250px',
              width: '100%',
            }}
          >
            {adLoading && !adError && (
              <div className="text-center p-4">
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-gray-600" />
                <p className="mt-2 text-gray-600">Loading advertisement...</p>
              </div>
            )}
            
            {adError && (
              <div className="text-center p-4">
                <p className="text-red-600">Failed to load advertisement</p>
                <Button 
                  onClick={() => setShowAdPage(false)}
                  className="mt-4"
                  variant="destructive"
                >
                  Go Back
                </Button>
              </div>
            )}
          </div>
          
          {/* Ad status message */}
          <div className="p-3 bg-gray-100 text-center border-t">
            <p className="text-sm text-gray-600">
              {canCloseAd 
                ? "Advertisement completed - you may now close"
                : "Please watch the advertisement to completion"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="glass-card rounded-3xl p-8 shadow-lg">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Coins className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold">Hero Coin Mining</h2>
          <p className="text-muted-foreground mt-2">
            Watch ads to earn Hero Coins
          </p>
        </div>

        <div className="space-y-6">
          <div className="bg-secondary/50 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Ads Watched</span>
              <span className="text-sm font-semibold">{adWatched}/2</span>
            </div>
          </div>

          {timeRemaining !== null && (
            <div className="bg-secondary/50 rounded-xl p-4">
              <div className="flex items-center mb-2">
                <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
                <span className="text-sm font-medium">Next mining available in:</span>
              </div>
              <div className="text-2xl font-mono text-center font-bold">
                {formatTimeRemaining()}
              </div>
            </div>
          )}

          <Button
            className="w-full rounded-xl py-6 text-lg font-medium"
            disabled={timeRemaining !== null || adWatched >= 2}
            onClick={startMining}
          >
            {timeRemaining !== null ? (
              <>
                <Clock className="mr-2 h-5 w-5" />
                Cooling Down
              </>
            ) : (
              <>
                <PlayCircle className="mr-2 h-5 w-5" />
                {adWatched === 0 ? 'Start Mining' : 'Watch Next Ad'}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MiningCard;