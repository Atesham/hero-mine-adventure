// import React, { useState, useEffect } from 'react';
// import { Button } from '@/components/ui/button';
// import { PlayCircle, Clock, Loader2, Coins, LogIn } from 'lucide-react';
// import { toast } from 'sonner';
// import { useAuth } from '@/contexts/AuthContext';
// import { Link } from 'react-router-dom';
// import { doc, getDoc, setDoc, updateDoc, serverTimestamp, increment, collection, addDoc } from 'firebase/firestore';
// import { db } from '@/lib/firebase';
// import { Progress } from '@/components/ui/progress';

// const MiningCard = () => {
//   const [isMining, setIsMining] = useState(false);
//   const [progress, setProgress] = useState(0);
//   const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
//   const [adWindow, setAdWindow] = useState<Window | null>(null);
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
//         } else {
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

//   // Mining progress animation
//   useEffect(() => {
//     let progressInterval: NodeJS.Timeout;
//     if (isMining) {
//       progressInterval = setInterval(() => {
//         setProgress((prev) => {
//           const newProgress = prev + 1;
//           if (newProgress >= 100) {
//             clearInterval(progressInterval);
//             return 100;
//           }
//           return newProgress;
//         });
//       }, 50);
//     }
//     return () => progressInterval && clearInterval(progressInterval);
//   }, [isMining]);

//   const startMining = () => {
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

//       // Check if window is closed every second
//       const checkInterval = setInterval(() => {
//         if (newWindow.closed) {
//           clearInterval(checkInterval);
//           handleMiningSuccess();
//         }
//       }, 1000);

//       // Auto-complete after 30 seconds if window remains open
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
//       const randomCoins = Math.floor(Math.random() * 10) + 5; // 5-15 coins

//       await updateDoc(userRef, {
//         coins: increment(randomCoins),
//         totalMined: increment(randomCoins),
//         lastMiningTime: serverTimestamp()
//       });

//       // Record transaction
//       await addDoc(collection(db, 'transactions'), {
//         userId: user!.uid,
//         type: 'reward',
//         amount: randomCoins,
//         timestamp: serverTimestamp(),
//         description: 'Mining Reward'
//       });

//       setTimeRemaining(24 * 60 * 60); // 24h cooldown
//       toast.success('Mining successful!', {
//         description: `You earned ${randomCoins} coins!`,
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
//     return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
//   };

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

//   return (
//     <div className="w-full max-w-md mx-auto">
//       <div className="glass-card rounded-3xl p-8 shadow-lg">
//         <div className="text-center mb-6">
//           <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
//             <Coins className="w-8 h-8 text-primary" />
//           </div>
//           <h2 className="text-2xl font-bold">Hero Coin Mining</h2>
//           <p className="text-muted-foreground mt-2">
//             Watch an ad to earn Hero Coins
//           </p>
//         </div>

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



