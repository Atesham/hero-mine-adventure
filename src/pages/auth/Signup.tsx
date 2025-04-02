// import React, { useState, useEffect } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { useAuth } from '@/contexts/AuthContext';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { toast } from 'sonner';
// import { Loader2, Mail, Key, User, EyeIcon, EyeOffIcon, Gift, CheckCircle, ArrowRight, Clock, RefreshCw } from 'lucide-react';
// import { useForm } from 'react-hook-form';
// import { z } from 'zod';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { doc, getDoc, setDoc, serverTimestamp, increment, collection, query, getDocs, where, updateDoc, addDoc } from "firebase/firestore";
// import Navbar from '@/components/layout/Navbar';
// import { motion } from 'framer-motion';
// import { db, auth } from '@/lib/firebase';
// import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from 'firebase/auth';
// import { generateRandomReferralCode } from '@/services/referralService';

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
//   const [loading, setLoading] = useState(false);
//   const [googleLoading, setGoogleLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [emailSent, setEmailSent] = useState(false);
//   const [countdown, setCountdown] = useState(30);
//   const [referralValid, setReferralValid] = useState<boolean | null>(null);
//   const [referralLoading, setReferralLoading] = useState(false);
//   const [verificationCheckCount, setVerificationCheckCount] = useState(0);
//   const [isVerifying, setIsVerifying] = useState(false);
//   const [referralChecked, setReferralChecked] = useState(false);

//   const { 
//     register, 
//     handleSubmit, 
//     formState: { errors, isValid }, 
//     watch, 
//     setValue,
//     trigger
//   } = useForm<SignupFormValues>({
//     resolver: zodResolver(signupSchema),
//     mode: 'onBlur',
//     defaultValues: {
//       referralCode: '',
//     }
//   });

//   // Auto-check verification status after email is sent
//   useEffect(() => {
//     if (!emailSent) return;

//     const checkVerification = async () => {
//       try {
//         setIsVerifying(true);
//         await auth.currentUser?.reload();
        
//         if (auth.currentUser?.emailVerified) {
//           navigate('/');
//           toast.success('Email verified successfully!');
//         } else if (verificationCheckCount < 12) {
//           setTimeout(() => {
//             setVerificationCheckCount(verificationCheckCount + 1);
//           }, 5000);
//         }
//       } catch (error) {
//         console.error("Verification check error:", error);
//       } finally {
//         setIsVerifying(false);
//       }
//     };

//     checkVerification();
//   }, [emailSent, verificationCheckCount, navigate]);

//   // Countdown timer for resend verification
//   useEffect(() => {
//     if (emailSent && countdown > 0) {
//       const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
//       return () => clearTimeout(timer);
//     }
//   }, [countdown, emailSent]);

//   // Check referral code validity
//   const checkReferralCode = async (code: string) => {
//     if (!code || code.trim() === '') {
//       setReferralValid(null);
//       setReferralChecked(true);
//       return true;
//     }

//     try {
//       setReferralLoading(true);
//       const usersRef = collection(db, "users");
//       const q = query(usersRef, where("referralCode", "==", code));
//       const querySnapshot = await getDocs(q);
      
//       const isValid = !querySnapshot.empty;
//       setReferralValid(isValid);
//       setReferralChecked(true);
      
//       if (isValid) {
//         toast.success('Valid referral code! You\'ll get 25 bonus coins.');
//       } else {
//         toast.error('Invalid referral code - please check and try again');
//       }
//       return isValid;
//     } catch (error) {
//       console.error("Error checking referral code:", error);
//       toast.error('Error checking referral code');
//       setReferralChecked(true);
//       return false;
//     } finally {
//       setReferralLoading(false);
//     }
//   };

//   const handleReferralChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const code = e.target.value;
//     setValue('referralCode', code);
//     await trigger('referralCode');
//     await checkReferralCode(code);
//   };

//   const handleGoogleSignup = async () => {
//     try {
//       setGoogleLoading(true);
//       const { loginWithGoogle } = useAuth();
//       await loginWithGoogle();
//       navigate('/');
//     } catch (error: any) {
//       toast.error(error.message || 'Failed to sign up with Google');
//     } finally {
//       setGoogleLoading(false);
//     }
//   };

//   const onSubmit = async (data: SignupFormValues) => {
//     if (data.referralCode && data.referralCode.trim() !== '') {
//       const isValid = await checkReferralCode(data.referralCode);
//       if (!isValid) return;
//     }

//     try {
//       setLoading(true);
      
//       // Create user account
//       const userCredential = await createUserWithEmailAndPassword(
//         auth,
//         data.email,
//         data.password
//       );

//       // Generate a UNIQUE referral code for this new user
//       const userReferralCode = await generateRandomReferralCode(data.username);

//       // Prepare user data with the new unique referral code
//       const userData: any = {
//         email: data.email,
//         username: data.username,
//         createdAt: serverTimestamp(),
//         emailVerified: false,
//         lastLogin: serverTimestamp(),
//         coins: 0,
//         referralCode: userReferralCode,
//       };

//       // Handle referral bonus if they used someone else's code
//       if (data.referralCode && referralValid) {
//         userData.referredBy = data.referralCode;
//         userData.coins += 25; // Bonus for new user
        
//         // Record the referral usage
//         await setDoc(
//           doc(db, "referralUsage", `${data.referralCode}_${userCredential.user.uid}`), 
//           {
//             usedAt: serverTimestamp(),
//             newUserId: userCredential.user.uid,
//             newUserEmail: data.email,
            
//             referralCode: data.referralCode,
//             bonusApplied: 25,
//             status: 'completed'
//           }
//         );

//         // Find the referrer
//         const referrerQuery = query(
//           collection(db, "users"), 
//           where("referralCode", "==", data.referralCode)
//         );
//         const referrerSnapshot = await getDocs(referrerQuery);
        
//         if (!referrerSnapshot.empty) {
//           const referrerDoc = referrerSnapshot.docs[0];
//           const referrerId = referrerDoc.id;
//           const referrerName = referrerDoc.data().username || referrerDoc.data().email;

//           // Reward the referrer
//           await updateDoc(doc(db, "users", referrerId), {
//             coins: increment(50),
//             referralCount: increment(1)
//           });

//           // Create transaction for REFERRER (25 coins)
//           await addDoc(collection(db, "transactions"), {
//             userId: referrerId,
//             type: 'referral',
//             amount: 50,
//             description: `Referral bonus for ${data.username}`,
//             timestamp: serverTimestamp(),
//             counterpartyId: userCredential.user.uid,
//             counterpartyName: data.username,
//             status: 'completed'
//           });

//           // Create transaction for NEW USER (25 coins)
//           await addDoc(collection(db, "transactions"), {
//             userId: userCredential.user.uid,
//             type: 'referral',
//             amount: 25,
//             description: `Signup bonus using ${referrerName}'s code`,
//             timestamp: serverTimestamp(),
//             counterpartyId: referrerId,
//             counterpartyName: referrerName,
//             status: 'completed'
//           });
//         }
//       }

