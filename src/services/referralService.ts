
import { db } from '@/lib/firebase';
import { collection, query, where, orderBy, getDocs, addDoc, serverTimestamp, doc, getDoc, updateDoc } from 'firebase/firestore';
import { toast } from 'sonner';

export interface Referral {
  id: string;
  referrerId: string;
  referredId: string;
  referredName: string;
  referrerName: string;
  timestamp: Date;
  status: 'pending' | 'completed';
  rewardAmount: number;
}

// Get referrals for a user
export const getUserReferrals = async (userId: string): Promise<Referral[]> => {
  try {
    const referralsQuery = query(
      collection(db, 'referrals'),
      where('referrerId', '==', userId),
      orderBy('timestamp', 'desc')
    );
    
    const referralsSnapshot = await getDocs(referralsQuery);
    const referrals: Referral[] = [];
    
    referralsSnapshot.forEach((doc) => {
      const data = doc.data();
      referrals.push({
        id: doc.id,
        referrerId: data.referrerId,
        referredId: data.referredId,
        referredName: data.referredName,
        referrerName: data.referrerName,
        timestamp: data.timestamp?.toDate() || new Date(),
        status: data.status,
        rewardAmount: data.rewardAmount || 25
      });
    });
    
    return referrals;
  } catch (error) {
    console.error('Error fetching referrals:', error);
    toast.error('Could not load referrals');
    throw error;
  }
};

// Generate a referral link
export const generateReferralLink = (referralCode: string): string => {
  if (!referralCode) {
    console.error('No referral code provided');
    return '';
  }
  const baseUrl = window.location.origin;
  return `${baseUrl}/signup?ref=${encodeURIComponent(referralCode)}`;
};

// Get user's referral code
export const getUserReferralCode = async (userId: string): Promise<string> => {
  try {
    if (!userId) {
      console.error('No user ID provided');
      return '';
    }

    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      
      // If user doesn't have a referral code yet, generate and save one
      if (!userData.referralCode) {
        const newCode = generateRandomReferralCode(userData.displayName || '');
        await updateDoc(userRef, { referralCode: newCode });
        return newCode;
      }
      
      return userData.referralCode || '';
    }
    return '';
  } catch (error) {
    console.error('Error fetching referral code:', error);
    toast.error('Could not load referral code');
    throw error;
  }
};

// Generate a random referral code
export const generateRandomReferralCode = (displayName: string): string => {
  const namePrefix = displayName.split(' ')
    .map(name => name[0])
    .join('')
    .toUpperCase() || 'HC';
  const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${namePrefix}-${randomPart}`;
};

// Get total referral stats
export const getReferralStats = async (userId: string): Promise<{ total: number, totalRewards: number }> => {
  try {
    const referrals = await getUserReferrals(userId);
    const total = referrals.length;
    const totalRewards = referrals.reduce((sum, ref) => sum + (ref.rewardAmount || 25), 0);
    
    return { total, totalRewards };
  } catch (error) {
    console.error('Error calculating referral stats:', error);
    return { total: 0, totalRewards: 0 };
  }
};
