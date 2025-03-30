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
    console.log("Getting referrals for user:", userId);
    
    // Use a simple query without orderBy to avoid index issues
    const referralsQuery = query(
      collection(db, 'referrals'),
      where('referrerId', '==', userId)
    );
    
    const referralsSnapshot = await getDocs(referralsQuery);
    const referrals: Referral[] = [];
    
    console.log(`Found ${referralsSnapshot.size} referrals`);
    
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
  console.log("Generating referral link with code:", referralCode);
  
  if (!referralCode) {
    console.error('No referral code provided to generate link');
    return '';
  }
  
  const baseUrl = window.location.origin;
  const link = `${baseUrl}/signup?ref=${encodeURIComponent(referralCode)}`;
  console.log("Generated link:", link);
  return link;
};

// Get user's referral code
export const getUserReferralCode = async (userId: string): Promise<string> => {
  try {
    console.log("Getting referral code for user:", userId);
    
    if (!userId) {
      console.error('No user ID provided');
      return '';
    }

    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      console.log("User data:", userData);
      
      // If user doesn't have a referral code yet, generate and save one
      if (!userData.referralCode) {
        console.log("No referral code found, generating one");
        const newCode = generateRandomReferralCode(userData.displayName || '');
        await updateDoc(userRef, { referralCode: newCode });
        console.log("Generated and saved new code:", newCode);
        return newCode;
      }
      
      console.log("Found existing referral code:", userData.referralCode);
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

// Generate a random referral code

export const generateRandomReferralCode = async (displayName: string): Promise<string> => {
  // Generate initials from display name (2-3 characters)
  const initials = displayName
    .split(' ')
    .filter(name => name.length > 0)
    .slice(0, 3) // Take up to 3 names
    .map(name => name[0].toUpperCase())
    .join('')
    .padEnd(2, 'HC'); // Default to HC if not enough initials

  // Generate random alphanumeric string (6 characters)
  const randomChars = () => Math.random().toString(36).substring(2, 8).toUpperCase();

  let isUnique = false;
  let attempts = 0;
  const maxAttempts = 5;
  let code = '';

  while (!isUnique && attempts < maxAttempts) {
    attempts++;
    code = `${initials}${randomChars()}`.replace(/-/g, ''); // Remove any hyphens
    
    // Check if code exists in Firestore
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('referralCode', '==', code));
    const querySnapshot = await getDocs(q);
    
    isUnique = querySnapshot.empty;
  }

  // If still not unique after attempts, append timestamp
  if (!isUnique) {
    const timestamp = Date.now().toString(36).toUpperCase().slice(-4);
    code = `${initials}${randomChars().slice(0, 4)}${timestamp}`;
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