import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { PlayCircle, Clock, Loader2, Coins, LogIn, AlertCircle } from 'lucide-react';
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
  const [earlyCloseWarning, setEarlyCloseWarning] = useState(false);
  const { user } = useAuth();

  // Check cooldown on mount
  useEffect(() => {
    if (!user) return;
    const checkCooldown = async () => {
      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists() && userDoc.data()?.lastMiningTime?.toDate()) {
        const cooldownEnd = new Date(userDoc.data().lastMiningTime.toDate().getTime() + (24 * 60 * 60 * 1000));
        if (cooldownEnd > new Date()) {
          setTimeRemaining(Math.ceil((cooldownEnd.getTime() - Date.now()) / 1000));
        }
      }
    };
    checkCooldown();
  }, [user]);

  // Handle cooldown timer
  useEffect(() => {
    if (!timeRemaining) return;
    const interval = setInterval(() => {
      setTimeRemaining(prev => prev && prev > 0 ? prev - 1 : null);
    }, 1000);
    return () => clearInterval(interval);
  }, [timeRemaining]);

  // Mining progress animation (25 seconds)
  useEffect(() => {
    if (!isMining) return;
    
    let progressInterval: NodeJS.Timeout;
    let elapsed = 0;
    const duration = 25000; // 25 seconds

    const updateProgress = () => {
      elapsed += 100;
      const newProgress = Math.min((elapsed / duration) * 100, 100);
      setProgress(newProgress);
      if (newProgress >= 100) completeMining();
    };

    progressInterval = setInterval(updateProgress, 100);
    return () => clearInterval(progressInterval);
  }, [isMining]);

  // Watch for ad window closing
  useEffect(() => {
    if (!adWindow || !isMining) return;

    const checkWindow = setInterval(() => {
      if (adWindow.closed && progress < 100) {
        handleEarlyClose();
        clearInterval(checkWindow);
      }
    }, 500);

    return () => clearInterval(checkWindow);
  }, [adWindow, isMining, progress]);

  const startMining = () => {
    if (earlyCloseWarning) {
      setEarlyCloseWarning(false);
      return;
    }

    const newWindow = window.open(
      'https://www.effectiveratecpm.com/t3awz5wft?key=1e0a857f316e6d9479594d51d440faab',
      'AdWindow',
      'width=600,height=800'
    );

    if (!newWindow) {
      toast.error('Please allow pop-ups to mine');
      return;
    }

    setAdWindow(newWindow);
    setIsMining(true);
    setProgress(0);
    setEarlyCloseWarning(false);
  };

  const handleEarlyClose = () => {
    setIsMining(false);
    setEarlyCloseWarning(true);
    toast.warning('Ad closed too soon!', {
      description: 'Please keep the ad open for full 25 seconds to earn rewards',
      icon: <AlertCircle className="text-yellow-500" />
    });
  };

  const completeMining = async () => {
    try {
      const userRef = doc(db, 'users', user!.uid);
      const randomCoins = Math.floor(Math.random() * 10) + 5;

      await updateDoc(userRef, {
        coins: increment(randomCoins),
        totalMined: increment(randomCoins),
        lastMiningTime: serverTimestamp()
      });

      await addDoc(collection(db, 'transactions'), {
        userId: user!.uid,
        type: 'reward',
        amount: randomCoins,
        timestamp: serverTimestamp(),
        description: 'Mining Reward'
      });

      setTimeRemaining(24 * 60 * 60);
      toast.success(`You earned ${randomCoins} coins!`);
    } catch (error) {
      toast.error('Failed to complete mining');
    } finally {
      setIsMining(false);
      setAdWindow(null);
    }
  };

  const formatTimeRemaining = () => {
    if (!timeRemaining) return '';
    const hours = Math.floor(timeRemaining / 3600);
    const minutes = Math.floor((timeRemaining % 3600) / 60);
    const seconds = timeRemaining % 60;
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  if (!user) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="glass-card rounded-3xl p-8 shadow-lg text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Coins className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Login Required</h2>
          <Button asChild className="rounded-xl">
            <Link to="/login">
              <LogIn className="mr-2 h-5 w-5" />
              Log In to Mine
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
          <h2 className="text-2xl font-bold">Mining</h2>
          <p className="text-muted-foreground mt-2">
            {earlyCloseWarning ? 'Complete the ad to earn' : 'Watch ad for 25 seconds'}
          </p>
        </div>

        <div className="space-y-6">
          {isMining && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span>Time remaining: {Math.ceil((25000 - progress * 250) / 1000)}s</span>
                <span>{Math.floor(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-muted-foreground text-center">
                {earlyCloseWarning ? 'Please don\'t close early' : 'Keep the ad tab open'}
              </p>
            </div>
          )}

          {timeRemaining && (
            <div className="bg-secondary/50 rounded-xl p-4">
              <div className="text-2xl font-mono text-center font-bold">
                {formatTimeRemaining()}
              </div>
            </div>
          )}

          <Button
            className="w-full rounded-xl py-6 text-lg font-medium"
            onClick={startMining}
            disabled={!!timeRemaining || (isMining && !earlyCloseWarning)}
          >
            {earlyCloseWarning ? (
              <>
                <AlertCircle className="mr-2 h-5 w-5" />
                Try Again (25s)
              </>
            ) : isMining ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Mining ({Math.ceil((25000 - progress * 250) / 1000)}s)
              </>
            ) : timeRemaining ? (
              <>
                <Clock className="mr-2 h-5 w-5" />
                Cooldown Active
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