//       // Create the user document
//       await setDoc(doc(db, "users", userCredential.user.uid), userData);
      
//       // Update profile
//       await updateProfile(userCredential.user, { 
//         displayName: data.username 
//       });

//       // Send verification email
//       await sendEmailVerification(userCredential.user, {
//         url: `${window.location.origin}/login?verified=true&newuser=true`,
//         handleCodeInApp: true
//       });
      
//       // Update UI state
//       setEmailSent(true);
//       setCountdown(30);
//       setVerificationCheckCount(0);
      
//       // Show success message
//       toast.success('Account created successfully!', {
//         description: 'Check your transactions for referral bonuses',
//         action: {
//           label: 'Open Email',
//           onClick: () => window.open('https://mail.google.com', '_blank')
//         }
//       });
      
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
  
//   const isFormReady = isValid && (referralValid === null || referralValid === true) && referralChecked;

//   return (
//     <div className="min-h-screen flex flex-col bg-background">
//       <Navbar />
//       <div className="flex min-h-screen flex-1 flex-col justify-center px-6 py-12 lg:px-8">
//         <div className="glass-card sm:mx-auto sm:w-full sm:max-w-md p-8 rounded-xl">
//           <div className="mb-10 flex flex-col items-center">
//             <h2 className="mt-5 text-center text-2xl font-bold leading-9">
//               Create your account
//             </h2>
//             <p className="mt-2 text-center text-sm text-muted-foreground">
//               Already have an account?{' '}
//               <Link to="/login" className="font-semibold text-primary hover:text-primary/90">
//                 Sign in
//               </Link>
//             </p>
//           </div>

//           {emailSent ? (
//             <motion.div 
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5 }}
//               className="text-center space-y-6"
//             >
//               <div className="relative mx-auto w-32 h-32">
//                 <motion.div 
//                   className="absolute inset-0 bg-primary/10 rounded-2xl border-2 border-primary/30"
//                   animate={{ 
//                     rotate: [0, 5, -5, 0],
//                     scale: [1, 1.05, 1]
//                   }}
//                   transition={{ 
//                     duration: 4,
//                     repeat: Infinity,
//                     ease: "easeInOut"
//                   }}
//                 >
//                   <Mail className="w-full h-full p-6 text-primary" />
//                 </motion.div>
                
//                 <motion.div
//                   className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-2 rounded shadow-lg border"
//                   initial={{ y: -20, opacity: 0 }}
//                   animate={{ 
//                     y: [-20, -40, -20],
//                     opacity: [0, 1, 0]
//                   }}
//                   transition={{
//                     duration: 3,
//                     repeat: Infinity,
//                     times: [0, 0.5, 1]
//                   }}
//                 >
//                   <CheckCircle className="h-6 w-6 text-green-500" />
//                 </motion.div>
//               </div>

//               <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
//                 Your Adventure Awaits!
//               </h3>
              
//               <div className="space-y-4">
//                 <p className="text-muted-foreground">
//                   We've sent a magic link to 
//                   <span className="font-medium text-foreground">{watch('email')}</span>.
//                 </p>
                
//                 <div className="relative pt-4">
//                   <div className="h-2 bg-muted rounded-full overflow-hidden">
//                     <motion.div
//                       className="h-full bg-gradient-to-r from-primary to-purple-600"
//                       initial={{ width: 0 }}
//                       animate={{ width: "100%" }}
//                       transition={{ 
//                         duration: 30,
//                         ease: "linear"
//                       }}
//                     />
//                   </div>
//                   <div className="flex justify-between pt-2">
//                     <span className="text-xs text-muted-foreground">Link expires in:</span>
//                     <span className="text-xs font-medium">
//                       {Math.floor(countdown/60)}m {countdown%60}s
//                     </span>
//                   </div>
//                 </div>
                
//                 <motion.div 
//                   className="pt-4 text-sm text-muted-foreground border-t"
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   transition={{ delay: 0.5 }}
//                 >
//                   <motion.div
//                     animate={{ 
//                       y: [0, -20, -40],
//                       opacity: [1, 0, 1]
//                     }}
//                     transition={{
//                       duration: 9,
//                       repeat: Infinity,
//                       repeatType: "reverse"
//                     }}
//                     className="space-y-1"
//                   >
//                     <p className="font-medium">✨ Pro Tip:</p>
//                     <p>
//                       {verificationCheckCount % 3 === 0 
//                         ? "Check your spam folder if you don't see our email" 
//                         : verificationCheckCount % 3 === 1
//                           ? "Verified users get 25 bonus coins to start their journey"
//                           : "Complete your profile after verification for extra rewards"}
//                     </p>
//                   </motion.div>
//                 </motion.div>
                
//                 <div className="pt-6 space-y-3">
//                   <motion.div
//                     whileHover={{ scale: 1.02 }}
//                     whileTap={{ scale: 0.98 }}
//                   >
//                     <Button
//                       variant="outline"
//                       className="w-full"
//                       onClick={() => window.open('https://mail.google.com', '_blank')}
//                     >
//                       Open Gmail <ArrowRight className="ml-2 h-4 w-4" />
//                     </Button>
//                   </motion.div>
                  
