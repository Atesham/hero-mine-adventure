// import React, { useState } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { useAuth } from '@/contexts/AuthContext';
// import Navbar from '@/components/layout/Navbar';
// import Container from '@/components/ui/Container';
// import { Input } from "@/components/ui/input"
// import { Button } from "@/components/ui/button"
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
// import { AlertCircle, AlertTriangle, Mail } from 'lucide-react';
// import { Link } from "react-router-dom";

// const Login = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState<string | null>(null);
//   const [googleAuthError, setGoogleAuthError] = useState<string | null>(null);
//   const [forgotPasswordError, setForgotPasswordError] = useState<string | null>(null);
//   const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState<string | null>(null);
//   const [showForgotPassword, setShowForgotPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
//   const navigate = useNavigate();
//   const { login, loginWithGoogle, isGoogleAuthAvailable, resetPassword } = useAuth();


//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError(null);
//     setLoading(true);

//     try {
//       await login(email, password);
//       navigate('/mining');
//     } catch (err: any) {
//       setError(err.message || 'Failed to log in');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleGoogleLogin = async () => {
//     setGoogleAuthError(null);
//     setLoading(true);

//     try {
//       await loginWithGoogle();
//       navigate('/mining');
//     } catch (err: any) {
//       setGoogleAuthError(err.message || 'Failed to log in with Google');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleForgotPassword = async () => {
//     if (!email) {
//       setForgotPasswordError('Please enter your email address');
//       return;
//     }

//     setForgotPasswordError(null);
//     setForgotPasswordSuccess(null);
//     setForgotPasswordLoading(true);

//     try {
//       await resetPassword(email);
//       setForgotPasswordSuccess(`Password reset email sent to ${email}. Please check your inbox.`);
//     } catch (err: any) {
//       setForgotPasswordError(err.message || 'Failed to send password reset email');
//     } finally {
//       setForgotPasswordLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col bg-background">
//       <Navbar />
      
//       <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
//         <Container>
//           <div className="max-w-md w-full bg-card p-8 rounded-lg shadow-sm border border-border">
//             {!showForgotPassword ? (
//               <>
//                 <div className="text-center mb-8">
//                   <h1 className="text-3xl font-bold text-foreground">Welcome back</h1>
//                 </div>
                
//                 {error && (
//                   <Alert variant="destructive" className="mb-6">
//                     <AlertCircle className="h-4 w-4" />
//                     <AlertTitle>Error</AlertTitle>
//                     <AlertDescription>{error}</AlertDescription>
//                   </Alert>
//                 )}
                
//                 {googleAuthError && (
//                   <Alert className="mb-6 border-yellow-500 bg-yellow-500/10">
//                     <AlertTriangle className="h-4 w-4 text-yellow-500" />
//                     <AlertTitle className="text-yellow-500">Google Login Unavailable</AlertTitle>
//                     <AlertDescription>{googleAuthError}</AlertDescription>
//                   </Alert>
//                 )}
                
//                 <form onSubmit={handleSubmit} className="space-y-4">
//                   <div>
//                     <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
//                       Email address
//                     </label>
//                     <Input
//                       type="email"
//                       id="email"
//                       autoComplete="email"
//                       required
//                       value={email}
//                       onChange={(e) => setEmail(e.target.value)}
//                       className="w-full"
//                       placeholder="Enter your email"
//                     />
//                   </div>
                  
//                   <div>
//                     <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1">
//                       Password
//                     </label>
//                     <Input
//                       type="password"
//                       id="password"
//                       autoComplete="current-password"
//                       required
//                       value={password}
//                       onChange={(e) => setPassword(e.target.value)}
//                       className="w-full"
//                       placeholder="Enter your password"
//                     />
//                   </div>
                  
//                   <div className="flex items-center justify-end">
//                     <button 
//                       type="button" 
//                       onClick={() => setShowForgotPassword(true)}
//                       className="text-sm text-primary hover:text-primary/80 hover:underline"
//                     >
//                       Forgot password?
//                     </button>
//                   </div>
                  
//                   <div>
//                     <Button type="submit" className="w-full" disabled={loading}>
//                       {loading ? (
//                         <>
//                           <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                             <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                           </svg>
//                           Logging in...
//                         </>
//                       ) : 'Login'}
//                     </Button>
//                   </div>
//                 </form>
                
