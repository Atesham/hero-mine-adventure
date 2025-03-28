// import React, { createContext, useContext, useEffect, useState } from 'react';
// import { 
//   createUserWithEmailAndPassword, 
//   signInWithEmailAndPassword, 
//   signOut, 
//   onAuthStateChanged,
//   GoogleAuthProvider,
//   signInWithPopup,
//   updateProfile,
//   sendPasswordResetEmail,
//   User as FirebaseUser
// } from 'firebase/auth';
// import { auth, db } from '@/lib/firebase';
// import { toast } from 'sonner';
// import { doc, getDoc, setDoc, serverTimestamp, updateDoc, increment, collection, query, where, getDocs, addDoc } from 'firebase/firestore';
// import { generateRandomReferralCode } from '@/referralService';

// interface AuthContextType {
//   user: FirebaseUser | null;
//   loading: boolean;
//   signup: (email: string, password: string, displayName: string, referralCode?: string) => Promise<void>;
//   login: (email: string, password: string) => Promise<void>;
//   loginWithGoogle: () => Promise<void>;
//   logout: () => Promise<void>;
//   resetPassword: (email: string) => Promise<void>;

//   isGoogleAuthAvailable: boolean;
//   generateReferralCode: () => string;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };

// export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [user, setUser] = useState<FirebaseUser | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [isGoogleAuthAvailable, setIsGoogleAuthAvailable] = useState(true);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (user) => {
//       setUser(user);
      
//       if (user) {
//         // Check if user document exists, if not create it
//         try {
//           console.log("Auth state changed, user:", user.uid);
//           const userRef = doc(db, 'users', user.uid);
//           const userSnap = await getDoc(userRef);
          
//           if (!userSnap.exists()) {
//             console.log("Creating new user document");
//             // Create new user document with a referral code
//             const referralCode = generateRandomReferralCode(user.displayName || user.email?.split('@')[0] || '');
            
//             await setDoc(userRef, {
//               displayName: user.displayName || user.email?.split('@')[0],
//               email: user.email,
//               coins: 0,
//               totalMined: 0,
//               createdAt: serverTimestamp(),
//               referralCode: referralCode
//             });
            
//             console.log('Created new user with referral code:', referralCode);
//           } else if (!userSnap.data().referralCode) {
//             console.log("Adding referral code to existing user");
//             // If user exists but doesn't have a referral code, add one
//             const referralCode = generateRandomReferralCode(user.displayName || user.email?.split('@')[0] || '');
//             await updateDoc(userRef, {
//               referralCode: referralCode
//             });
//             console.log('Added referral code to existing user:', referralCode);
//           }
//         } catch (error) {
//           console.error("Error checking/creating user document:", error);
//         }
//       }
      
//       setLoading(false);
//     });

//     return unsubscribe;
//   }, []);


//   const resetPassword = async (email: string) => {
//     try {
//       await sendPasswordResetEmail(auth, email);
//       toast.success('Password reset email sent!', {
//         description: 'Please check your inbox for instructions to reset your password.',
//         duration: 5000
//       });
//     } catch (error: any) {
//       console.error('Password reset error:', error);
      
//       if (error.code === 'auth/user-not-found') {
//         throw new Error('No account found with this email address.');
//       } else if (error.code === 'auth/invalid-email') {
//         throw new Error('Please enter a valid email address.');
//       } else if (error.code === 'auth/too-many-requests') {
//         throw new Error('Too many requests. Please try again later.');
//       } else {
//         throw new Error(error.message || 'Failed to send password reset email');
//       }
//     }
//   };

//   const generateReferralCode = () => {
//     return generateRandomReferralCode(
//       user ? (user.displayName || user.email?.split('@')[0] || '') : ''
//     );
//   };

//   const signup = async (email: string, password: string, displayName: string, referralCode?: string) => {
//     try {
//       const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
//       if (userCredential.user) {
//         await updateProfile(userCredential.user, { displayName });
//         setUser({ ...userCredential.user, displayName });
        
//         const userReferralCode = generateRandomReferralCode(displayName);
//         const userRef = doc(db, 'users', userCredential.user.uid);
        
//         let initialCoins = 0;
        
//         if (referralCode) {
//           const usersCollection = collection(db, 'users');
//           const referrerQuery = query(usersCollection, where('referralCode', '==', referralCode));
//           const referrerSnapshot = await getDocs(referrerQuery);
          
