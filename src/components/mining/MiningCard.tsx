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









// import React, { useState, useEffect } from 'react';
// import { Button } from '@/components/ui/button';
// import { Clock, Loader2, Coins, LogIn, BadgeCheck } from 'lucide-react';
// import { toast } from 'sonner';
// import { useAuth } from '@/contexts/AuthContext';
// import { Link } from 'react-router-dom';
// import { doc, getDoc, setDoc, updateDoc, serverTimestamp, increment } from 'firebase/firestore';
// import { db } from '@/lib/firebase';

// const MiningCard = () => {
//   const [isMining, setIsMining] = useState(false);
//   const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
//   const [adWindow, setAdWindow] = useState<Window | null>(null);
//   const [progress, setProgress] = useState(0);
//   const { user } = useAuth();

//   // Check cooldown on mount
//   useEffect(() => {
//     if (!user) return;

//     const checkCooldown = async () => {
//       try {
//         const userRef = doc(db, 'users', user.uid);
//         const userDoc = await getDoc(userRef);

//         if (userDoc.exists()) {
//           const userData = userDoc.data();
//           const lastMiningTime = userData.lastMiningTime?.toDate();

//           if (lastMiningTime) {
//             const cooldownEnd = new Date(lastMiningTime.getTime() + (24 * 60 * 60 * 1000));
//             const now = new Date();

//             if (cooldownEnd > now) {
//               setTimeRemaining(Math.ceil((cooldownEnd.getTime() - now.getTime()) / 1000));
//             }
//           }
//         }
//       } catch (error) {
//         console.error('Error checking cooldown:', error);
//       }
//     };

//     checkCooldown();
//   }, [user]);

//   // Handle cooldown timer
//   useEffect(() => {
//     let interval: NodeJS.Timeout;

//     if (timeRemaining && timeRemaining > 0) {
//       interval = setInterval(() => {
//         setTimeRemaining((prev) => (prev && prev > 0 ? prev - 1 : null));
//       }, 1000);
//     }

//     return () => interval && clearInterval(interval);
//   }, [timeRemaining]);

//   // Progress animation
//   useEffect(() => {
//     let progressInterval: NodeJS.Timeout;
//     if (isMining) {
//       let currentProgress = 0;
//       progressInterval = setInterval(() => {
//         currentProgress += 100/30;
//         setProgress(Math.min(currentProgress, 100));
//       }, 1000);
//     }
//     return () => progressInterval && clearInterval(progressInterval);
//   }, [isMining]);

//   const startMining = async () => {
//     if (!user || timeRemaining !== null) return;

//     try {
//       const windowFeatures = 'width=600,height=800,scrollbars=yes';
//       const newWindow = window.open(
//         'https://www.effectiveratecpm.com/t3awz5wft?key=1e0a857f316e6d9479594d51d440faab',
//         'AdWindow',
//         windowFeatures
//       );

//       if (!newWindow) {
//         toast.error('Please allow pop-ups to continue mining');
//         return;
//       }

//       setAdWindow(newWindow);
//       setIsMining(true);

//       const checkInterval = setInterval(() => {
//         if (newWindow.closed) {
//           clearInterval(checkInterval);
//           handleMiningSuccess();
//         }
//       }, 1000);

//       setTimeout(() => {
//         if (!newWindow.closed) {
//           newWindow.close();
//           handleMiningSuccess();
//         }
//       }, 30000);

//     } catch (error) {
//       console.error('Mining error:', error);
//       toast.error('Failed to start mining session');
//       setIsMining(false);
//     }
//   };

//   const handleMiningSuccess = async () => {
//     try {
//       const userRef = doc(db, 'users', user!.uid);
//       const randomCoins = Math.floor(Math.random() * 10) + 5;

//       await updateDoc(userRef, {
//         coins: increment(randomCoins),
//         totalMined: increment(randomCoins),
//         lastMiningTime: serverTimestamp()
//       });