//                   <motion.div
//                     whileHover={{ scale: 1.02 }}
//                     whileTap={{ scale: 0.98 }}
//                   >
//                     <Button
//                       variant="ghost"
//                       disabled={countdown > 0}
//                       onClick={handleSubmit(onSubmit)}
//                       className="w-full"
//                     >
//                       {countdown > 0 ? (
//                         <>
//                           <Clock className="mr-2 h-4 w-4" />
//                           Resend in {countdown}s
//                         </>
//                       ) : (
//                         <>
//                           <RefreshCw className="mr-2 h-4 w-4" />
//                           Resend verification
//                         </>
//                       )}
//                     </Button>
//                   </motion.div>
//                 </div>
//               </div>
//             </motion.div>
//           ) : (
//             <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
//               <div className="space-y-2">
//                 <Label htmlFor="username" className="flex items-center gap-1">
//                   <User className="h-4 w-4" />
//                   Username
//                 </Label>
//                 <Input
//                   id="username"
//                   type="text"
//                   autoComplete="username"
//                   {...register('username')}
//                   className={errors.username ? 'border-destructive' : ''}
//                 />
//                 {errors.username && (
//                   <p className="text-sm text-destructive">{errors.username.message}</p>
//                 )}
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="email" className="flex items-center gap-1">
//                   <Mail className="h-4 w-4" />
//                   Email address
//                 </Label>
//                 <Input
//                   id="email"
//                   type="email"
//                   autoComplete="email"
//                   {...register('email')}
//                   className={errors.email ? 'border-destructive' : ''}
//                 />
//                 {errors.email && (
//                   <p className="text-sm text-destructive">{errors.email.message}</p>
//                 )}
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="password" className="flex items-center gap-1">
//                   <Key className="h-4 w-4" />
//                   Password
//                 </Label>
//                 <div className="relative">
//                   <Input
//                     id="password"
//                     type={showPassword ? 'text' : 'password'}
//                     autoComplete="new-password"
//                     {...register('password')}
//                     className={errors.password ? 'border-destructive pr-10' : 'pr-10'}
//                   />
//                   <button
//                     type="button"
//                     className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
//                     onClick={() => setShowPassword(!showPassword)}
//                   >
//                     {showPassword ? (
//                       <EyeOffIcon className="h-4 w-4" />
//                     ) : (
//                       <EyeIcon className="h-4 w-4" />
//                     )}
//                   </button>
//                 </div>
//                 {errors.password && (
//                   <p className="text-sm text-destructive">{errors.password.message}</p>
//                 )}
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="confirmPassword" className="flex items-center gap-1">
//                   <Key className="h-4 w-4" />
//                   Confirm Password
//                 </Label>
//                 <div className="relative">
//                   <Input
//                     id="confirmPassword"
//                     type={showPassword ? 'text' : 'password'}
//                     autoComplete="new-password"
//                     {...register('confirmPassword')}
//                     className={errors.confirmPassword ? 'border-destructive pr-10' : 'pr-10'}
//                   />
//                 </div>
//                 {errors.confirmPassword && (
//                   <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
//                 )}
//               </div>

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
//                     {...register('referralCode')}
//                     onChange={handleReferralChange}
//                   />
//                 </div>
//                 <p className="text-xs text-muted-foreground">
//                   {referralValid ? 
//                     'You\'ll get 25 bonus coins!' : 
//                     'Get 25 bonus coins with a valid code'}
//                 </p>
//                 {referralLoading && (
//                   <div className="flex items-center gap-2 text-xs text-muted-foreground">
//                     <Loader2 className="h-3 w-3 animate-spin" />
//                     Checking referral code...
//                   </div>
//                 )}
//               </div>

//               <Button
//                 type="submit"
//                 className="w-full"
//                 disabled={!isFormReady || loading || referralLoading}
//               >
//                 {loading ? (
//                   <>
//                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                     Creating account...
//                   </>
//                 ) : (
//                   'Sign Up'
//                 )}
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
//                 disabled={googleLoading}
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


// import React, { useState, useEffect } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { useAuth } from '@/contexts/AuthContext';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { toast } from 'sonner';
// import { Loader2, Mail, Key, User, EyeIcon, EyeOffIcon, Gift, CheckCircle, ArrowRight, Clock, RefreshCw } from 'lucide-react';
// import { useForm } from 'react-hook-form';
// import { z } from 'zod';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { doc, getDoc, setDoc, serverTimestamp, increment, collection, query, getDocs, where, updateDoc, addDoc, writeBatch } from "firebase/firestore";
// import Navbar from '@/components/layout/Navbar';
// import { motion } from 'framer-motion';
// import { db, auth } from '@/lib/firebase';
// import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from 'firebase/auth';
// import { generateReferralCode } from '@/services/referralService';

// // Enhanced validation schema
// const signupSchema = z.object({
//   username: z.string()
//     .min(3, 'Username must be at least 3 characters')
//     .max(20, 'Username must be less than 20 characters')
//     .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores')
//     .transform(val => val.trim()),
//   email: z.string()
//     .email('Please enter a valid email address')
//     .transform(val => val.toLowerCase().trim()),
//   password: z.string()
//     .max(100, 'Password must be less than 100 characters'),
//   confirmPassword: z.string(),
//   referralCode: z.string().optional().transform(val => val?.trim()),
// }).refine(data => data.password === data.confirmPassword, {
//   message: "Passwords do not match",
//   path: ["confirmPassword"],
// });

// type SignupFormValues = z.infer<typeof signupSchema>;

// const Signup = () => {
//   const navigate = useNavigate();
//   const { loginWithGoogle, isGoogleAuthAvailable } = useAuth();
  
//   // Form state
//   const { 
//     register, 
//     handleSubmit, 
//     formState: { errors, isValid }, 
//     watch, 
//     setValue,
//     trigger,
//     reset
//   } = useForm<SignupFormValues>({
//     resolver: zodResolver(signupSchema),
//     mode: 'onBlur',
//     defaultValues: {
//       referralCode: '',
//     }
//   });

//   // UI state
//   const [loading, setLoading] = useState(false);
//   const [googleLoading, setGoogleLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [emailSent, setEmailSent] = useState(false);
//   const [countdown, setCountdown] = useState(30);
//   const [referralValid, setReferralValid] = useState<boolean | null>(null);
//   const [referralLoading, setReferralLoading] = useState(false);
//   const [verificationCheckCount, setVerificationCheckCount] = useState(0);
//   const [isVerifying, setIsVerifying] = useState(false);
//   const [referralChecked, setReferralChecked] = useState(false);

//   // Watch form values
//   const referralCode = watch('referralCode');
//   const email = watch('email');

//   // Auto-check verification status after email is sent
//   useEffect(() => {
//     if (!emailSent) return;

//     const checkVerification = async () => {
//       try {
//         setIsVerifying(true);
//         await auth.currentUser?.reload();
        
//         if (auth.currentUser?.emailVerified) {
//           toast.success('Email verified successfully!');
//           navigate('/');
//         } else if (verificationCheckCount < 12) {
//           setTimeout(() => {
//             setVerificationCheckCount(verificationCheckCount + 1);
//           }, 5000);
//         }
//       } catch (error) {
//         console.error("Verification check error:", error);
//       } finally {
//         setIsVerifying(false);
//       }
//     };

//     checkVerification();
//   }, [emailSent, verificationCheckCount, navigate]);

//   // Countdown timer for resend verification
//   useEffect(() => {
//     if (emailSent && countdown > 0) {
//       const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
//       return () => clearTimeout(timer);
//     }
//   }, [countdown, emailSent]);

//   // Check referral code validity
//   const checkReferralCode = async (code: string) => {
//     if (!code || code.trim() === '') {
//       setReferralValid(null);
//       setReferralChecked(true);
//       return true;
//     }

//     try {
//       setReferralLoading(true);
//       const usersRef = collection(db, "users");
//       const q = query(usersRef, where("referralCode", "==", code));
//       const querySnapshot = await getDocs(q);
      
//       const isValid = !querySnapshot.empty;
//       setReferralValid(isValid);
//       setReferralChecked(true);
      
//       if (isValid) {
//         toast.success('Valid referral code! You\'ll get 25 bonus coins.');
//       } else {
//         toast.error('Invalid referral code - please check and try again');
//       }
//       return isValid;
//     } catch (error) {
//       console.error("Error checking referral code:", error);
//       toast.error('Error checking referral code');
//       setReferralChecked(true);
//       return false;
//     } finally {
//       setReferralLoading(false);
//     }
//   };

