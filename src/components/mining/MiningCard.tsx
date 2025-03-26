import React, { useState, useEffect, useRef} from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { PlayCircle, Clock, Loader2, Coins, LogIn } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp, increment, collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAdSense } from '@/hooks/useAds';

const MiningCard = () => {
  const [isMining, setIsMining] = useState(false);
  const [progress, setProgress] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState<null | number>(null);
  const [adWatched, setAdWatched] = useState(0);
  const { user } = useAuth();
  const [showAd, setShowAd] = useState(false);
  const adContainerRef = useRef<HTMLDivElement>(null);

  useAdSense(showAd);  

  useEffect(() => {
    if (!user) return;
    
    // Check cooldown from Firestore
    const checkCooldown = async () => {
      try {
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const lastMiningTime = userData.lastMiningTime?.toDate();
          
          if (lastMiningTime) {
            const cooldownEnd = new Date(lastMiningTime.getTime() + (12 * 60 * 60 * 1000)); // 12 hours cooldown
            const now = new Date();
            
            if (cooldownEnd > now) {
              // Still in cooldown
              setTimeRemaining(Math.ceil((cooldownEnd.getTime() - now.getTime()) / 1000));
            }
          }
        } else {
          // Create user document if it doesn't exist
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
  
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isMining) {
      interval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + 1;
          if (newProgress >= 100) {
            clearInterval(interval);
            setIsMining(false);
            setAdWatched((prev) => prev + 1);
            
            if (adWatched === 1) {
              // Both ads watched, mining complete
              handleMiningComplete();
            } else {
              toast.success('First ad completed!', {
                description: 'Watch one more ad to complete mining'
              });
            }
            return 0;
          }
          return newProgress;
        });
      }, 50);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isMining, adWatched]);
  
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (timeRemaining && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev === null || prev <= 1) {
            clearInterval(interval);
            setTimeRemaining(null);
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
  
  const formatTimeRemaining = () => {
    if (timeRemaining === null) return '';
    
    const hours = Math.floor(timeRemaining / 3600);
    const minutes = Math.floor((timeRemaining % 3600) / 60);
    const seconds = timeRemaining % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  const startMining = () => {
    if (!user || isMining || timeRemaining) return;
    
    setShowAd(true);
    setIsMining(true);
    
    // Fallback in case ad doesn't load
    const fallbackTimer = setTimeout(() => {
      if (progress === 0) {
        toast.warning('Ad not loaded, please try again');
        setIsMining(false);
        setShowAd(false);
      }
    }, 10000); // 10 seconds timeout
    
    return () => clearTimeout(fallbackTimer);
  };

  
  const handleMiningComplete = async () => {
    if (!user) return;
    
    try {
      // Generate random coin reward (5-15 coins)
      const randomCoins = Math.floor(Math.random() * 11) + 5;
      
      // Update user's coin balance and set cooldown
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        coins: increment(randomCoins),
        totalMined: increment(randomCoins),
        lastMiningTime: serverTimestamp()
      });
      
      // Add transaction record
      await addDoc(collection(db, 'transactions'), {
        userId: user.uid,
        type: 'reward',
        amount: randomCoins,
        timestamp: serverTimestamp(),
        description: 'Mining Reward'
      });
      
      // Set cooldown (12 hours)
      const cooldownDuration = 12 * 60 * 60; // 12 hours in seconds
      setTimeRemaining(cooldownDuration);
      setAdWatched(0);
      
      // Show success notification
      toast.success(`Mining successful!`, {
        description: `You've earned ${randomCoins} Hero Coins`
      });
    } catch (error) {
      console.error('Error updating mining rewards:', error);
      toast.error('Failed to update mining rewards');
    }
  };

  // If user is not logged in, show login prompt
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
            Watch ads to earn Hero Coins
          </p>
        </div>
        {showAd && (
        <div ref={adContainerRef} className="my-4">
          <ins 
                      className="adsbygoogle"
     style={{ display: 'block' }}
     data-ad-client="ca-pub-5478626290073215"
     data-ad-slot="7643212953"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>
        </div>
      )}
      
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
          
          {/* Ads watched counter */}
          <div className="bg-secondary/50 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Ads Watched</span>
              <span className="text-sm font-semibold">{adWatched}/2</span>
            </div>
          </div>
          
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