//       setTimeRemaining(24 * 60 * 60);
//       toast.success('Mining successful!', {
//         description: `You earned ${randomCoins} coins!`,
//         icon: <BadgeCheck className="text-green-500 animate-bounce" />
//       });
//     } catch (error) {
//       console.error('Mining completion error:', error);
//       toast.error('Failed to complete mining session');
//     } finally {
//       setIsMining(false);
//       setAdWindow(null);
//       setProgress(0);
//     }
//   };

//   const formatTimeRemaining = () => {
//     if (!timeRemaining) return '';
//     const hours = Math.floor(timeRemaining / 3600);
//     const minutes = Math.floor((timeRemaining % 3600) / 60);
//     const seconds = timeRemaining % 60;
//     return `${hours}h ${minutes}m ${seconds}s`;
//   };

//   if (!user) {
//     return (
//       <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 transition-all duration-300 hover:shadow-2xl">
//         <div className="text-center space-y-6">
//           <div className="animate-float">
//             <Coins className="mx-auto h-16 w-16 text-blue-500 dark:text-blue-400" />
//           </div>
//           <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Login Required</h2>
//           <p className="text-gray-600 dark:text-gray-300">
//             Sign in to start mining and earning coins
//           </p>
//           <Button asChild className="w-full py-6 text-lg transition-transform hover:scale-105">
//             <Link to="/login">
//               <LogIn className="mr-2 h-5 w-5" />
//               Login to Continue
//             </Link>
//           </Button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 transition-all duration-300 hover:shadow-2xl">
//       <div className="text-center space-y-8">
//         <div className="space-y-4">
//           <div className="relative inline-block">
//             <div className={`absolute inset-0 border-4 border-blue-200 dark:border-blue-900 rounded-full 
//               ${isMining ? 'animate-ping' : ''}`}></div>
//             <Coins className="h-16 w-16 text-blue-500 dark:text-blue-400 mx-auto relative" />
//           </div>
          
//           <h1 className="text-4xl font-bold text-gray-800 dark:text-white">Daily Mining</h1>
//           <p className="text-gray-600 dark:text-gray-300">
//             Mine once every 24 hours by watching a short ad
//           </p>
//         </div>

//         {timeRemaining ? (
//           <div className="bg-yellow-100 dark:bg-yellow-900 p-5 rounded-xl animate-pulse-slow">
//             <div className="flex items-center justify-center gap-3">
//               <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
//               <span className="font-semibold text-yellow-700 dark:text-yellow-300">
//                 Next available in: {formatTimeRemaining()}
//               </span>
//             </div>
//           </div>
//         ) : (
//           <div className="bg-green-100 dark:bg-green-900 p-5 rounded-xl animate-fade-in">
//             <div className="flex items-center justify-center gap-3">
//               <BadgeCheck className="h-6 w-6 text-green-600 dark:text-green-400" />
//               <span className="font-semibold text-green-700 dark:text-green-300">
//                 Ready to mine!
//               </span>
//             </div>
//           </div>
//         )}

//         <div className="relative">
//           <Button
//             className={`w-full py-7 text-xl transition-all duration-300 ${
//               isMining ? 'bg-blue-600 hover:bg-blue-700' : 'hover:scale-105'
//             }`}
//             onClick={startMining}
//             disabled={!!timeRemaining || isMining}
//           >
//             {isMining ? (
//               <div className="flex items-center gap-3">
//                 <Loader2 className="h-6 w-6 animate-spin" />
//                 <span>Mining Progress</span>
//               </div>
//             ) : timeRemaining ? (
//               'Mining Cooldown'
//             ) : (
//               'Start Mining Now'
//             )}
//           </Button>
          
//           {isMining && (
//             <div className="absolute -bottom-6 w-full">
//               <div className="h-2 bg-blue-100 dark:bg-blue-900 rounded-full overflow-hidden">
//                 <div 
//                   className="h-full bg-blue-500 transition-all duration-1000 ease-linear"
//                   style={{ width: `${progress}%` }}
//                 ></div>
//               </div>
//             </div>
//           )}
//         </div>

//         <div className="text-sm text-gray-500 dark:text-gray-400 space-y-2">
//           <p className="animate-fade-in-up">• Clicking will open an ad in new window</p>
//           <p className="animate-fade-in-up delay-100">• Keep window open for 30 seconds to complete</p>
//           <p className="animate-fade-in-up delay-200">• Earn 5-15 coins per successful mining</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MiningCard;