//   const handleReferralChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const code = e.target.value;
//     setValue('referralCode', code);
//     await trigger('referralCode');
//     await checkReferralCode(code);
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
//     let referralValid = false;
    
//     if (data.referralCode && data.referralCode.trim() !== '') {
//       referralValid = await checkReferralCode(data.referralCode);
//       if (!referralValid) return;
//     }

//     try {
//       setLoading(true);
      
//       // Create user account
//       const userCredential = await createUserWithEmailAndPassword(
//         auth,
//         data.email,
//         data.password
//       );

//       // Generate a unique referral code for this new user (await the promise)
//       const userReferralCode = await generateReferralCode(data.username);

//       // Prepare user data
//       const userData = {
//         email: data.email,
//         username: data.username,
//         createdAt: serverTimestamp(),
//         emailVerified: false,
//         lastLogin: serverTimestamp(),
//         coins: 0,
//         referralCode: userReferralCode, // Now storing the resolved value, not the Promise
//         referredBy: null as string | null,
//         profileComplete: false
//       };

//       // Handle referral bonus if valid code was used
//       if (data.referralCode && referralValid) {
//         userData.coins = 25; // Bonus for new user
//         userData.referredBy = data.referralCode;
        
//         // Record the referral usage
//         const referralUsageRef = doc(db, "referrals", `${data.referralCode}_${userCredential.user.uid}`);
        
//         // Find the referrer
//         const referrerQuery = query(
//           collection(db, "users"), 
//           where("referralCode", "==", data.referralCode)
//         );
//         const referrerSnapshot = await getDocs(referrerQuery);
        
//         if (!referrerSnapshot.empty) {
//           const referrerDoc = referrerSnapshot.docs[0];
//           const referrerId = referrerDoc.id;
//           const referrerData = referrerDoc.data();
//           // Create batch for atomic operations
//           const batch = writeBatch(db);

//           // 1. Update referrer's coins and count
//           batch.update(doc(db, "users", referrerId), {
//             coins: increment(50),
//             referralCount: increment(1)
//           });

//           await addDoc(collection(db, 'transactions'), {
//             userId: referrerId,
//             type: 'reward',
//             amount: 50,
//             description: `Referral bonus for inviting ${userCredential.user.displayName || data.username}`,
//             timestamp: serverTimestamp(),
//             counterpartyName: userCredential.user.displayName || data.username, 
//           });

//           await addDoc(collection(db, 'transactions'), {
//             userId: userCredential.user.uid,
//             type: 'reward',
//             amount: 25,
//             description: 'Welcome bonus for joining via referral',
//             timestamp: serverTimestamp()
//           });
          
//           await addDoc(collection(db, 'referrals'), {
//             referrerId: referrerId,
//             referredId: userCredential.user.uid,
//             referredName: referrerData.username || data.username, 
//             referrerName: referrerDoc.data().displayName,
//             timestamp: serverTimestamp(),
//             status: 'completed',
//             rewardAmount: 50
//           });
          
//           // Execute all operations atomically
//           await batch.commit();
//         }
//       }

//       // Create user document
//       await setDoc(doc(db, "users", userCredential.user.uid), userData);
      
//       // Update profile
//       await updateProfile(userCredential.user, { 
//         displayName: data.username 
//       });

//       // Send verification email
//       await sendEmailVerification(userCredential.user, {
//         url: `${window.location.origin}/verify-email`,
//         handleCodeInApp: true
//       });
      
//       // Update UI state
//       setEmailSent(true);
//       setCountdown(30);
//       setVerificationCheckCount(0);
      
//       toast.success('Verification mail shared via email', {
//         description: 'Click on verification mail to verify your account',
//         action: {
//           label: 'Open Email',
//           onClick: () => window.open('https://mail.google.com', '_blank')
//         }
//       });
      
//     } catch (error: any) {
//       console.error('Signup error:', error);
      
//       let errorMessage = 'Failed to create account. Please try again.';
//       if (error.code === 'auth/email-already-in-use') {
//         errorMessage = 'This email is already registered. Please log in.';
//       } else if (error.code === 'auth/weak-password') {
//         errorMessage = 'Password must be at least 8 characters with uppercase, lowercase, and numbers.';
//       }
      
//       toast.error('Signup Error', {
//         description: errorMessage
//       });
//     } finally {
//       setLoading(false);
//     }
//   };


//   const isFormReady = isValid && (referralValid === null || referralValid === true) && referralChecked;

//   if (emailSent) {
//     return (
//       <div className="min-h-screen flex flex-col bg-background">
//         <Navbar />
//         <div className="flex min-h-screen flex-1 flex-col justify-center px-6 py-12 lg:px-8">
//           <motion.div 
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5 }}
//             className="sm:mx-auto sm:w-full sm:max-w-md p-8 rounded-xl bg-card border shadow-sm text-center"
//           >
//             <div className="relative mx-auto w-32 h-32 mb-6">
//               <motion.div 
//                 className="absolute inset-0 bg-primary/10 rounded-2xl border-2 border-primary/30"
//                 animate={{ 
//                   rotate: [0, 5, -5, 0],
//                   scale: [1, 1.05, 1]
//                 }}
//                 transition={{ 
//                   duration: 4,
//                   repeat: Infinity,
//                   ease: "easeInOut"
//                 }}
//               >
//                 <Mail className="w-full h-full p-6 text-primary" />
//               </motion.div>
              
//               <motion.div
//                 className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-2 rounded shadow-lg border"
//                 initial={{ y: -20, opacity: 0 }}
//                 animate={{ 
//                   y: [-20, -40, -20],
//                   opacity: [0, 1, 0]
//                 }}
//                 transition={{
//                   duration: 3,
//                   repeat: Infinity,
//                   times: [0, 0.5, 1]
//                 }}
//               >
//                 <CheckCircle className="h-6 w-6 text-green-500" />
//               </motion.div>
//             </div>

//             <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-2">
//               Almost There!
//             </h3>
//             <p className="text-muted-foreground mb-6">
//               We've sent a verification link to <span className="font-medium text-foreground">{email}</span>
//             </p>
            
//             <div className="space-y-4">
//               <div className="relative pt-4">
//                 <div className="h-2 bg-muted rounded-full overflow-hidden">
//                   <motion.div
//                     className="h-full bg-gradient-to-r from-primary to-purple-600"
//                     initial={{ width: 0 }}
//                     animate={{ width: "100%" }}
//                     transition={{ 
//                       duration: 30,
//                       ease: "linear"
//                     }}
//                   />
//                 </div>
//                 <div className="flex justify-between pt-2 text-sm">
//                   <span className="text-muted-foreground">Link expires in:</span>
//                   <span className="font-medium">
//                     {Math.floor(countdown/60)}m {countdown%60}s
//                   </span>
//                 </div>
//               </div>
              
