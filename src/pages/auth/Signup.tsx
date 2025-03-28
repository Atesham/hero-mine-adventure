// import React, { useState, useEffect } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { useAuth } from '@/contexts/AuthContext';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { toast } from 'sonner';
// import { Loader2, Mail, Key, User, EyeIcon, EyeOffIcon, Gift, CheckCircle, ArrowRight } from 'lucide-react';
// import { useForm } from 'react-hook-form';
// import { z } from 'zod';
// import app from "@/lib/firebase";
// import { zodResolver } from '@hookform/resolvers/zod';
// import { getFirestore, doc, setDoc, serverTimestamp, getDoc } from "firebase/firestore"; 
// import Navbar from '@/components/layout/Navbar';
// import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
// import { motion } from 'framer-motion';

// const auth = getAuth(app);
// const db = getFirestore(app);

// // Zod schema for form validation
// const signupSchema = z.object({
//   username: z.string()
//     .min(3, 'Username must be at least 3 characters')
//     .max(20, 'Username must be less than 20 characters')
//     .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
//   email: z.string().email('Please enter a valid email address'),
//   password: z.string()
//     .min(6, 'Password must be at least 6 characters')
//     .max(100, 'Password must be less than 100 characters'),
//   confirmPassword: z.string(),
//   referralCode: z.string().optional(),
// }).refine(data => data.password === data.confirmPassword, {
//   message: "Passwords do not match",
//   path: ["confirmPassword"],
// });

// type SignupFormValues = z.infer<typeof signupSchema>;

// const Signup = () => {
//   const navigate = useNavigate();
//   const { signup, loginWithGoogle, isGoogleAuthAvailable } = useAuth();

//   const [loading, setLoading] = useState(false);
//   const [googleLoading, setGoogleLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [emailSent, setEmailSent] = useState(false);
//   const [countdown, setCountdown] = useState(30);
//   const [referralValid, setReferralValid] = useState<boolean | null>(null);
//   const [referralLoading, setReferralLoading] = useState(false);

//   const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<SignupFormValues>({
//     resolver: zodResolver(signupSchema),
//     mode: 'onBlur',
//     defaultValues: {
//       referralCode: '',
//     }
//   });

//   // Countdown timer for resend verification
//   useEffect(() => {
//     if (emailSent && countdown > 0) {
//       const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
//       return () => clearTimeout(timer);
//     }
//   }, [countdown, emailSent]);

//   // Check referral code validity
//   const checkReferralCode = async (code: string) => {
//     if (!code) {
//       setReferralValid(null);
//       return;
//     }

//     try {
//       setReferralLoading(true);
//       const docRef = doc(db, "referrals", code);
//       const docSnap = await getDoc(docRef);
      
//       if (docSnap.exists()) {
//         const data = docSnap.data();
//         setReferralValid(data.active === true);
//         if (data.active) {
//           toast.success('Valid referral code! You\'ll get bonus coins.');
//         } else {
//           toast.error('This referral code is no longer active');
//         }
//       } else {
//         setReferralValid(false);
//         toast.error('Invalid referral code');
//       }
//     } catch (error) {
//       console.error("Error checking referral code:", error);
//       toast.error('Error checking referral code');
//     } finally {
//       setReferralLoading(false);
//     }
//   };

//   const handleGoogleSignup = async () => {
//     try {
//       setGoogleLoading(true);
//       await loginWithGoogle();
//       navigate('/');
//     } catch (error: any) {
//       toast.error(error.message || 'Failed to sign up with Google');
//     } finally {
//       setGoogleLoading(false);
//     }
//   };

//   const onSubmit = async (data: SignupFormValues) => {
//     try {
//       setLoading(true);
      
//       // Create user with email/password
//       const userCredential = await createUserWithEmailAndPassword(
//         auth,
//         data.email,
//         data.password
//       );

//       // Prepare user data
//       const userData: any = {
//         email: data.email,
//         username: data.username,
//         createdAt: serverTimestamp(),
//         emailVerified: false,
//         lastLogin: serverTimestamp(),
//         coins: 0 , // Starting coins
//       };