//                 <div className="mt-6">
//                   <div className="relative">
//                     <div className="absolute inset-0 flex items-center">
//                       <div className="w-full border-t border-border"></div>
//                     </div>
//                     <div className="relative flex justify-center text-sm">
//                       <span className="px-2 bg-card text-muted-foreground">Or login with</span>
//                     </div>
//                   </div>
                  
//                   <div className="mt-6">
//                     {isGoogleAuthAvailable && (
//                       <Button
//                         variant="outline"
//                         onClick={handleGoogleLogin}
//                         disabled={loading}
//                         className="w-full"
//                       >
//                         <svg className="w-5 h-5 mr-2" viewBox="0 0 48 48" aria-hidden="true">
//                           <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
//                           <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
//                           <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
//                           <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
//                         </svg>
//                         Google
//                       </Button>
//                     )}
//                   </div>
//                 </div>
                
//                 <div className="mt-6 text-center text-sm text-muted-foreground">
//                   Don't have an account?{' '}
//                   <Link to="/signup" className="font-medium text-primary hover:text-primary/80 hover:underline">
//                     Sign up
//                   </Link>
//                 </div>
//               </>
//             ) : (
//               <div className="space-y-4">
//                 <div className="text-center mb-6">
//                   <h1 className="text-3xl font-bold text-foreground">Reset Password</h1>
//                   <p className="text-muted-foreground mt-2">Enter your email to receive a reset link</p>
//                 </div>
                
//                 {forgotPasswordError && (
//                   <Alert variant="destructive" className="mb-6">
//                     <AlertCircle className="h-4 w-4" />
//                     <AlertTitle>Error</AlertTitle>
//                     <AlertDescription>{forgotPasswordError}</AlertDescription>
//                   </Alert>
//                 )}
                
//                 {forgotPasswordSuccess && (
//                   <Alert className="mb-6">
//                     <Mail className="h-4 w-4" />
//                     <AlertTitle>Email Sent</AlertTitle>
//                     <AlertDescription>{forgotPasswordSuccess}</AlertDescription>
//                   </Alert>
//                 )}
                
//                 <div>
//                   <label htmlFor="forgot-email" className="block text-sm font-medium text-foreground mb-1">
//                     Email address
//                   </label>
//                   <Input
//                     type="email"
//                     id="forgot-email"
//                     autoComplete="email"
//                     required
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     className="w-full"
//                     placeholder="Enter your email"
//                   />
//                 </div>
                
//                 <div className="flex space-x-2">
//                   <Button
//                     type="button"
//                     variant="outline"
//                     className="w-full"
//                     onClick={() => setShowForgotPassword(false)}
//                   >
//                     Back to Login
//                   </Button>
//                   <Button
//                     type="button"
//                     className="w-full"
//                     onClick={handleForgotPassword}
//                     disabled={forgotPasswordLoading}
//                   >
//                     {forgotPasswordLoading ? (
//                       <>
//                         <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                           <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                           <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                         </svg>
//                         Sending...
//                       </>
//                     ) : 'Send Reset Link'}
//                   </Button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </Container>
//       </main>
//     </div>
//   );
// };

// export default Login;



// import React, { useState, useEffect } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { useAuth } from '@/contexts/AuthContext';
// import Navbar from '@/components/layout/Navbar';
// import Container from '@/components/ui/Container';
// import { Input } from "@/components/ui/input"
// import { Button } from "@/components/ui/button"
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
// import { AlertCircle, AlertTriangle, Mail, CheckCircle, ArrowRight } from 'lucide-react';
// import { Link } from "react-router-dom";
// import { getAuth, sendEmailVerification, onAuthStateChanged } from "firebase/auth";
// import { toast } from 'sonner';
// import { motion } from 'framer-motion';