import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { PlayCircle, Clock, Loader2, Coins, LogIn } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp, increment, collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Progress } from '@/components/ui/progress';

const MiningCard = () => {
  const [isMining, setIsMining] = useState(false);
  const [progress, setProgress] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [adWindow, setAdWindow] = useState<Window | null>(null);
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
            const cooldownEnd = new Date(lastMiningTime.getTime() + (24 * 60 * 60 * 1000));
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
        setTimeRemaining((prev) => (prev && prev > 0 ? prev - 1 : null));
      }, 1000);
    }

    return () => interval && clearInterval(interval);
  }, [timeRemaining]);

  // Mining progress animation
  useEffect(() => {
    let progressInterval: NodeJS.Timeout;
    if (isMining) {
      progressInterval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + 1;
          if (newProgress >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return newProgress;
        });
      }, 50);
    }
    return () => progressInterval && clearInterval(progressInterval);
  }, [isMining]);

  const startMining = () => {
    if (!user || timeRemaining !== null) return;

    try {
      const windowFeatures = 'width=600,height=800,scrollbars=yes';
      const newWindow = window.open(
        'https://www.effectiveratecpm.com/t3awz5wft?key=1e0a857f316e6d9479594d51d440faab',
        'AdWindow',
        windowFeatures
      );

      if (!newWindow) {
        toast.error('Please allow pop-ups to continue mining');
        return;
      }

      setAdWindow(newWindow);
      setIsMining(true);

      // Check if window is closed every second
      const checkInterval = setInterval(() => {
        if (newWindow.closed) {
          clearInterval(checkInterval);
          handleMiningSuccess();
        }
      }, 1000);

      // Auto-complete after 30 seconds if window remains open
      setTimeout(() => {
        if (!newWindow.closed) {
          newWindow.close();
          handleMiningSuccess();
        }
      }, 30000);

    } catch (error) {
      console.error('Mining error:', error);
      toast.error('Failed to start mining session');
      setIsMining(false);
    }
  };

  const handleMiningSuccess = async () => {
    try {
      const userRef = doc(db, 'users', user!.uid);
      const randomCoins = Math.floor(Math.random() * 10) + 5; // 5-15 coins

      await updateDoc(userRef, {
        coins: increment(randomCoins),
        totalMined: increment(randomCoins),
        lastMiningTime: serverTimestamp()
      });

      // Record transaction
      await addDoc(collection(db, 'transactions'), {
        userId: user!.uid,
        type: 'reward',
        amount: randomCoins,
        timestamp: serverTimestamp(),
        description: 'Mining Reward'
      });

      setTimeRemaining(24 * 60 * 60); // 24h cooldown
      toast.success('Mining successful!', {
        description: `You earned ${randomCoins} coins!`,
      });
    } catch (error) {
      console.error('Mining completion error:', error);
      toast.error('Failed to complete mining session');
    } finally {
      setIsMining(false);
      setAdWindow(null);
      setProgress(0);
    }
  };

  const formatTimeRemaining = () => {
    if (!timeRemaining) return '';
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

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="glass-card rounded-3xl p-8 shadow-lg">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Coins className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold">Hero Coin Mining</h2>
          <p className="text-muted-foreground mt-2">
            Watch an ad to earn Hero Coins
          </p>
        </div>

        <div className="space-y-6">
          {/* Mining progress */}
          {isMining && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span>Mining progress</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}

          {/* Cooldown timer */}
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

          {/* Start mining button */}
          <Button
            className="w-full rounded-xl py-6 text-lg font-medium"
            disabled={isMining || timeRemaining !== null}
            onClick={startMining}
          >
            {isMining ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Mining...
              </>
            ) : timeRemaining !== null ? (
              <>
                <Clock className="mr-2 h-5 w-5" />
                Cooling Down
              </>
            ) : (
              <>
                <PlayCircle className="mr-2 h-5 w-5" />
                Start Mining
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MiningCard;