//       // Add referral bonus if valid
//       if (data.referralCode && referralValid) {
//         userData.referralCode = data.referralCode;
//         userData.coins += 25; // Bonus coins
//         userData.referredBy = data.referralCode;
        
//         // Update referral code usage (in a transaction in production)
//         await setDoc(doc(db, "referralUsage", `${data.referralCode}_${userCredential.user.uid}`), {
//           usedAt: serverTimestamp(),
//           newUserId: userCredential.user.uid,
//           newUserEmail: data.email,
//         });
//       }

//       // Store user data in Firestore
//       await setDoc(doc(db, "users", userCredential.user.uid), userData);

//       // Send verification email
//       await sendEmailVerification(userCredential.user, {
//         url: `${window.location.origin}/login?verified=true&newuser=true`,
//         handleCodeInApp: true
//       });
      
//       setEmailSent(true);
//       setCountdown(30); // Reset countdown
      
//     } catch (error: any) {
//       if (error.code === 'auth/email-already-in-use') {
//         toast.error('Email already in use. Please log in.');
//       } else if (error.code === 'auth/weak-password') {
//         toast.error('Password should be at least 6 characters');
//       } else {
//         console.error('Signup error:', error);
//         toast.error(error.message || 'Failed to create account');
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col bg-background">
//       <Navbar />
//       <div className="flex min-h-screen flex-1 flex-col justify-center px-6 py-12 lg:px-8">
//         <div className="glass-card sm:mx-auto sm:w-full sm:max-w-md p-8 rounded-xl">
//           <div className="mb-10 flex flex-col items-center">
//             <Link to="/" className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
//               Hero Coin
//             </Link>
//             <h2 className="mt-5 text-center text-2xl font-bold leading-9">
//               Create your account
//             </h2>
//             <p className="mt-2 text-center text-sm text-muted-foreground">
//               Already have an account?{' '}
//               <Link to="/login" className="font-semibold text-primary hover:text-primary/90">
//                   Sign in
//                 </Link>
//               </p>
//             </div>

//             {emailSent ? (
//               <motion.div 
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.5 }}
//                 className="text-center space-y-6"
//               >
//                 <div className="inline-flex items-center justify-center rounded-full bg-green-100 p-4">
//                   <CheckCircle className="h-12 w-12 text-green-600" />
//                 </div>
//                 <h3 className="text-xl font-semibold">Almost There!</h3>
//                 <p className="text-muted-foreground">
//                   We've sent a verification link to <span className="font-medium text-foreground">{watch('email')}</span>.
//                 </p>
                
//                 <div className="space-y-4">
//                   <div className="flex items-center justify-center gap-2">
//                     <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
//                     <div className="h-2 w-2 rounded-full bg-primary animate-pulse delay-100" />
//                     <div className="h-2 w-2 rounded-full bg-primary animate-pulse delay-200" />
//                   </div>
                  
//                   <p className="text-sm text-muted-foreground">
//                     Check your spam folder if you don't see it in your inbox.
//                   </p>
                  
//                   <div className="pt-4">
//                     <Button
//                       variant="outline"
//                       className="w-full"
//                       onClick={() => navigate('/login')}
//                     >
//                       Go to Login <ArrowRight className="ml-2 h-4 w-4" />
//                     </Button>
//                   </div>
                  
