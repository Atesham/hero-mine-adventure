
import { db } from '@/lib/firebase';
import { collection, query, where, orderBy, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { toast } from 'sonner';

export interface Referral {
  id: string;
  referrerId: string;
  referredId: string;
  referredName: string;
  referrerName: string;
  timestamp: Date;
  status: 'pending' | 'completed';
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
        status: data.status
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
  const baseUrl = window.location.origin;
  return `${baseUrl}/signup?ref=${referralCode}`;
};