//               <motion.div 
//                 className="pt-4 text-sm text-muted-foreground border-t"
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ delay: 0.5 }}
//               >
//                 <motion.div
//                   animate={{ 
//                     y: [0, -20, -40],
//                     opacity: [1, 0, 1]
//                   }}
//                   transition={{
//                     duration: 9,
//                     repeat: Infinity,
//                     repeatType: "reverse"
//                   }}
//                   className="space-y-1"
//                 >
//                   <p className="font-medium">✨ Pro Tip:</p>
//                   <p>
//                     {verificationCheckCount % 3 === 0 
//                       ? "Check your spam folder if you don't see our email" 
//                       : verificationCheckCount % 3 === 1
//                         ? "Verified users get 25 bonus coins to start their journey"
//                         : "Complete your profile after verification for extra rewards"}
//                   </p>
//                 </motion.div>
//               </motion.div>
              
//               <div className="pt-6 space-y-3">
//                 <motion.div
//                   whileHover={{ scale: 1.02 }}
//                   whileTap={{ scale: 0.98 }}
//                 >
//                   <Button
//                     variant="outline"
//                     className="w-full"
//                     onClick={() => window.open('https://mail.google.com', '_blank')}
//                   >
//                     Open Email App <ArrowRight className="ml-2 h-4 w-4" />
//                   </Button>
//                 </motion.div>
                
//                 <motion.div
//                   whileHover={{ scale: 1.02 }}
//                   whileTap={{ scale: 0.98 }}
//                 >
//                   <Button
//                     variant="ghost"
//                     disabled={countdown > 0}
//                     onClick={handleSubmit(onSubmit)}
//                     className="w-full"
//                   >
//                     {countdown > 0 ? (
//                       <>
//                         <Clock className="mr-2 h-4 w-4" />
//                         Resend in {countdown}s
//                       </>
//                     ) : (
//                       <>
//                         <RefreshCw className="mr-2 h-4 w-4" />
//                         Resend verification
//                       </>
//                     )}
//                   </Button>
//                 </motion.div>
//               </div>
//             </div>
//           </motion.div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen flex flex-col bg-background">
//       <Navbar />
//       <div className="flex min-h-screen flex-1 flex-col justify-center px-6 py-12 lg:px-8">
//         <div className="sm:mx-auto sm:w-full sm:max-w-md p-8 rounded-xl bg-card border shadow-sm">
//           <div className="mb-8 flex flex-col items-center">
//             <h2 className="mt-5 text-center text-2xl font-bold leading-9">
//               Create your account
//             </h2>
//             <p className="mt-2 text-center text-sm text-muted-foreground">
//               Already have an account?{' '}
//               <Link to="/login" className="font-semibold text-primary hover:text-primary/90">
//                 Sign in
//               </Link>
//             </p>
//           </div>

//           <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
//             <div className="space-y-2">
//               <Label htmlFor="username" className="flex items-center gap-1">
//                 <User className="h-4 w-4" />
//                 Username
//               </Label>
//               <Input
//                 id="username"
//                 type="text"
//                 autoComplete="username"
//                 {...register('username')}
//                 className={errors.username ? 'border-destructive' : ''}
//                 placeholder="Enter your username"
//               />
//               {errors.username && (
//                 <p className="text-sm text-destructive">{errors.username.message}</p>
//               )}
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="email" className="flex items-center gap-1">
//                 <Mail className="h-4 w-4" />
//                 Email address
//               </Label>
//               <Input
//                 id="email"
//                 type="email"
//                 autoComplete="email"
//                 {...register('email')}
//                 className={errors.email ? 'border-destructive' : ''}
//                 placeholder="your@email.com"
//               />
//               {errors.email && (
//                 <p className="text-sm text-destructive">{errors.email.message}</p>
//               )}
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="password" className="flex items-center gap-1">
//                 <Key className="h-4 w-4" />
//                 Password
//               </Label>
//               <div className="relative">
//                 <Input
//                   id="password"
//                   type={showPassword ? 'text' : 'password'}
//                   autoComplete="new-password"
//                   {...register('password')}
//                   className={errors.password ? 'border-destructive pr-10' : 'pr-10'}
//                   placeholder="Create a password"
//                 />
//                 <button
//                   type="button"
//                   className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
//                   onClick={() => setShowPassword(!showPassword)}
//                   aria-label={showPassword ? 'Hide password' : 'Show password'}
//                 >
//                   {showPassword ? (
//                     <EyeOffIcon className="h-4 w-4" />
//                   ) : (
//                     <EyeIcon className="h-4 w-4" />
//                   )}
//                 </button>
//               </div>
//               {errors.password && (
//                 <p className="text-sm text-destructive">{errors.password.message}</p>
//               )}
//               <p className="text-xs text-muted-foreground">
//               </p>
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="confirmPassword" className="flex items-center gap-1">
//                 <Key className="h-4 w-4" />
//                 Confirm Password
//               </Label>
//               <div className="relative">
//                 <Input
//                   id="confirmPassword"
//                   type={showPassword ? 'text' : 'password'}
//                   autoComplete="new-password"
//                   {...register('confirmPassword')}
//                   className={errors.confirmPassword ? 'border-destructive pr-10' : 'pr-10'}
//                   placeholder="Confirm your password"
//                 />
//               </div>
//               {errors.confirmPassword && (
//                 <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
//               )}
//             </div>

//             <div className="space-y-2">
//               <div className="flex items-center justify-between">
//                 <Label htmlFor="referralCode" className="flex items-center gap-1">
//                   <Gift className="h-4 w-4" />
//                   Referral Code (Optional)
//                 </Label>
//                 {referralValid !== null && (
//                   <span className={`text-xs ${referralValid ? 'text-green-600' : 'text-destructive'}`}>
//                     {referralValid ? 'Valid!' : 'Invalid'}
//                   </span>
//                 )}
//               </div>
//               <Input
//                 id="referralCode"
//                 type="text"
//                 placeholder="Enter referral code"
//                 {...register('referralCode')}
//                 onChange={handleReferralChange}
//               />
//               <div className="flex items-start gap-2">
//                 {referralLoading ? (
//                   <Loader2 className="h-3 w-3 mt-0.5 animate-spin text-muted-foreground" />
//                 ) : (
//                   <Gift className="h-3 w-3 mt-0.5 text-muted-foreground" />
//                 )}
//                 <p className="text-xs text-muted-foreground">
//                   {referralValid ? 
//                     'You\'ll get 25 bonus coins!' : 
//                     'Get 25 bonus coins with a valid code'}
//                 </p>
//               </div>
//             </div>

//             <Button
//               type="submit"
//               className="w-full mt-2"
//               disabled={!isFormReady || loading || referralLoading}
//             >
//               {loading ? (
//                 <>
//                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                   Creating account...
//                 </>
//               ) : (
//                 'Sign Up'
//               )}
//             </Button>