//                   <div className="pt-2">
//                     <Button
//                       variant="ghost"
//                       disabled={countdown > 0}
//                       onClick={handleSubmit(onSubmit)}
//                       className="text-sm"
//                     >
//                       {countdown > 0 ? (
//                         `Resend email in ${countdown}s`
//                       ) : (
//                         'Resend verification email'
//                       )}
//                     </Button>
//                   </div>
//                 </div>
//               </motion.div>
//             ) : (
//               <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
//                 <div className="space-y-2">
//                   <Label htmlFor="username" className="flex items-center gap-1">
//                     <User className="h-4 w-4" />
//                     Username
//                   </Label>
//                   <Input
//                     id="username"
//                     type="text"
//                     autoComplete="username"
//                     {...register('username')}
//                     className={errors.username ? 'border-destructive' : ''}
//                   />
//                   {errors.username && (
//                     <p className="text-sm text-destructive">{errors.username.message}</p>
//                   )}
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="email" className="flex items-center gap-1">
//                     <Mail className="h-4 w-4" />
//                     Email address
//                   </Label>
//                   <Input
//                     id="email"
//                     type="email"
//                     autoComplete="email"
//                     {...register('email')}
//                     className={errors.email ? 'border-destructive' : ''}
//                   />
//                   {errors.email && (
//                     <p className="text-sm text-destructive">{errors.email.message}</p>
//                   )}
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="password" className="flex items-center gap-1">
//                     <Key className="h-4 w-4" />
//                     Password
//                   </Label>
//                   <div className="relative">
//                     <Input
//                       id="password"
//                       type={showPassword ? 'text' : 'password'}
//                       autoComplete="new-password"
//                       {...register('password')}
//                       className={errors.password ? 'border-destructive pr-10' : 'pr-10'}
//                     />
//                     <button
//                       type="button"
//                       className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
//                       onClick={() => setShowPassword(!showPassword)}
//                     >
//                       {showPassword ? (
//                         <EyeOffIcon className="h-4 w-4" />
//                       ) : (
//                         <EyeIcon className="h-4 w-4" />
//                       )}
//                     </button>
//                   </div>
//                   {errors.password && (
//                     <p className="text-sm text-destructive">{errors.password.message}</p>
//                   )}
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="confirmPassword" className="flex items-center gap-1">
//                     <Key className="h-4 w-4" />
//                     Confirm Password
//                   </Label>
//                   <div className="relative">
//                     <Input
//                       id="confirmPassword"
//                       type={showPassword ? 'text' : 'password'}
//                       autoComplete="new-password"
//                       {...register('confirmPassword')}
//                       className={errors.confirmPassword ? 'border-destructive pr-10' : 'pr-10'}
//                     />
//                   </div>
//                   {errors.confirmPassword && (
//                     <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
//                   )}
//                 </div>

//               <div className="space-y-2">
//                 <div className="flex items-center justify-between">
//                   <Label htmlFor="referralCode" className="flex items-center gap-1">
//                     <Gift className="h-4 w-4" />
//                     Referral Code (Optional)
//                   </Label>
//                   {referralValid !== null && (
//                     <span className={`text-xs ${referralValid ? 'text-green-600' : 'text-destructive'}`}>
//                       {referralValid ? 'Valid!' : 'Invalid'}
//                     </span>
//                   )}
//                 </div>
//                 <div className="flex gap-2">
//                   <Input
//                     id="referralCode"
//                     type="text"
//                     placeholder="Enter referral code"
//                     {...register('referralCode', {
//                       onChange: (e) => checkReferralCode(e.target.value)
//                     })}
//                   />
//                 </div>
//                 <p className="text-xs text-muted-foreground">
//                   {referralValid ? 
//                     'You\'ll get 50 bonus coins!' : 
//                     'Get 50 bonus coins with a valid code'}
//                 </p>
//               </div>

//               <Button
//                 type="submit"
//                 className="w-full"
//                 disabled={loading || referralLoading}
//               >
//                 {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
//                 Sign Up
//               </Button>

//               <div className="relative">
//                 <div className="absolute inset-0 flex items-center">
//                   <div className="w-full border-t border-border"></div>
//                 </div>
//                 <div className="relative flex justify-center text-sm">
//                   <span className="px-2 bg-card text-muted-foreground">Or sign up with</span>
//                 </div>
//               </div>

//               <Button
//                 type="button"
//                 variant="outline"
//                 className="w-full"
//                 onClick={handleGoogleSignup}
//                 disabled={googleLoading || !isGoogleAuthAvailable}
//               >
//                 {googleLoading ? (
//                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                 ) : (
//                   <svg className="mr-2 h-4 w-4" viewBox="0 0 48 48" aria-hidden="true">
//                     <path
//                       fill="#FFC107"
//                       d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
//                     />
//                     <path
//                       fill="#FF3D00"
//                       d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
//                     />
//                     <path
//                       fill="#4CAF50"
//                       d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
//                     />
//                     <path
//                       fill="#1976D2"
//                       d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
//                     />
//                   </svg>
//                 )}
//                 Sign up with Google
//               </Button>
//             </form>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Signup;


