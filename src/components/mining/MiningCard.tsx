import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { PlayCircle, Clock, Loader2, Coins, LogIn, AlertCircle, ChevronLeft, ExternalLink, Check, X } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp, increment, collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';

const MiningCard = () => {
  const [isMining, setIsMining] = useState(false);
  const [progress, setProgress] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [earlyCloseWarning, setEarlyCloseWarning] = useState(false);
  const [showAdInstructions, setShowAdInstructions] = useState(false);
  const { user } = useAuth();
  
  // Refs
  const adWindowRef = useRef<Window | null>(null);
  const miningCompletedRef = useRef(false);
  const checkIntervalRef = useRef<NodeJS.Timeout>();
  const progressIntervalRef = useRef<NodeJS.Timeout>();
  const isMobile = useRef(false);

  // Check device type on mount
  useEffect(() => {
    isMobile.current = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }, []);

  // Check cooldown on mount (12 hours)
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
            const cooldownEnd = new Date(lastMiningTime.getTime() + (12 * 60 * 60 * 1000)); // 12 hours
            const now = new Date();

            if (cooldownEnd > now) {
              setTimeRemaining(Math.ceil((cooldownEnd.getTime() - now.getTime()) / 1000));
            }
          }
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

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timeRemaining]);

  // Cleanup intervals on unmount
  useEffect(() => {
    return () => {
      if (checkIntervalRef.current) clearInterval(checkIntervalRef.current);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      if (adWindowRef.current && !adWindowRef.current.closed) {
        adWindowRef.current.close();
      }
    };
  }, []);

  // Mining progress animation (20 seconds)
  useEffect(() => {
    if (!isMining) return;

    miningCompletedRef.current = false;
    let startTime = Date.now();
    const duration = 20000; // 20 seconds

    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / duration) * 100, 100);
      setProgress(newProgress);

      if (newProgress >= 100 && !miningCompletedRef.current) {
        completeMining();
        miningCompletedRef.current = true;
      }
    };

    progressIntervalRef.current = setInterval(updateProgress, 100);
    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, [isMining]);

  const showInstructionsBeforeMining = () => {
    setShowAdInstructions(true);
  };

  const startMining = () => {
    if (earlyCloseWarning) {
      setEarlyCloseWarning(false);
      return;
    }

    if (isMining || timeRemaining) return;

    // Open ad in a new window with specific dimensions
    const newWindow = window.open(
      'https://www.effectiveratecpm.com/t3awz5wft?key=1e0a857f316e6d9479594d51d440faab',
      'AdWindow'    );

    if (!newWindow) {
      toast.error('Please allow pop-ups to continue mining', {
        description: 'Your browser blocked the ad window. Allow pop-ups and try again.',
        action: {
          label: 'Try Again',
          onClick: () => startMining()
        }
      });
      return;
    }

    adWindowRef.current = newWindow;
    setIsMining(true);
    setProgress(0);
    setEarlyCloseWarning(false);
    setShowAdInstructions(false);
    miningCompletedRef.current = false;

    // Monitor window close for all users
    checkIntervalRef.current = setInterval(() => {
      if (newWindow.closed && progress < 100) {
        handleEarlyClose();
      }
    }, 500);
  };

  const handleEarlyClose = () => {
    if (checkIntervalRef.current) clearInterval(checkIntervalRef.current);
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    
    setIsMining(false);
    setEarlyCloseWarning(true);
    toast.warning('Ad closed too soon!', {
      description: 'Please keep the ad open for the full 25 seconds to earn rewards',
      icon: <AlertCircle className="text-yellow-500" />,
      action: {
        label: 'Try Again',
        onClick: () => startMining()
      }
    });
  };

  const completeMining = async () => {
    if (miningCompletedRef.current) return;
    miningCompletedRef.current = true;

    try {
      const userRef = doc(db, 'users', user!.uid);
      const randomCoins = Math.floor(Math.random() * 10) + 5; // 5-15 coins

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

      setTimeRemaining(12 * 60 * 60); // 12 hours cooldown
      toast.success(`Mining successful!`, {
        description: `You've earned ${randomCoins} coins!`,
        duration: 5000,
      });
    } catch (error) {
      console.error('Error updating mining rewards:', error);
      toast.error('Failed to update mining rewards', {
        description: 'Please try again later',
      });
    } finally {
      if (checkIntervalRef.current) clearInterval(checkIntervalRef.current);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      setIsMining(false);
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
      <div className="w-full max-w-md mx-auto px-4">
        <div className="glass-card rounded-3xl p-6 md:p-8 shadow-lg text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Coins className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Login Required</h2>
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

  if (showAdInstructions) {
    return (
      <div className="w-full max-w-md mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-3xl p-6 md:p-8 shadow-lg"
        >
          <div className="text-center mb-6">
            <motion.div 
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <ExternalLink className="w-8 h-8 text-primary" />
            </motion.div>
            <h2 className="text-2xl font-bold">Ad Instructions</h2>
            <p className="text-muted-foreground mt-2">
              Follow these steps carefully to earn your coins
            </p>
          </div>

          <div className="space-y-4 mb-6">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-secondary/50 rounded-lg p-4"
            >
              <h3 className="font-medium flex items-center">
                <span className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center mr-3">1</span>
                Ad Window Will Open
              </h3>
              <p className="text-sm text-muted-foreground mt-1 ml-9">
                A new window will open with the ad. Don't close it until mining completes.
              </p>
              <div className="ml-9 mt-2 flex items-center text-xs text-green-500">
                <Check className="w-3 h-3 mr-1" /> Required for mining
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-secondary/50 rounded-lg p-4"
            >
              <h3 className="font-medium flex items-center">
                <span className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center mr-3">2</span>
                Switch Back Safely
              </h3>
              <p className="text-sm text-muted-foreground mt-1 ml-9">
                You can return to this tab while the ad runs in background.
              </p>
              <div className="ml-9 mt-2 flex items-center text-xs text-green-500">
                <Check className="w-3 h-3 mr-1" /> Mining continues automatically
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-secondary/50 rounded-lg p-4"
            >
              <h3 className="font-medium flex items-center">
                <span className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center mr-3">3</span>
                Complete the Session
              </h3>
              <p className="text-sm text-muted-foreground mt-1 ml-9">
                Wait for the progress bar to reach 100% before closing anything.
              </p>
              <div className="ml-9 mt-2 flex items-center text-xs text-red-500">
                <X className="w-3 h-3 mr-1" /> Closing early cancels rewards
              </div>
            </motion.div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex-1"
            >
              <Button 
                variant="outline" 
                className="w-full rounded-xl"
                onClick={() => setShowAdInstructions(false)}
              >
                <ChevronLeft className="mr-2 h-5 w-5" />
                Go Back
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex-1"
            >
              <Button 
                className="w-full rounded-xl py-6"
                onClick={startMining}
              >
                <PlayCircle className="mr-2 h-5 w-5" />
                Start Mining Now
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto px-4">
      <div className="glass-card rounded-3xl p-6 md:p-8 shadow-lg">
        <div className="text-center mb-6">
          <motion.div 
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4 }}
            className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <Coins className="w-8 h-8 text-primary" />
          </motion.div>
          <h2 className="text-2xl font-bold">Hero Coin Mining</h2>
          <p className="text-muted-foreground mt-2">
            {earlyCloseWarning 
              ? 'Complete the ad to earn rewards' 
              : 'Watch ad for 25 seconds to earn coins'}
          </p>
        </div>

        <div className="space-y-6">
          {isMining && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span>Time remaining: {Math.ceil((20000 - progress * 200) / 1000)}s</span>
                <span>{Math.floor(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-muted-foreground text-center">
                You can switch back to this tab - mining continues automatically
              </p>
            </div>
          )}

          {timeRemaining !== null && (
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="bg-secondary/50 rounded-xl p-4"
            >
              <div className="flex items-center mb-2">
                <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
                <span className="text-sm font-medium">Next mining available in:</span>
              </div>
              <div className="text-2xl font-mono text-center font-bold">
                {formatTimeRemaining()}
              </div>
            </motion.div>
          )}

          {!isMining && !timeRemaining && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-secondary/50 rounded-xl p-4"
            >
              <div className="flex items-center text-sm">
                <Coins className="w-4 h-4 mr-2 text-muted-foreground" />
                <span>Estimated reward: 5-15 coins per mining session</span>
              </div>
            </motion.div>
          )}

          <motion.div
            whileHover={(!isMining && !timeRemaining) ? { scale: 1.02 } : {}}
            whileTap={(!isMining && !timeRemaining) ? { scale: 0.98 } : {}}
          >
            <Button
              className="w-full rounded-xl py-6 text-lg font-medium"
              disabled={(isMining && !earlyCloseWarning) || timeRemaining !== null}
              onClick={earlyCloseWarning ? startMining : showInstructionsBeforeMining}
            >
              {earlyCloseWarning ? (
                <>
                  <AlertCircle className="mr-2 h-5 w-5" />
                  Try Again
                </>
              ) : isMining ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Mining in Progress
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
          </motion.div>

          {!isMining && !timeRemaining && !earlyCloseWarning && (
            <p className="text-xs text-muted-foreground text-center">
              By clicking "Start Mining", you'll be shown simple instructions before the ad opens
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MiningCard;
