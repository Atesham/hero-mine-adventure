import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const useCooldown = () => {
  const { user } = useAuth();
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);

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
        }
      } catch (error) {
        console.error('Error checking cooldown:', error);
      }
    };
    
    checkCooldown();
  }, [user]);

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

  const formatTimeRemaining = (time: number) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return {
    timeRemaining,
    setTimeRemaining,
    formatTimeRemaining
  };
};

export default useCooldown;