// const Login = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState<string | null>(null);
//   const [googleAuthError, setGoogleAuthError] = useState<string | null>(null);
//   const [forgotPasswordError, setForgotPasswordError] = useState<string | null>(null);
//   const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState<string | null>(null);
//   const [showForgotPassword, setShowForgotPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
//   const [verificationStatus, setVerificationStatus] = useState<'unchecked' | 'pending' | 'verified'>('unchecked');
//   const [resendLoading, setResendLoading] = useState(false);
//   const navigate = useNavigate();
//   const { login, loginWithGoogle, isGoogleAuthAvailable, resetPassword, user } = useAuth();
//   const auth = getAuth();

//   useEffect(() => {
//     if (user && !user.emailVerified && verificationStatus === 'unchecked') {
//       setVerificationStatus('pending');
//     }
//   }, [user, verificationStatus]);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError(null);
//     setLoading(true);

//     try {
//       await login(email, password);
//       // The onAuthStateChanged listener will handle the verification check
//     } catch (err: any) {
//       if (err.code === 'auth/email-not-verified') {
//         setVerificationStatus('pending');
//       } else {
//         setError(err.message || 'Failed to log in');
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const resendVerificationEmail = async () => {
//     if (!user) return;
    
//     setResendLoading(true);
//     try {
//       await sendEmailVerification(user);
//       toast.success('Verification email sent! Please check your inbox.');
//     } catch (err: any) {
//       toast.error(err.message || 'Failed to send verification email');
//     } finally {
//       setResendLoading(false);
//     }
//   };

//   const handleGoogleLogin = async () => {
//     setGoogleAuthError(null);
//     setLoading(true);

//     try {
//       await loginWithGoogle();
//       // Google accounts are automatically verified so we don't need to check
//       navigate('/mining');
//     } catch (err: any) {
//       setGoogleAuthError(err.message || 'Failed to log in with Google');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleForgotPassword = async () => {
//     if (!email) {
//       setForgotPasswordError('Please enter your email address');
//       return;
//     }

//     setForgotPasswordError(null);
//     setForgotPasswordSuccess(null);
//     setForgotPasswordLoading(true);

//     try {
//       await resetPassword(email);
//       setForgotPasswordSuccess(`Password reset email sent to ${email}. Please check your inbox.`);
//     } catch (err: any) {
//       setForgotPasswordError(err.message || 'Failed to send password reset email');
//     } finally {
//       setForgotPasswordLoading(false);
//     }
//   };

//   // Listen for auth state changes to check verification status
//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       if (user) {
//         if (user.emailVerified) {
//           setVerificationStatus('verified');
//           navigate('/mining');
//         } else {
//           setVerificationStatus('pending');
//         }
//       } else {
//         setVerificationStatus('unchecked');
//       }
//     });

//     return () => unsubscribe();
//   }, [auth, navigate]);

//   if (verificationStatus === 'pending') {
//     return (
//       <div className="min-h-screen flex flex-col bg-background">
//         <Navbar />
//         <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
//           <Container>
//             <motion.div 
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="max-w-md w-full bg-card p-8 rounded-lg shadow-sm border border-border text-center"
//             >
//               <div className="inline-flex items-center justify-center rounded-full bg-yellow-100 p-4 mb-6">
//                 <AlertTriangle className="h-12 w-12 text-yellow-600" />
//               </div>
//               <h2 className="text-2xl font-bold mb-4">Email Verification Required</h2>
//               <p className="text-muted-foreground mb-6">
//                 We've sent a verification link to <span className="font-medium text-foreground">{user?.email}</span>.
//                 Please verify your email to continue.
//               </p>
              
//               <div className="space-y-3">
//                 <Button
//                   onClick={resendVerificationEmail}
//                   className="w-full"
//                   disabled={resendLoading}
//                 >
//                   {resendLoading ? (
//                     <>
//                       <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                       </svg>
//                       Sending...
//                     </>
//                   ) : 'Resend Verification Email'}
//                 </Button>
                
//                 {/* <Button
//                   variant="outline"
//                   className="w-full"
//                   onClick={() => {
//                     auth.signOut();
//                     setVerificationStatus('unchecked');
//                   }}
//                 >
//                   Sign In With Different Account
//                 </Button> */}
                
//                 <Button
//   variant="outline"
//   className="w-full"
//   onClick={() => {
//     auth.signOut();
//     setVerificationStatus('unchecked');
//     navigate('/signup'); // Add this line to navigate to signup page
//   }}
// >
//   Sign Up With Different Account
// </Button>

//                 <div className="pt-4 text-sm text-muted-foreground">
//                   Didn't receive the email? Check your spam folder or try again.
//                 </div>
//               </div>
//             </motion.div>
//           </Container>
//         </main>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen flex flex-col bg-background">
//       <Navbar />
      
//       <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
//         <Container>
//           <div className="max-w-md w-full bg-card p-8 rounded-lg shadow-sm border border-border">
//             {!showForgotPassword ? (
//               <>
//                 <div className="text-center mb-8">
//                   <h1 className="text-3xl font-bold text-foreground">Welcome back</h1>
//                 </div>
                
//                 {error && (
//                   <Alert variant="destructive" className="mb-6">
//                     <AlertCircle className="h-4 w-4" />
//                     <AlertTitle>Error</AlertTitle>
//                     <AlertDescription>{error}</AlertDescription>
//                   </Alert>
//                 )}
                
//                 {googleAuthError && (
//                   <Alert className="mb-6 border-yellow-500 bg-yellow-500/10">
//                     <AlertTriangle className="h-4 w-4 text-yellow-500" />
//                     <AlertTitle className="text-yellow-500">Google Login Unavailable</AlertTitle>
//                     <AlertDescription>{googleAuthError}</AlertDescription>
//                   </Alert>
//                 )}
                
//                 <form onSubmit={handleSubmit} className="space-y-4">
//                   <div>
//                     <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
//                       Email address
//                     </label>
//                     <Input
//                       type="email"
//                       id="email"
//                       autoComplete="email"
//                       required
//                       value={email}
//                       onChange={(e) => setEmail(e.target.value)}
//                       className="w-full"
//                       placeholder="Enter your email"
//                     />
//                   </div>
                  
//                   <div>
//                     <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1">
//                       Password
//                     </label>
//                     <Input
//                       type="password"
//                       id="password"
//                       autoComplete="current-password"
//                       required
//                       value={password}
//                       onChange={(e) => setPassword(e.target.value)}
//                       className="w-full"
//                       placeholder="Enter your password"
//                     />
//                   </div>
                  
//                   <div className="flex items-center justify-end">
//                     <button 
//                       type="button" 
//                       onClick={() => setShowForgotPassword(true)}
//                       className="text-sm text-primary hover:text-primary/80 hover:underline"
//                     >
//                       Forgot password?
//                     </button>
//                   </div>
                  
//                   <div>
//                     <Button type="submit" className="w-full" disabled={loading}>
//                       {loading ? (
//                         <>
//                           <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                             <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                           </svg>
//                           Logging in...
//                         </>
//                       ) : 'Login'}
//                     </Button>
//                   </div>
//                 </form>
                
//                 <div className="mt-6">
//                   <div className="relative">
//                     <div className="absolute inset-0 flex items-center">
//                       <div className="w-full border-t border-border"></div>
//                     </div>
//                     <div className="relative flex justify-center text-sm">
//                       <span className="px-2 bg-card text-muted-foreground">Or login with</span>
//                     </div>
//                   </div>
                  
//                   <div className="mt-6">
//                     {isGoogleAuthAvailable && (
//                       <Button
//                         variant="outline"
//                         onClick={handleGoogleLogin}
//                         disabled={loading}
//                         className="w-full"
//                       >
//                         <svg className="w-5 h-5 mr-2" viewBox="0 0 48 48" aria-hidden="true">
//                           <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
//                           <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
//                           <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
//                           <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
//                         </svg>
//                         Google
//                       </Button>
//                     )}
//                   </div>
//                 </div>
                
//                 <div className="mt-6 text-center text-sm text-muted-foreground">
//                   Don't have an account?{' '}
//                   <Link to="/signup" className="font-medium text-primary hover:text-primary/80 hover:underline">
//                     Sign up
//                   </Link>
//                 </div>
//               </>
//             ) : (
//               <div className="space-y-4">
//                 <div className="text-center mb-6">
//                   <h1 className="text-3xl font-bold text-foreground">Reset Password</h1>
//                   <p className="text-muted-foreground mt-2">Enter your email to receive a reset link</p>
//                 </div>
                
//                 {forgotPasswordError && (
//                   <Alert variant="destructive" className="mb-6">
//                     <AlertCircle className="h-4 w-4" />
//                     <AlertTitle>Error</AlertTitle>
//                     <AlertDescription>{forgotPasswordError}</AlertDescription>
//                   </Alert>
//                 )}
                
//                 {forgotPasswordSuccess && (
//                   <Alert className="mb-6">
//                     <Mail className="h-4 w-4" />
//                     <AlertTitle>Email Sent</AlertTitle>
//                     <AlertDescription>{forgotPasswordSuccess}</AlertDescription>
//                   </Alert>
//                 )}
                
//                 <div>
//                   <label htmlFor="forgot-email" className="block text-sm font-medium text-foreground mb-1">
//                     Email address
//                   </label>
//                   <Input
//                     type="email"
//                     id="forgot-email"
//                     autoComplete="email"
//                     required
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     className="w-full"
//                     placeholder="Enter your email"
//                   />
//                 </div>
                
//                 <div className="flex space-x-2">
//                   <Button
//                     type="button"
//                     variant="outline"
//                     className="w-full"
//                     onClick={() => setShowForgotPassword(false)}
//                   >
//                     Back to Login
//                   </Button>
//                   <Button
//                     type="button"
//                     className="w-full"
//                     onClick={handleForgotPassword}
//                     disabled={forgotPasswordLoading}
//                   >
//                     {forgotPasswordLoading ? (
//                       <>
//                         <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                           <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                           <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                         </svg>
//                         Sending...
//                       </>
//                     ) : 'Send Reset Link'}
//                   </Button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </Container>
//       </main>
//     </div>
//   );
// };

// export default Login;




import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/layout/Navbar';
import Container from '@/components/ui/Container';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, AlertTriangle, Mail } from 'lucide-react';
import { Link } from "react-router-dom";
import { getAuth, sendEmailVerification } from "firebase/auth";
import { toast } from 'sonner';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [googleAuthError, setGoogleAuthError] = useState<string | null>(null);
  const [forgotPasswordError, setForgotPasswordError] = useState<string | null>(null);
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState<string | null>(null);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);
  const navigate = useNavigate();
  const { login, loginWithGoogle, isGoogleAuthAvailable, resetPassword, user } = useAuth();
  const auth = getAuth();

  // Redirect if user becomes verified
  useEffect(() => {
    if (user?.emailVerified) {
      navigate('/mining');
    } else if (user) {
      setNeedsVerification(true);
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setNeedsVerification(false);

    try {
      await login(email, password);
      
      // After successful login, check verification status
      if (auth.currentUser) {
        if (!auth.currentUser.emailVerified) {
          setNeedsVerification(true);
          toast.error('Please verify your email to continue');
          await auth.signOut();
          return;
        }
        // If verified, proceed to mining page
        navigate('/mining');
      }
    } catch (err: any) {
      if (err.code === 'auth/email-not-verified') {
        setNeedsVerification(true);
      } else {
        setError(err.message || 'Failed to log in');
      }
    } finally {
      setLoading(false);
    }
  };

  const resendVerificationEmail = async () => {
    if (!auth.currentUser) return;
    
    setResendLoading(true);
    try {
      await sendEmailVerification(auth.currentUser, {
        url: `${window.location.origin}/verify-email`,
        handleCodeInApp: true
      });
      toast.success('Verification email sent! Check your inbox.');
    } catch (err: any) {
      toast.error(err.message || 'Failed to send verification email');
    } finally {
      setResendLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleAuthError(null);
    setLoading(true);

    try {
      await loginWithGoogle();
      // Google accounts are automatically verified
      navigate('/mining');
    } catch (err: any) {
      setGoogleAuthError(err.message || 'Failed to log in with Google');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setForgotPasswordError('Please enter your email address');
      return;
    }

    setForgotPasswordError(null);
    setForgotPasswordSuccess(null);
    setForgotPasswordLoading(true);

    try {
      await resetPassword(email);
      setForgotPasswordSuccess(`Password reset email sent to ${email}. Please check your inbox.`);
    } catch (err: any) {
      setForgotPasswordError(err.message || 'Failed to send password reset email');
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  // Show verification prompt if needed
  if (needsVerification) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <Container>
            <div className="max-w-md w-full bg-card p-8 rounded-lg shadow-sm border border-border text-center">
              <div className="inline-flex items-center justify-center rounded-full bg-yellow-100 p-4 mb-6">
                <AlertTriangle className="h-12 w-12 text-yellow-600" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Email Verification Required</h2>
              <p className="text-muted-foreground mb-6">
                Please verify your email at <span className="font-medium text-foreground">{email}</span> to continue.
              </p>
              
              <div className="space-y-3">
                <Button
                  onClick={resendVerificationEmail}
                  className="w-full"
                  disabled={resendLoading}
                >
                  {resendLoading ? 'Sending...' : 'Resend Verification Email'}
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={async () => {
                    await auth.signOut();
                    setNeedsVerification(false);
                  }}
                >
                  Try Different Account
                </Button>

                <div className="pt-4 text-sm text-muted-foreground">
                  Check your spam folder if you don't see the email.
                </div>
              </div>
            </div>
          </Container>
        </main>
      </div>
    );
  }

  // Main login form
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Container>
          <div className="max-w-md w-full bg-card p-8 rounded-lg shadow-sm border border-border">
            {!showForgotPassword ? (
              <>
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold text-foreground">Welcome back</h1>
                </div>
                
                {error && (
                  <Alert variant="destructive" className="mb-6">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                
                {googleAuthError && (
                  <Alert className="mb-6 border-yellow-500 bg-yellow-500/10">
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    <AlertTitle className="text-yellow-500">Google Login Unavailable</AlertTitle>
                    <AlertDescription>{googleAuthError}</AlertDescription>
                  </Alert>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
                      Email address
                    </label>
                    <Input
                      type="email"
                      id="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full"
                      placeholder="Enter your email"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1">
                      Password
                    </label>
                    <Input
                      type="password"
                      id="password"
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full"
                      placeholder="Enter your password"
                    />
                  </div>
                  
                  <div className="flex items-center justify-end">
                    <button 
                      type="button" 
                      onClick={() => setShowForgotPassword(true)}
                      className="text-sm text-primary hover:text-primary/80 hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                  
                  <div>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? 'Logging in...' : 'Login'}
                    </Button>
                  </div>
                </form>
                
                <div className="mt-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-border"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-card text-muted-foreground">Or login with</span>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    {isGoogleAuthAvailable && (
                      <Button
                        variant="outline"
                        onClick={handleGoogleLogin}
                        disabled={loading}
                        className="w-full"
                      >
                        Sign in with Google
                      </Button>
                    )}
                  </div>
                </div>
                
                <div className="mt-6 text-center text-sm text-muted-foreground">
                  Don't have an account?{' '}
                  <Link to="/signup" className="font-medium text-primary hover:text-primary/80 hover:underline">
                    Sign up
                  </Link>
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <h1 className="text-3xl font-bold text-foreground">Reset Password</h1>
                  <p className="text-muted-foreground mt-2">Enter your email to receive a reset link</p>
                </div>
                
                {forgotPasswordError && (
                  <Alert variant="destructive" className="mb-6">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{forgotPasswordError}</AlertDescription>
                  </Alert>
                )}
                
                {forgotPasswordSuccess && (
                  <Alert className="mb-6">
                    <Mail className="h-4 w-4" />
                    <AlertTitle>Email Sent</AlertTitle>
                    <AlertDescription>{forgotPasswordSuccess}</AlertDescription>
                  </Alert>
                )}
                
                <div>
                  <label htmlFor="forgot-email" className="block text-sm font-medium text-foreground mb-1">
                    Email address
                  </label>
                  <Input
                    type="email"
                    id="forgot-email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full"
                    placeholder="Enter your email"
                  />
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => setShowForgotPassword(false)}
                  >
                    Back to Login
                  </Button>
                  <Button
                    type="button"
                    className="w-full"
                    onClick={handleForgotPassword}
                    disabled={forgotPasswordLoading}
                  >
                    {forgotPasswordLoading ? 'Sending...' : 'Send Reset Link'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Container>
      </main>
    </div>
  );
};

export default Login;