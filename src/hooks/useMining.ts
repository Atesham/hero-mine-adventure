import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { doc, updateDoc, increment, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';

const useMining = () => {
  const { user } = useAuth();
  const [isMining, setIsMining] = useState(false);
  const [progress, setProgress] = useState(0);
  const [adWatched, setAdWatched] = useState(0);

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

  const handleMiningComplete = async () => {
    if (!user) return;

    try {
      const randomCoins = Math.floor(Math.random() * 11) + 5;
      const userRef = doc(db, 'users', user.uid);
      
      await updateDoc(userRef, {
        coins: increment(randomCoins),
        totalMined: increment(randomCoins),
        lastMiningTime: serverTimestamp()
      });

      toast.success(`Mining successful!`, {
        description: `You've earned ${randomCoins} Hero Coins`
      });
    } catch (error) {
      console.error('Error updating mining rewards:', error);
      toast.error('Failed to update mining rewards');
    }
  };

  return {
    isMining,
    setIsMining,
    progress,
    adWatched,
    setAdWatched,
    handleMiningComplete
  };
};

export default useMining;