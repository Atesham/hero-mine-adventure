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
    // Use a simple query without orderBy to avoid index issues
    const referralsQuery = query(
      collection(db, 'referrals'),
      where('referrerId', '==', userId)
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
    
    // Sort manually instead of using orderBy
    referrals.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    
    return referrals;
  } catch (error) {
    console.error('Error fetching referrals:', error);
    toast.error('Could not load referrals');
    // Return empty array instead of throwing
    return [];
  }
};

// Generate a referral link
export const generateReferralLink = (referralCode: string): string => {
  
  if (!referralCode) {
    console.error('No referral code provided to generate link');
    return '';
  }
  
  const baseUrl = window.location.origin;
  const link = `${baseUrl}/signup?ref=${encodeURIComponent(referralCode)}`;
  return link;
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
        const newCode = generateReferralCode(userData.displayName || '');
        await updateDoc(userRef, { referralCode: newCode });
        return newCode;
      }
      
      return userData.referralCode || '';
    } else {
      console.error("User document doesn't exist");
      return '';
    }
  } catch (error) {
    console.error('Error fetching referral code:', error);
    // Don't show toast here, handle in component
    throw error;
  }
};



export const generateReferralCode = (displayName: string): string => {
  // 1. Clean and extract initials (2 chars exactly)
  const initials = displayName
    .replace(/[^a-zA-Z]/g, '') // Remove all non-alphabetic characters
    .slice(0, 2)
    .toUpperCase()
    .padEnd(2, 'X'); // Default to 'XX' if name is too short

  // 2. Get current time in base36 (compact timestamp)
  const timePart = Date.now().toString(36).toUpperCase().slice(-3); // Last 3 chars

  // 3. Add 1 random character for variability
  const randomChar = Math.floor(Math.random() * 36)
    .toString(36)
    .toUpperCase();

  // 4. Combine and format as 6-character code
  const code = `${initials}${timePart}${randomChar}`
    .replace(/[^A-Z0-9]/g, '') // Final sanitization
    .slice(0, 6);

  // 5. Fallback if somehow invalid (should never happen)
  if (!/^[A-Z0-9]{6}$/.test(code)) {
    return `XX${Math.random().toString(36).toUpperCase().slice(2, 6)}`;
  }

  return code;
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