import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2, Mail, Key, User, EyeIcon, EyeOffIcon, Gift, CheckCircle, ArrowRight } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import app from "@/lib/firebase";
import { zodResolver } from '@hookform/resolvers/zod';
import { getFirestore, doc, setDoc, serverTimestamp, getDoc } from "firebase/firestore"; 
import Navbar from '@/components/layout/Navbar';
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, onAuthStateChanged } from "firebase/auth";
import { motion } from 'framer-motion';

const auth = getAuth(app);
const db = getFirestore(app);

// Zod schema for form validation
const signupSchema = z.object({
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be less than 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string()
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password must be less than 100 characters'),
  confirmPassword: z.string(),
  referralCode: z.string().optional(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type SignupFormValues = z.infer<typeof signupSchema>;

const Signup = () => {
  const navigate = useNavigate();
  const { signup, loginWithGoogle, isGoogleAuthAvailable } = useAuth();

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [referralValid, setReferralValid] = useState<boolean | null>(null);
  const [referralLoading, setReferralLoading] = useState(false);
  const [verificationChecked, setVerificationChecked] = useState(false);
  const prevUserRef = useRef<any>(null);

  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    mode: 'onBlur',
    defaultValues: {
      referralCode: '',
    }
  });

  // Countdown timer for resend verification
  useEffect(() => {
    if (emailSent && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown, emailSent]);

  // Check referral code validity
  const checkReferralCode = async (code: string) => {
    if (!code) {
      setReferralValid(null);
      return;
    }

    try {
      setReferralLoading(true);
      const docRef = doc(db, "referrals", code);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        setReferralValid(data.active === true);
        if (data.active) {
          toast.success('Valid referral code! You\'ll get bonus coins.');
        } else {
          toast.error('This referral code is no longer active');
        }
      } else {
        setReferralValid(false);
        toast.error('Invalid referral code');
      }
    } catch (error) {
      console.error("Error checking referral code:", error);
      toast.error('Error checking referral code');
    } finally {
      setReferralLoading(false);
    }
  };

  // Listen for auth state changes after email is sent
  useEffect(() => {
    if (!emailSent) return;

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Check if email was just verified
        if (user.emailVerified && !prevUserRef.current?.emailVerified) {
          // Refresh token to get latest claims
          await user.getIdToken(true);
          setVerificationChecked(true);
          toast.success('Email verified successfully! Redirecting...');
          navigate('/dashboard'); // Redirect to your app's main page
        }
        prevUserRef.current = user;
      }
    });

    return () => unsubscribe();
  }, [emailSent, navigate]);

  const handleGoogleSignup = async () => {
    try {
      setGoogleLoading(true);
      await loginWithGoogle();
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign up with Google');
    } finally {
      setGoogleLoading(false);
    }
  };

  const onSubmit = async (data: SignupFormValues) => {
    try {
      setLoading(true);
      
      // Create user with email/password
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      // Prepare user data
      const userData: any = {
        email: data.email,
        username: data.username,
        createdAt: serverTimestamp(),
        emailVerified: false,
        lastLogin: serverTimestamp(),
        coins: 0, // Starting coins
      };

      // Add referral bonus if valid
      if (data.referralCode && referralValid) {
        userData.referralCode = data.referralCode;
        userData.coins += 25; // Bonus coins
        userData.referredBy = data.referralCode;
        
        // Update referral code usage
        await setDoc(doc(db, "referralUsage", `${data.referralCode}_${userCredential.user.uid}`), {
          usedAt: serverTimestamp(),
          newUserId: userCredential.user.uid,
          newUserEmail: data.email,
        });
      }

      // Store user data in Firestore
      await setDoc(doc(db, "users", userCredential.user.uid), userData);

      // In your signup onSubmit function
await sendEmailVerification(userCredential.user, {
  url: `${window.location.origin}/verify-email`, // Changed to a dedicated route
  handleCodeInApp: true
});
      setEmailSent(true);
      setCountdown(30); // Reset countdown
      toast.success('Verification email sent! Please check your inbox.');
      
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        toast.error('Email already in use. Please log in.');
      } else if (error.code === 'auth/weak-password') {
        toast.error('Password should be at least 6 characters');
      } else {
        console.error('Signup error:', error);
        toast.error(error.message || 'Failed to create account');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <div className="flex min-h-screen flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="glass-card sm:mx-auto sm:w-full sm:max-w-md p-8 rounded-xl">
          <div className="mb-10 flex flex-col items-center">
            <Link to="/" className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
              Your App Name
            </Link>
            <h2 className="mt-5 text-center text-2xl font-bold leading-9">
              Create your account
            </h2>
            <p className="mt-2 text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-primary hover:text-primary/90">
                Sign in
              </Link>
            </p>
          </div>

          {emailSent ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center space-y-6"
            >
              <div className="inline-flex items-center justify-center rounded-full bg-green-100 p-4">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold">Almost There!</h3>
              <p className="text-muted-foreground">
                We've sent a verification link to <span className="font-medium text-foreground">{watch('email')}</span>.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                  <div className="h-2 w-2 rounded-full bg-primary animate-pulse delay-100" />
                  <div className="h-2 w-2 rounded-full bg-primary animate-pulse delay-200" />
                </div>
                
                <p className="text-sm text-muted-foreground">
                  {verificationChecked 
                    ? 'Verification complete! Redirecting...'
                    : 'We\'ll automatically log you in once your email is verified.'}
                </p>
                
                <div className="pt-4">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => navigate('/login')}
                  >
                    Go to Login <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
                
                <div className="pt-2">
                  <Button
                    variant="ghost"
                    disabled={countdown > 0}
                    onClick={handleSubmit(onSubmit)}
                    className="text-sm"
                  >
                    {countdown > 0 ? (
                      `Resend email in ${countdown}s`
                    ) : (
                      'Resend verification email'
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-2">
                <Label htmlFor="username" className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  autoComplete="username"
                  {...register('username')}
                  className={errors.username ? 'border-destructive' : ''}
                />
                {errors.username && (
                  <p className="text-sm text-destructive">{errors.username.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  Email address
                </Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  {...register('email')}
                  className={errors.email ? 'border-destructive' : ''}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="flex items-center gap-1">
                  <Key className="h-4 w-4" />
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    {...register('password')}
                    className={errors.password ? 'border-destructive pr-10' : 'pr-10'}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOffIcon className="h-4 w-4" />
                    ) : (
                      <EyeIcon className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="flex items-center gap-1">
                  <Key className="h-4 w-4" />
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    {...register('confirmPassword')}
                    className={errors.confirmPassword ? 'border-destructive pr-10' : 'pr-10'}
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="referralCode" className="flex items-center gap-1">
                    <Gift className="h-4 w-4" />
                    Referral Code (Optional)
                  </Label>
                  {referralValid !== null && (
                    <span className={`text-xs ${referralValid ? 'text-green-600' : 'text-destructive'}`}>
                      {referralValid ? 'Valid!' : 'Invalid'}
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <Input
                    id="referralCode"
                    type="text"
                    placeholder="Enter referral code"
                    {...register('referralCode', {
                      onChange: (e) => checkReferralCode(e.target.value)
                    })}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  {referralValid ? 
                    'You\'ll get 25 bonus coins!' : 
                    'Get 25 bonus coins with a valid code'}
                </p>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={loading || referralLoading}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign Up
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-card text-muted-foreground">Or sign up with</span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleGoogleSignup}
                disabled={googleLoading || !isGoogleAuthAvailable}
              >
                {googleLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 48 48" aria-hidden="true">
                    <path
                      fill="#FFC107"
                      d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                    />
                    <path
                      fill="#FF3D00"
                      d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                    />
                    <path
                      fill="#4CAF50"
                      d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                    />
                    <path
                      fill="#1976D2"
                      d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                    />
                  </svg>
                )}
                Sign up with Google
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Signup;