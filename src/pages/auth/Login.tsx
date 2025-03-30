// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '@/contexts/AuthContext';
// import Navbar from '@/components/layout/Navbar';
// import Container from '@/components/ui/Container';
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// import { AlertCircle, AlertTriangle, Key, Mail } from 'lucide-react';
// import { Link } from "react-router-dom";
// import { getAuth, sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from "firebase/auth";
// import { toast } from 'sonner';

// const Login = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, ] = useState<string | null>(null);
//   const [googleAuthError, setGoogleAuthError] = useState<string | null>(null);
//   const [forgotPasswordError, setForgotPasswordError] = useState<string | null>(null);
//   const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState<string | null>(null);
//   const [showForgotPassword, setShowForgotPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
//   const [resendLoading, setResendLoading] = useState(false);
//   const [needsVerification, setNeedsVerification] = useState(false);
//   const [unverifiedEmail, setUnverifiedEmail] = useState('');
//   const navigate = useNavigate();
//   const { loginWithGoogle, isGoogleAuthAvailable } = useAuth();
//   const auth = getAuth();

  
//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const userCredential = await signInWithEmailAndPassword(auth, email, password);
//       const user = userCredential.user;

//       if (user && !user.emailVerified) {
//         setUnverifiedEmail(user.email || '');
//         setNeedsVerification(true);
//         await signOut(auth);
        
//         toast.warning('Email verification required', {
//           description: 'Please verify your email before logging in',
//           action: {
//             label: 'Resend Verification',
//             onClick: async () => {
//               try {
//                 await sendEmailVerification(user);
//                 toast.success('Verification email resent!');
//               } catch (error) {
//                 toast.error('Failed to resend verification email');
//               }
//             }
//           }
//         });
//         return;
//       }

//       toast.success('Logged in successfully!');
// navigate('/');      
//     } catch (error: any) {
//       console.error('Login error:', error);
      
//       let errorMessage = 'Failed to log in';
//       if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
//         errorMessage = 'Invalid email or password';
//       } else if (error.code === 'auth/too-many-requests') {
//         errorMessage = 'Too many attempts. Try again later.';
//       }
      
//       toast.error(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };
  
//   const resendVerificationEmail = async () => {
//     setResendLoading(true);
//     try {
//       let user = auth.currentUser;
      
//       if (!user) {
//         const credential = await signInWithEmailAndPassword(auth, unverifiedEmail, password);
//         user = credential.user;
//       }

//       if (user.emailVerified) {
//         toast.info('Email already verified. Redirecting...');
//         navigate('/');
//         return;
//       }

//       await sendEmailVerification(user, {
//         url: `${window.location.origin}/verify-email`,
//         handleCodeInApp: true
//       });
      
//       toast.success('Verification email sent! Check your inbox.');
      
//       if (!auth.currentUser) {
//         await auth.signOut();
//       }
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
//       await sendPasswordResetEmail(auth, email);
//       setForgotPasswordSuccess(`Password reset email sent to ${email}. Please check your inbox.`);
//     } catch (err: any) {
//       let errorMessage = 'Failed to send password reset email';
//       if (err.code === 'auth/user-not-found') {
//         errorMessage = 'No account found with this email address';
//       } else if (err.code === 'auth/invalid-email') {
//         errorMessage = 'Please enter a valid email address';
//       }
//       setForgotPasswordError(errorMessage);
//     } finally {
//       setForgotPasswordLoading(false);
//     }
//   };


  
//   if (needsVerification) {
//     return (
//       <div className="min-h-screen flex flex-col bg-background">
//         <Navbar />
//         <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
//           <Container>
//             <div className="max-w-md w-full bg-card p-8 rounded-lg shadow-sm border border-border text-center">
//               <div className="inline-flex items-center justify-center rounded-full bg-yellow-100 p-4 mb-6">
//                 <AlertTriangle className="h-12 w-12 text-yellow-600" />
//               </div>
//               <h2 className="text-2xl font-bold mb-4">Email Verification Required</h2>
//               <p className="text-muted-foreground mb-6">
//                 Please verify your email at <span className="font-medium text-foreground">{unverifiedEmail}</span> to continue.
//               </p>
              
//               <div className="space-y-3">
//                 <Button
//                   onClick={resendVerificationEmail}
//                   className="w-full"
//                   disabled={resendLoading}
//                 >
//                   {resendLoading ? 'Sending...' : 'Resend Verification Email'}
//                 </Button>
                
//                 <Button
//                   variant="outline"
//                   className="w-full"
//                   onClick={async () => {
//                     await auth.signOut();
//                     setNeedsVerification(false);
//                   }}
//                 >
//                   Try Different Account
//                 </Button>

//                 <div className="pt-4 text-sm text-muted-foreground">
//                   Check your spam folder if you don't see the email.
//                 </div>
//               </div>
//             </div>
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
                