//           if (!referrerSnapshot.empty) {
//             const referrerDoc = referrerSnapshot.docs[0];
//             const referrerId = referrerDoc.id;
            
//             initialCoins = 10;
            
//             const referrerRef = doc(db, 'users', referrerId);
//             await updateDoc(referrerRef, {
//               coins: increment(25)
//             });
            
//             await addDoc(collection(db, 'transactions'), {
//               userId: referrerId,
//               type: 'reward',
//               amount: 25,
//               description: `Referral bonus for inviting ${displayName}`,
//               timestamp: serverTimestamp(),
//               counterpartyName: displayName
//             });
            
//             await addDoc(collection(db, 'transactions'), {
//               userId: userCredential.user.uid,
//               type: 'reward',
//               amount: 10,
//               description: 'Welcome bonus for joining via referral',
//               timestamp: serverTimestamp()
//             });
            
//             await addDoc(collection(db, 'referrals'), {
//               referrerId: referrerId,
//               referredId: userCredential.user.uid,
//               referredName: displayName,
//               referrerName: referrerDoc.data().displayName,
//               timestamp: serverTimestamp(),
//               status: 'completed',
//               rewardAmount: 25
//             });
            
//             toast.success('Referral bonus applied!');
//           } else {
//             toast.error('Invalid referral code');
//           }
//         }
        
//         await setDoc(userRef, {
//           displayName,
//           email,
//           coins: initialCoins,
//           totalMined: 0,
//           createdAt: serverTimestamp(),
//           referralCode: userReferralCode
//         });
        
//         toast.success('Account created successfully!');
//       }
//     } catch (error: any) {
//       console.error('Signup error:', error);
      
//       if (error.code === 'auth/email-already-in-use') {
//         throw new Error('This email is already in use. Please try a different one.');
//       } else if (error.code === 'auth/invalid-email') {
//         throw new Error('Please enter a valid email address.');
//       } else if (error.code === 'auth/weak-password') {
//         throw new Error('Password is too weak. Please use at least 6 characters.');
//       } else {
//         throw new Error(error.message || 'Failed to create account');
//       }
//     }
//   };

//   const login = async (email: string, password: string) => {
//     try {
//       await signInWithEmailAndPassword(auth, email, password);
//       toast.success('Logged in successfully!');
//     } catch (error: any) {
//       console.error('Login error:', error);
      
//       if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
//         throw new Error('Invalid email or password. Please try again.');
//       } else if (error.code === 'auth/too-many-requests') {
//         throw new Error('Too many failed login attempts. Please try again later.');
//       } else {
//         throw new Error(error.message || 'Failed to log in');
//       }
//     }
//   };

//   const loginWithGoogle = async () => {
//     try {
//       const provider = new GoogleAuthProvider();
//       await signInWithPopup(auth, provider);
//       toast.success('Logged in successfully with Google!');
//     } catch (error: any) {
//       console.error('Google login error:', error);
      
//       if (error.code === 'auth/unauthorized-domain') {
//         setIsGoogleAuthAvailable(false);
//         toast.error('Google login is not available in this environment', {
//           description: 'Please use email/password login instead.',
//           duration: 5000
//         });
//         throw new Error('This domain is not authorized for Google login. Please use email/password login instead.');
//       } else {
//         throw new Error(error.message || 'Failed to log in with Google');
//       }
//     }
//   };

//   const logout = async () => {
//     try {
//       await signOut(auth);
//       toast.success('Logged out successfully!');
//     } catch (error: any) {
//       console.error('Logout error:', error);
//       throw new Error(error.message || 'Failed to log out');
//     }
//   };