//             <div className="relative my-4">
//               <div className="absolute inset-0 flex items-center">
//                 <div className="w-full border-t border-border"></div>
//               </div>
//               <div className="relative flex justify-center text-sm">
//                 <span className="px-2 bg-card text-muted-foreground">Or continue with</span>
//               </div>
//             </div>

//             {isGoogleAuthAvailable && (
//               <Button
//                 type="button"
//                 variant="outline"
//                 className="w-full"
//                 onClick={handleGoogleSignup}
//                 disabled={googleLoading}
//               >
//                 {googleLoading ? (
//                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                 ) : (
//                   <svg className="mr-2 h-4 w-4" viewBox="0 0 48 48" aria-hidden="true">
//                     <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
//                     <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
//                     <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
//                     <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
//                   </svg>
//                 )}
//                 Sign up with Google
//               </Button>
//             )}

//             <p className="text-center text-sm text-muted-foreground mt-4">
//               By signing up, you agree to our{' '}
//               <Link to="/terms" className="font-medium text-primary hover:underline">
//                 Terms of Service
//               </Link>{' '}
//               and{' '}
//               <Link to="/privacy" className="font-medium text-primary hover:underline">
//                 Privacy Policy
//               </Link>
//             </p>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Signup;


import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2, Mail, Key, User, EyeIcon, EyeOffIcon, Gift, CheckCircle, ArrowRight, Clock, RefreshCw } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { doc, getDoc, setDoc, serverTimestamp, increment, collection, query, getDocs, where, updateDoc, addDoc, writeBatch, deleteDoc } from "firebase/firestore";
import Navbar from '@/components/layout/Navbar';
import { motion } from 'framer-motion';
import { db, auth } from '@/lib/firebase';
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { generateReferralCode } from '@/services/referralService';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