//                 <form onSubmit={handleLogin} className="space-y-4">
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
//                       hidden={false}
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
//                       {loading ? 'Logging in...' : 'Login'}
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
//                         <svg className="mr-2 h-4 w-4" viewBox="0 0 48 48" aria-hidden="true">
//                           <path
//                             fill="#FFC107"
//                             d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
//                           />
//                           <path
//                             fill="#FF3D00"
//                             d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
//                           />
//                           <path
//                             fill="#4CAF50"
//                             d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
//                           />
//                           <path
//                             fill="#1976D2"
//                             d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
//                           />
//                         </svg>
//                         Login with Google
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
//                     {forgotPasswordLoading ? 'Sending...' : 'Send Reset Link'}
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



import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  getAuth, 
  sendEmailVerification, 
  sendPasswordResetEmail, 
  signInWithEmailAndPassword, 
  signOut 
} from "firebase/auth";
import { toast } from 'sonner';
import { Eye, EyeOff, Mail, Key, AlertCircle, AlertTriangle, Loader2 } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Container from '@/components/ui/Container';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState('');
  const navigate = useNavigate();
  const { loginWithGoogle, isGoogleAuthAvailable } = useAuth();
  const auth = getAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (user && !user.emailVerified) {
        setUnverifiedEmail(user.email || '');
        setNeedsVerification(true);
        await signOut(auth);
        
        toast.warning('Email Verification Required', {
          description: 'Please verify your email address to continue',
          action: {
            label: 'Resend Email',
            onClick: () => resendVerification(user)
          }
        });
        return;
      }

      toast.success('Login Successful', {
        description: 'You have been successfully logged in'
      });
      navigate('/');
    } catch (error: any) {
      console.error('Login error:', error);
      
      let errorMessage = 'Login failed. Please try again.';
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email address';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password. Please try again.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Account temporarily locked due to too many attempts. Please try again later.';
      }
      
      toast.error('Login Error', {
        description: errorMessage
      });
    } finally {
      setLoading(false);
    }
  };

  const resendVerification = async (user = auth.currentUser) => {
    if (!user) return;
    
    setResendLoading(true);
    try {
      await sendEmailVerification(user, {
        url: `${window.location.origin}/verify-email`,
        handleCodeInApp: true
      });
      toast.success('Verification Email Sent', {
        description: 'Please check your inbox and verify your email'
      });
    } catch (error) {
      toast.error('Failed to Resend Email', {
        description: error.message || 'Please try again later'
      });
    } finally {
      setResendLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
      toast.success('Google Login Successful');
      navigate('/mining');
    } catch (error: any) {
      toast.error('Google Login Failed', {
        description: error.message || 'Unable to login with Google'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      toast.warning('Email Required', {
        description: 'Please enter your email address'
      });
      return;
    }

    setForgotPasswordLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success('Password Reset Sent', {
        description: `Instructions have been sent to ${email}`
      });
      setShowForgotPassword(false);
    } catch (error: any) {
      let errorMessage = 'Failed to send reset email';
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Please enter a valid email address';
      }
      
      toast.error('Password Reset Error', {
        description: errorMessage
      });
    } finally {
      setForgotPasswordLoading(false);
    }
  };

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
              <h2 className="text-2xl font-bold mb-4">Verify Your Email</h2>
              <p className="text-muted-foreground mb-6">
                A verification link was sent to <span className="font-medium text-foreground">{unverifiedEmail}</span>
              </p>
              
              <div className="space-y-3">
                <Button
                  onClick={() => resendVerification()}
                  className="w-full"
                  disabled={resendLoading}
                >
                  {resendLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : 'Resend Verification Email'}
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={async () => {
                    await signOut(auth);
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

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Container>
          <div className="max-w-md w-full bg-card p-8 rounded-lg shadow-sm border border-border">
            {!showForgotPassword ? (
              <>
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold text-foreground">Welcome Back</h1>
                  <p className="text-muted-foreground mt-2">Sign in to your account</p>
                </div>
                
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
                      Email Address
                    </label>
                    <Input
                      type="email"
                      id="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full"
                      placeholder="your@email.com"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        autoComplete="current-password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pr-10"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                      />
                      <label htmlFor="remember-me" className="ml-2 block text-sm text-muted-foreground">
                        Remember me
                      </label>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => setShowForgotPassword(true)}
                      className="text-sm text-primary hover:text-primary/80 hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing in...
                      </>
                    ) : 'Sign In'}
                  </Button>
                </form>
                
                <div className="mt-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-border"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-card text-muted-foreground">Or continue with</span>
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
                        <svg className="mr-2 h-4 w-4" viewBox="0 0 48 48" aria-hidden="true">
                          <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
                          <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
                          <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
                          <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
                        </svg>
                        Google
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
                
                <div>
                  <label htmlFor="forgot-email" className="block text-sm font-medium text-foreground mb-1">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    id="forgot-email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full"
                    placeholder="your@email.com"
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
                    {forgotPasswordLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : 'Send Reset Link'}
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