//   const value = {
//     user,
//     loading,
//     signup,
//     login,
//     loginWithGoogle,
//     logout,
//     resetPassword, // Add the new method to the context value
//     isGoogleAuthAvailable,
//     generateReferralCode
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {!loading && children}
//     </AuthContext.Provider>
//   );
// };




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
  sendEmailVerification,
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
  resendVerificationEmail: () => Promise<void>;
  isGoogleAuthAvailable: boolean;
  generateReferralCode: () => string;
  verificationEmailSent: boolean;
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
  const [verificationEmailSent, setVerificationEmailSent] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // Only set user if email is verified
        if (currentUser.emailVerified) {
          setUser(currentUser);
          
          // Check/create user document
          try {
            const userRef = doc(db, 'users', currentUser.uid);
            const userSnap = await getDoc(userRef);
            
            if (!userSnap.exists()) {
              const referralCode = generateRandomReferralCode(currentUser.displayName || currentUser.email?.split('@')[0] || '');
              await setDoc(userRef, {
                displayName: currentUser.displayName || currentUser.email?.split('@')[0],
                email: currentUser.email,
                coins: 0,
                totalMined: 0,
                createdAt: serverTimestamp(),
                referralCode: referralCode,
                emailVerified: true
              });
            }
          } catch (error) {
            console.error("Error handling user document:", error);
          }
        } else {
          // If user is not verified, sign them out
          await signOut(auth);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const resendVerificationEmail = async () => {
    if (!auth.currentUser) return;
    try {
      await sendEmailVerification(auth.currentUser);
      setVerificationEmailSent(true);
      toast.success('Verification email resent!');
    } catch (error) {
      console.error('Error resending verification email:', error);
      toast.error('Failed to resend verification email');
    }
  };

  const signup = async (email: string, password: string, displayName: string, referralCode?: string) => {
    try {
      setLoading(true);
      
      // 1. Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // 2. Update profile with display name
      await updateProfile(user, { displayName });
      
      // 3. Send verification email
      await sendEmailVerification(user);
      setVerificationEmailSent(true);
      
      // 4. Create temporary user document with emailVerified: false
      const userReferralCode = generateRandomReferralCode(displayName);
      const userRef = doc(db, 'users', user.uid);
      
      await setDoc(userRef, {
        displayName,
        email,
        coins: 0,
        totalMined: 0,
        createdAt: serverTimestamp(),
        referralCode: userReferralCode,
        emailVerified: false // Mark as unverified
      });

      // 5. Handle referral code if provided (mark as pending)
      if (referralCode) {
        const referrerQuery = query(collection(db, 'users'), where('referralCode', '==', referralCode));
        const referrerSnapshot = await getDocs(referrerQuery);
        
        if (!referrerSnapshot.empty) {
          const referrerDoc = referrerSnapshot.docs[0];
          await addDoc(collection(db, 'referrals'), {
            referrerId: referrerDoc.id,
            referredId: user.uid,
            referredName: displayName,
            referrerName: referrerDoc.data().displayName,
            timestamp: serverTimestamp(),
            status: 'pending',
            rewardAmount: 25
          });
        }
      }
      
      // 6. Immediately sign out the user
      await signOut(auth);
      
      toast.success('Account created! Please verify your email to continue.');
      
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
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Check if email is verified
      if (!user.emailVerified) {
        await signOut(auth);
        await sendEmailVerification(user);
        setVerificationEmailSent(true);
        throw new Error('Please verify your email first. We sent a new verification link.');
      }
      
      // Check Firestore verification status
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists() || userDoc.data()?.emailVerified !== true) {
        await signOut(auth);
        throw new Error('Email verification required. Please check your inbox.');
      }
      
      // Complete any pending referrals
      if (userDoc.data()?.referralCode) {
        const pendingReferrals = await getDocs(
          query(collection(db, 'referrals'), 
          where('referredId', '==', user.uid),
          where('status', '==', 'pending')
        ));
        
        if (!pendingReferrals.empty) {
          const batchUpdates = pendingReferrals.docs.map(async (referralDoc) => {
            await updateDoc(referralDoc.ref, { status: 'completed' });
            await updateDoc(doc(db, 'users', referralDoc.data().referrerId), {
              coins: increment(referralDoc.data().rewardAmount)
            });
          });
          await Promise.all(batchUpdates);
          
          await updateDoc(doc(db, 'users', user.uid), {
            coins: increment(10) // Welcome bonus
          });
        }
      }
      
      toast.success('Logged in successfully!');
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        throw new Error('Invalid email or password. Please try again.');
      } else if (error.code === 'auth/too-many-requests') {
        throw new Error('Too many failed login attempts. Please try again later.');
      } else {
        throw error;
      }
    } finally {
      setLoading(false);
    }
  };

  // ... (rest of the methods remain the same: , , , generateReferralCode)

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

  const value = {
    user,
    loading,
    signup,
    login,
    loginWithGoogle,
    logout,
    resetPassword,
    resendVerificationEmail,
    isGoogleAuthAvailable,
    generateReferralCode,
    verificationEmailSent
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};