// Enhanced validation schema
const signupSchema = z.object({
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be less than 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores')
    .transform(val => val.trim()),
  email: z.string()
    .email('Please enter a valid email address')
    .transform(val => val.toLowerCase().trim()),
  password: z.string()
    .max(100, 'Password must be less than 100 characters'),
  confirmPassword: z.string(),
  referralCode: z.string().optional().transform(val => val?.trim()),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type SignupFormValues = z.infer<typeof signupSchema>;

const Signup = () => {
  const navigate = useNavigate();
  const { isGoogleAuthAvailable } = useAuth();
  
  // Form state
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isValid }, 
    watch, 
    setValue,
    trigger,
    reset
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    mode: 'onBlur',
    defaultValues: {
      referralCode: '',
    }
  });

  // UI state
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [referralValid, setReferralValid] = useState<boolean | null>(null);
  const [referralLoading, setReferralLoading] = useState(false);
  const [verificationCheckCount, setVerificationCheckCount] = useState(0);
  const [isVerifying, setIsVerifying] = useState(false);
  const [referralChecked, setReferralChecked] = useState(false);
  const [googleUser, setGoogleUser] = useState<any>(null);
  const [showGoogleSignupForm, setShowGoogleSignupForm] = useState(false);

  // Watch form values
  const referralCode = watch('referralCode');
  const email = watch('email');

  // Auto-check verification status after email is sent
  useEffect(() => {
    if (!emailSent) return;

    const checkVerification = async () => {
      try {
        setIsVerifying(true);
        await auth.currentUser?.reload();
        
        if (auth.currentUser?.emailVerified) {
          toast.success('Email verified successfully!');
          navigate('/');
        } else if (verificationCheckCount < 12) {
          setTimeout(() => {
            setVerificationCheckCount(verificationCheckCount + 1);
          }, 5000);
        }
      } catch (error) {
        console.error("Verification check error:", error);
      } finally {
        setIsVerifying(false);
      }
    };

    checkVerification();
  }, [emailSent, verificationCheckCount, navigate]);

  // Countdown timer for resend verification
  useEffect(() => {
    if (emailSent && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown, emailSent]);

  // Check referral code validity
  const checkReferralCode = async (code: string) => {
    if (!code || code.trim() === '') {
      setReferralValid(null);
      setReferralChecked(true);
      return true;
    }

    try {
      setReferralLoading(true);
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("referralCode", "==", code));
      const querySnapshot = await getDocs(q);
      
      const isValid = !querySnapshot.empty;
      setReferralValid(isValid);
      setReferralChecked(true);
      
      if (isValid) {
        toast.success('Valid referral code! You\'ll get 25 bonus coins.');
      } else {
        toast.error('Invalid referral code - please check and try again');
      }
      return isValid;
    } catch (error) {
      console.error("Error checking referral code:", error);
      toast.error('Error checking referral code');
      setReferralChecked(true);
      return false;
    } finally {
      setReferralLoading(false);
    }
  };

  const handleReferralChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const code = e.target.value;
    setValue('referralCode', code);
    await trigger('referralCode');
    await checkReferralCode(code);
  };

  const handleGoogleSignup = async () => {
    try {
      setGoogleLoading(true);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      // Check if this is a new user
      const userDoc = await getDoc(doc(db, "users", result.user.uid));
      
      if (!userDoc.exists()) {
        // New user - show additional info form
        setGoogleUser(result.user);
        setShowGoogleSignupForm(true);
      } else {
        // Existing user - proceed to dashboard
        navigate('/');
      }
    } catch (error: any) {
      console.error("Google signup error:", error);
      toast.error(error.message || 'Failed to sign up with Google');
    } finally {
      setGoogleLoading(false);
    }
  };

  const completeGoogleSignup = async (username: string, referralCode?: string) => {
    if (!googleUser) return;

    try {
      setLoading(true);
      let referralValid = false;
      
      if (referralCode && referralCode.trim() !== '') {
        referralValid = await checkReferralCode(referralCode);
        if (!referralValid) return;
      }

      // Generate a unique referral code for this new user
      const userReferralCode = await generateReferralCode(username);

      // Prepare user data
      const userData = {
        email: googleUser.email,
        username: username,
        createdAt: serverTimestamp(),
        emailVerified: true,
        lastLogin: serverTimestamp(),
        coins: 0,
        referralCode: userReferralCode,
        referredBy: null as string | null,
        profileComplete: false,
        photoURL: googleUser.photoURL
      };

      // Handle referral bonus if valid code was used
      if (referralCode && referralValid) {
        userData.coins = 25; // Bonus for new user
        userData.referredBy = referralCode;
        
        // Record the referral usage
        const referralUsageRef = doc(db, "referrals", `${referralCode}_${googleUser.uid}`);
        
        // Find the referrer
        const referrerQuery = query(
          collection(db, "users"), 
          where("referralCode", "==", referralCode)
        );
        const referrerSnapshot = await getDocs(referrerQuery);
        
        if (!referrerSnapshot.empty) {
          const referrerDoc = referrerSnapshot.docs[0];
          const referrerId = referrerDoc.id;
          
          // Create batch for atomic operations
          const batch = writeBatch(db);

          // 1. Update referrer's coins and count
          batch.update(doc(db, "users", referrerId), {
            coins: increment(50),
            referralCount: increment(1)
          });

          // 2. Create transactions
          await addDoc(collection(db, 'transactions'), {
            userId: referrerId,
            type: 'reward',
            amount: 50,
            description: `Referral bonus for inviting ${username}`,
            timestamp: serverTimestamp(),
            counterpartyName: username, 
          });

          await addDoc(collection(db, 'transactions'), {
            userId: googleUser.uid,
            type: 'reward',
            amount: 25,
            description: 'Welcome bonus for joining via referral',
            timestamp: serverTimestamp()
          });
          
          // 3. Record referral
          await addDoc(collection(db, 'referrals'), {
            referrerId: referrerId,
            referredId: googleUser.uid,
            referredName: username,
            referrerName: referrerDoc.data().displayName,
            timestamp: serverTimestamp(),
            status: 'completed',
            rewardAmount: 50
          });
          
          // Execute all operations atomically
          await batch.commit();
        }
      }

      // Create user document
      await setDoc(doc(db, "users", googleUser.uid), userData);
      
      // Update profile with username
      await updateProfile(googleUser, { 
        displayName: username 
      });

      // Close the dialog and navigate
      setShowGoogleSignupForm(false);
      navigate('/');
      
      toast.success('Account created successfully!', {
        description: 'Your Google account has been linked with your profile'
      });
      
    } catch (error: any) {
      console.error('Google signup completion error:', error);
      toast.error('Failed to complete signup', {
        description: error.message || 'Please try again'
      });
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: SignupFormValues) => {
    let referralValid = false;
    
    if (data.referralCode && data.referralCode.trim() !== '') {
      referralValid = await checkReferralCode(data.referralCode);
      if (!referralValid) return;
    }

    try {
      setLoading(true);
      
      // Create user account
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      // Generate a unique referral code for this new user
      const userReferralCode = await generateReferralCode(data.username);

      // Prepare user data
      const userData = {
        email: data.email,
        username: data.username,
        createdAt: serverTimestamp(),
        emailVerified: false,
        lastLogin: serverTimestamp(),
        coins: 0,
        referralCode: userReferralCode,
        referredBy: null as string | null,
        profileComplete: false
      };

      // Handle referral bonus if valid code was used
      if (data.referralCode && referralValid) {
        userData.coins = 25;
        userData.referredBy = data.referralCode;
        
        // Record the referral usage
        const referralUsageRef = doc(db, "referrals", `${data.referralCode}_${userCredential.user.uid}`);
        
        // Find the referrer
        const referrerQuery = query(
          collection(db, "users"), 
          where("referralCode", "==", data.referralCode)
        );
        const referrerSnapshot = await getDocs(referrerQuery);
        
        if (!referrerSnapshot.empty) {
          const referrerDoc = referrerSnapshot.docs[0];
          const referrerId = referrerDoc.id;
          
          // Create batch for atomic operations
          const batch = writeBatch(db);

          // 1. Update referrer's coins and count
          batch.update(doc(db, "users", referrerId), {
            coins: increment(50),
            referralCount: increment(1)
          });

          // 2. Create transactions
          await addDoc(collection(db, 'transactions'), {
            userId: referrerId,
            type: 'reward',
            amount: 50,
            description: `Referral bonus for inviting ${data.username}`,
            timestamp: serverTimestamp(),
            counterpartyName: data.username, 
          });

          await addDoc(collection(db, 'transactions'), {
            userId: userCredential.user.uid,
            type: 'reward',
            amount: 25,
            description: 'Welcome bonus for joining via referral',
            timestamp: serverTimestamp()
          });
          
          // 3. Record referral
          await addDoc(collection(db, 'referrals'), {
            referrerId: referrerId,
            referredId: userCredential.user.uid,
            referredName: data.username,
            referrerName: referrerDoc.data().displayName,
            timestamp: serverTimestamp(),
            status: 'completed',
            rewardAmount: 50
          });
          
          // Execute all operations atomically
          await batch.commit();
        }
      }

      // Create user document
      await setDoc(doc(db, "users", userCredential.user.uid), userData);
      
      // Update profile
      await updateProfile(userCredential.user, { 
        displayName: data.username 
      });

      // Send verification email
      await sendEmailVerification(userCredential.user, {
        url: `${window.location.origin}/verify-email`,
        handleCodeInApp: true
      });
      
      // Update UI state
      setEmailSent(true);
      setCountdown(30);
      setVerificationCheckCount(0);
      
      toast.success('Verification mail sent to your email', {
        description: 'Click on verification link to verify your account',
        action: {
          label: 'Open Email',
          onClick: () => window.open('https://mail.google.com', '_blank')
        }
      });
      
    } catch (error: any) {
      console.error('Signup error:', error);
      
      let errorMessage = 'Failed to create account. Please try again.';
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already registered. Please log in.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password must be at least 8 characters with uppercase, lowercase, and numbers.';
      }
      
      toast.error('Signup Error', {
        description: errorMessage
      });
    } finally {
      setLoading(false);
    }
  };

  const isFormReady = isValid && (referralValid === null || referralValid === true) && referralChecked;

  if (emailSent) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="flex min-h-screen flex-1 flex-col justify-center px-6 py-12 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="sm:mx-auto sm:w-full sm:max-w-md p-8 rounded-xl bg-card border shadow-sm text-center"
          >
            <div className="relative mx-auto w-32 h-32 mb-6">
              <motion.div 
                className="absolute inset-0 bg-primary/10 rounded-2xl border-2 border-primary/30"
                animate={{ 
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.05, 1]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Mail className="w-full h-full p-6 text-primary" />
              </motion.div>
              
              <motion.div
                className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-2 rounded shadow-lg border"
                initial={{ y: -20, opacity: 0 }}
                animate={{ 
                  y: [-20, -40, -20],
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  times: [0, 0.5, 1]
                }}
              >
                <CheckCircle className="h-6 w-6 text-green-500" />
              </motion.div>
            </div>

            <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-2">
              Almost There!
            </h3>
            <p className="text-muted-foreground mb-6">
              We've sent a verification link to <span className="font-medium text-foreground">{email}</span>
            </p>
            
            <div className="space-y-4">
              <div className="relative pt-4">
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-primary to-purple-600"
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ 
                      duration: 30,
                      ease: "linear"
                    }}
                  />
                </div>
                <div className="flex justify-between pt-2 text-sm">
                  <span className="text-muted-foreground">Link expires in:</span>
                  <span className="font-medium">
                    {Math.floor(countdown/60)}m {countdown%60}s
                  </span>
                </div>
              </div>
              
              <motion.div 
                className="pt-4 text-sm text-muted-foreground border-t"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <motion.div
                  animate={{ 
                    y: [0, -20, -40],
                    opacity: [1, 0, 1]
                  }}
                  transition={{
                    duration: 9,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                  className="space-y-1"
                >
                  <p className="font-medium">✨ Pro Tip:</p>
                  <p>
                    {verificationCheckCount % 3 === 0 
                      ? "Check your spam folder if you don't see our email" 
                      : verificationCheckCount % 3 === 1
                        ? "Verified users get 25 bonus coins to start their journey"
                        : "Complete your profile after verification for extra rewards"}
                  </p>
                </motion.div>
              </motion.div>
              
              <div className="pt-6 space-y-3">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => window.open('https://mail.google.com', '_blank')}
                  >
                    Open Email App <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant="ghost"
                    disabled={countdown > 0}
                    onClick={handleSubmit(onSubmit)}
                    className="w-full"
                  >
                    {countdown > 0 ? (
                      <>
                        <Clock className="mr-2 h-4 w-4" />
                        Resend in {countdown}s
                      </>
                    ) : (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Resend verification
                      </>
                    )}
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }
  const handleCancelGoogleSignup = async () => {
    if (!googleUser) return;
  
    try {
      setLoading(true);
      
      // Delete user from Firebase Auth
      await auth.currentUser?.delete();
      
      // Delete user document if it exists
      const userDocRef = doc(db, "users", googleUser.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        await deleteDoc(userDocRef);
      }
  
      toast.info('Signup cancelled', {
        description: 'Your account creation was cancelled'
      });
    } catch (error: any) {
      console.error('Error cancelling signup:', error);
      toast.error('Error cancelling signup', {
        description: error.message || 'Please try again'
      });
    } finally {
      setLoading(false);
      setGoogleUser(null);
      setShowGoogleSignupForm(false);
    }
  };
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <div className="flex min-h-screen flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md p-8 rounded-xl bg-card border shadow-sm">
          <div className="mb-8 flex flex-col items-center">
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

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
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
                placeholder="Enter your username"
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
                placeholder="your@email.com"
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
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
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
                  placeholder="Confirm your password"
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
              <Input
                id="referralCode"
                type="text"
                placeholder="Enter referral code"
                {...register('referralCode')}
                onChange={handleReferralChange}
              />
              <div className="flex items-start gap-2">
                {referralLoading ? (
                  <Loader2 className="h-3 w-3 mt-0.5 animate-spin text-muted-foreground" />
                ) : (
                  <Gift className="h-3 w-3 mt-0.5 text-muted-foreground" />
                )}
                <p className="text-xs text-muted-foreground">
                  {referralValid ? 
                    'You\'ll get 25 bonus coins!' : 
                    'Get 25 bonus coins with a valid code'}
                </p>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full mt-2"
              disabled={!isFormReady || loading || referralLoading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                'Sign Up'
              )}
            </Button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-card text-muted-foreground">Or continue with</span>
              </div>
            </div>

            {isGoogleAuthAvailable && (
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleGoogleSignup}
                disabled={googleLoading}
              >
                {googleLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 48 48" aria-hidden="true">
                    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
                    <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
                    <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
                    <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
                  </svg>
                )}
                Sign up with Google
              </Button>
            )}

            <p className="text-center text-sm text-muted-foreground mt-4">
              By signing up, you agree to our{' '}
              <Link to="/terms" className="font-medium text-primary hover:underline">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="font-medium text-primary hover:underline">
                Privacy Policy
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* Google Signup Additional Info Dialog */}
      <Dialog open={showGoogleSignupForm} onOpenChange={(open) => {
  if (!open) {
    // User clicked outside or pressed escape - delete the account
    handleCancelGoogleSignup();
  } else {
    setShowGoogleSignupForm(open);
  }
}}>
  <DialogContent className="sm:max-w-[425px]" onInteractOutside={(e) => e.preventDefault()}>
    <DialogHeader>
      <DialogTitle>Complete Your Profile</DialogTitle>
      <DialogDescription>
        Please provide a username to complete your account setup
      </DialogDescription>
    </DialogHeader>
    
    <GoogleSignupForm 
      user={googleUser} 
      onSubmit={completeGoogleSignup} 
      loading={loading}
      onReferralCheck={checkReferralCode}
      onCancel={handleCancelGoogleSignup}
    />
  </DialogContent>
