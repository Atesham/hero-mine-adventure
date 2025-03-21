
import { db } from '@/lib/firebase';
import { collection, query, where, orderBy, getDocs, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';
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
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      return userDoc.data().referralCode || '';
    }
    return '';
  } catch (error) {
    console.error('Error fetching referral code:', error);
    toast.error('Could not load referral code');
    throw error;
  }
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
