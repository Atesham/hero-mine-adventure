import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  sendPasswordResetEmail,
  User as FirebaseUser
} from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { toast } from 'sonner';
import { doc, getDoc, setDoc, serverTimestamp, updateDoc, increment, collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { generateRandomReferralCode } from '@/referralService';

interface AuthContextType {
  user: FirebaseUser | null;
  loading: boolean;
  signup: (email: string, password: string, displayName: string, referralCode?: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;

  isGoogleAuthAvailable: boolean;
  generateReferralCode: () => string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGoogleAuthAvailable, setIsGoogleAuthAvailable] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      if (user) {
        // Check if user document exists, if not create it
        try {
          console.log("Auth state changed, user:", user.uid);
          const userRef = doc(db, 'users', user.uid);
          const userSnap = await getDoc(userRef);
          
          if (!userSnap.exists()) {
            console.log("Creating new user document");
            // Create new user document with a referral code
            const referralCode = generateRandomReferralCode(user.displayName || user.email?.split('@')[0] || '');
            
            await setDoc(userRef, {
              displayName: user.displayName || user.email?.split('@')[0],
              email: user.email,
              coins: 0,
              totalMined: 0,
              createdAt: serverTimestamp(),
              referralCode: referralCode
            });
            
            console.log('Created new user with referral code:', referralCode);
          } else if (!userSnap.data().referralCode) {
            console.log("Adding referral code to existing user");
            // If user exists but doesn't have a referral code, add one
            const referralCode = generateRandomReferralCode(user.displayName || user.email?.split('@')[0] || '');
            await updateDoc(userRef, {
              referralCode: referralCode
            });
            console.log('Added referral code to existing user:', referralCode);
          }
        } catch (error) {
          console.error("Error checking/creating user document:", error);
        }
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);


  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success('Password reset email sent!', {
        description: 'Please check your inbox for instructions to reset your password.',
        duration: 5000
      });
    } catch (error: any) {
      console.error('Password reset error:', error);
      
      if (error.code === 'auth/user-not-found') {
        throw new Error('No account found with this email address.');
      } else if (error.code === 'auth/invalid-email') {
        throw new Error('Please enter a valid email address.');
      } else if (error.code === 'auth/too-many-requests') {
        throw new Error('Too many requests. Please try again later.');
      } else {
        throw new Error(error.message || 'Failed to send password reset email');
      }
    }
  };

  const generateReferralCode = () => {
    return generateRandomReferralCode(
      user ? (user.displayName || user.email?.split('@')[0] || '') : ''
    );
  };

  const signup = async (email: string, password: string, displayName: string, referralCode?: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      if (userCredential.user) {
        await updateProfile(userCredential.user, { displayName });
        setUser({ ...userCredential.user, displayName });
        
        const userReferralCode = generateRandomReferralCode(displayName);
        const userRef = doc(db, 'users', userCredential.user.uid);
        
        let initialCoins = 0;
        
        if (referralCode) {
          const usersCollection = collection(db, 'users');
          const referrerQuery = query(usersCollection, where('referralCode', '==', referralCode));
          const referrerSnapshot = await getDocs(referrerQuery);
          
          if (!referrerSnapshot.empty) {
            const referrerDoc = referrerSnapshot.docs[0];
            const referrerId = referrerDoc.id;
            
            initialCoins = 10;
            
            const referrerRef = doc(db, 'users', referrerId);
            await updateDoc(referrerRef, {
              coins: increment(25)
            });
            
            await addDoc(collection(db, 'transactions'), {
              userId: referrerId,
              type: 'reward',
              amount: 25,
              description: `Referral bonus for inviting ${displayName}`,
              timestamp: serverTimestamp(),
              counterpartyName: displayName
            });
            
            await addDoc(collection(db, 'transactions'), {
              userId: userCredential.user.uid,
              type: 'reward',
              amount: 10,
              description: 'Welcome bonus for joining via referral',
              timestamp: serverTimestamp()
            });
            
            await addDoc(collection(db, 'referrals'), {
              referrerId: referrerId,
              referredId: userCredential.user.uid,
              referredName: displayName,
              referrerName: referrerDoc.data().displayName,
              timestamp: serverTimestamp(),
              status: 'completed',
              rewardAmount: 25
            });
            
            toast.success('Referral bonus applied!');
          } else {
            toast.error('Invalid referral code');
          }
        }
        
        await setDoc(userRef, {
          displayName,
          email,
          coins: initialCoins,
          totalMined: 0,
          createdAt: serverTimestamp(),
          referralCode: userReferralCode
        });
        
        toast.success('Account created successfully!');
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      
      if (error.code === 'auth/email-already-in-use') {
        throw new Error('This email is already in use. Please try a different one.');
      } else if (error.code === 'auth/invalid-email') {
        throw new Error('Please enter a valid email address.');
      } else if (error.code === 'auth/weak-password') {
        throw new Error('Password is too weak. Please use at least 6 characters.');
      } else {
        throw new Error(error.message || 'Failed to create account');
      }
    }
  };

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success('Logged in successfully!');
    } catch (error: any) {
      console.error('Login error:', error);
      
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        throw new Error('Invalid email or password. Please try again.');
      } else if (error.code === 'auth/too-many-requests') {
        throw new Error('Too many failed login attempts. Please try again later.');
      } else {
        throw new Error(error.message || 'Failed to log in');
      }
    }
  };

  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      toast.success('Logged in successfully with Google!');
    } catch (error: any) {
      console.error('Google login error:', error);
      
      if (error.code === 'auth/unauthorized-domain') {
        setIsGoogleAuthAvailable(false);
        toast.error('Google login is not available in this environment', {
          description: 'Please use email/password login instead.',
          duration: 5000
        });
        throw new Error('This domain is not authorized for Google login. Please use email/password login instead.');
      } else {
        throw new Error(error.message || 'Failed to log in with Google');
      }
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      toast.success('Logged out successfully!');
    } catch (error: any) {
      console.error('Logout error:', error);
      throw new Error(error.message || 'Failed to log out');
    }
  };

  const value = {
    user,
    loading,
    signup,
    login,
    loginWithGoogle,
    logout,
    resetPassword, // Add the new method to the context value
    isGoogleAuthAvailable,
    generateReferralCode
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