</Dialog>
      </div>
  

);
};

// Separate component for Google signup form
const GoogleSignupForm = ({ 
  user, 
  onSubmit, 
  loading,
  onReferralCheck,
  onCancel
}: { 
  user: any, 
  onSubmit: (username: string, referralCode?: string) => void,
  loading: boolean,
  onReferralCheck: (code: string) => Promise<boolean>,
  onCancel: () => void
}) => {
  const [username, setUsername] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [referralValid, setReferralValid] = useState<boolean | null>(null);
  const [referralLoading, setReferralLoading] = useState(false);
  const [usernameError, setUsernameError] = useState('');

  const validateUsername = () => {
    if (username.length < 3) {
      setUsernameError('Username must be at least 3 characters');
      return false;
    }
    if (username.length > 20) {
      setUsernameError('Username must be less than 20 characters');
      return false;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setUsernameError('Username can only contain letters, numbers, and underscores');
      return false;
    }
    setUsernameError('');
    return true;
  };

  const handleReferralChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const code = e.target.value;
    setReferralCode(code);
    
    if (code.trim() === '') {
      setReferralValid(null);
      return;
    }

    try {
      setReferralLoading(true);
      const isValid = await onReferralCheck(code);
      setReferralValid(isValid);
    } finally {
      setReferralLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateUsername()) {
      onSubmit(username, referralCode.trim() || undefined);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="google-username">
          Choose a username
        </Label>
        <Input
          id="google-username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onBlur={validateUsername}
          placeholder="Enter your username"
        />
        {usernameError && (
          <p className="text-sm text-destructive">{usernameError}</p>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="google-referral">
            Referral Code (Optional)
          </Label>
          {referralValid !== null && (
            <span className={`text-xs ${referralValid ? 'text-green-600' : 'text-destructive'}`}>
              {referralValid ? 'Valid!' : 'Invalid'}
            </span>
          )}
        </div>
        <Input
          id="google-referral"
          value={referralCode}
          onChange={handleReferralChange}
          placeholder="Enter referral code"
        />
        <div className="flex items-start gap-2">
          {referralLoading ? (
            <Loader2 className="h-3 w-3 mt-0.5 animate-spin text-muted-foreground" />
          ) : (
            <Gift className="h-3 w-3 mt-0.5 text-muted-foreground" />
          )}
          <p className="text-xs text-muted-foreground">
            {referralValid ? 
              'You\'ll get 25 bonus coins!' : 
              'Get 25 bonus coins with a valid code'}
          </p>
        </div>
      </div>

      <DialogFooter>
        <Button 
          type="button"
          variant="outline" 
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={!username || loading || (referralCode && referralValid === false)}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Completing signup...
            </>
          ) : (
            'Complete Signup'
          )}
        </Button>
      </DialogFooter>
    </form>
  );
};


export default Signup;