
// import React, { useState, useEffect } from 'react';
// import { useNavigate, Link, useSearchParams } from 'react-router-dom';
// import { useAuth } from '@/contexts/AuthContext';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { toast } from 'sonner';
// import { Loader2, Mail, Key, User, EyeIcon, EyeOffIcon, Gift } from 'lucide-react';
// import { useForm } from 'react-hook-form';
// import { z } from 'zod';
// import { zodResolver } from '@hookform/resolvers/zod';
// import Navbar from '@/components/layout/Navbar';

// const signupSchema = z.object({
//   username: z.string().min(3, 'Username must be at least 3 characters'),
//   email: z.string().email('Please enter a valid email address'),
//   password: z.string().min(6, 'Password must be at least 6 characters'),
//   confirmPassword: z.string(),
//   referralCode: z.string().optional(),
// }).refine(data => data.password === data.confirmPassword, {
//   message: "Passwords do not match",
//   path: ["confirmPassword"],
// });

// type SignupFormValues = z.infer<typeof signupSchema>;

// const Signup = () => {
//   const { signup, loginWithGoogle, isGoogleAuthAvailable } = useAuth();
//   const navigate = useNavigate();
//   const [searchParams] = useSearchParams();
//   const [loading, setLoading] = useState(false);
//   const [googleLoading, setGoogleLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
  
//   const { register, handleSubmit, formState: { errors }, setValue } = useForm<SignupFormValues>({
//     resolver: zodResolver(signupSchema),
//     mode: 'onBlur',
//     defaultValues: {
//       referralCode: '',
//     }
//   });
  
//   // Check for referral code in URL
//   useEffect(() => {
//     const refCode = searchParams.get('ref');
//     if (refCode) {
//       setValue('referralCode', refCode);
//       toast.info('Referral code applied!', {
//         description: 'You\'ll receive 10 coins when you sign up',
//       });
//     }
//   }, [searchParams, setValue]);
  
//   const onSubmit = async (data: SignupFormValues) => {
//     try {
//       setLoading(true);
//       await signup(data.email, data.password, data.username, data.referralCode);
//       navigate('/');
//     } catch (error: any) {
//       toast.error('Sign up failed', {
//         description: error.message
//       });
//     } finally {
//       setLoading(false);
//     }
//   };
  
//   const handleGoogleSignup = async () => {
//     try {
//       setGoogleLoading(true);
//       await loginWithGoogle();
//       navigate('/');
//     } catch (error: any) {
//       // Error is already handled in the AuthContext
//     } finally {
//       setGoogleLoading(false);
//     }
//   };
  
//   return (
//     <div className="min-h-screen flex flex-col">
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
//                 Sign in
//               </Link>
//             </p>
//           </div>

//           <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
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
//                 />
//                 <button
//                   type="button"
//                   className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
//                   onClick={() => setShowPassword(!showPassword)}
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
//                 />
//               </div>
//               {errors.confirmPassword && (
//                 <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
//               )}
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="referralCode" className="flex items-center gap-1">
//                 <Gift className="h-4 w-4" />
//                 Referral Code (Optional)
//               </Label>
//               <Input
//                 id="referralCode"
//                 type="text"
//                 placeholder="Enter referral code"
//                 {...register('referralCode')}
//               />
//               <p className="text-xs text-muted-foreground">
//                 Get 10 Hero Coins when you sign up with a referral code!
//               </p>
//             </div>

//             <Button
//               type="submit"
//               className="w-full flex gap-2 items-center"
//               disabled={loading}
//             >
//               {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
//               Create Account
//             </Button>
//           </form>

//           {isGoogleAuthAvailable && (
//             <>
//               <div className="relative my-6">
//                 <div className="absolute inset-0 flex items-center">
//                   <div className="w-full border-t border-muted"></div>
//                 </div>
//                 <div className="relative flex justify-center text-xs">
//                   <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
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
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };


// import React, { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { useAuth } from '@/contexts/AuthContext';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { toast } from 'sonner';
// import { Loader2, Mail, Key, User, EyeIcon, EyeOffIcon, Gift } from 'lucide-react';
// import { useForm } from 'react-hook-form';
// import { number, z } from 'zod';
// import { zodResolver } from '@hookform/resolvers/zod';
// import Navbar from '@/components/layout/Navbar';
// import axios from 'axios';

// // Zod schema for form validation
// const signupSchema = z.object({
//   username: z.string().min(3, 'Username must be at least 3 characters'),
//   email: z.string().email('Please enter a valid email address'),
//   password: z.string().min(6, 'Password must be at least 6 characters'),
//   confirmPassword: z.string(),
//   referralCode: z.string().optional(),
// }).refine(data => data.password === data.confirmPassword, {
//   message: "Passwords do not match",
//   path: ["confirmPassword"],
// });

// type SignupFormValues = z.infer<typeof signupSchema>;

// const Signup = () => {
//   const { signup } = useAuth();
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [otpSent, setOTPSent] = useState(false);
//   const [otp, setOTP] = useState('');
//   const [showPassword, setShowPassword] = useState(false);

//   const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<SignupFormValues>({
//     resolver: zodResolver(signupSchema),
//     mode: 'onBlur',
//     defaultValues: {
//       referralCode: '',
//     }
//   });

//   // Handle form submission
// const onSubmit = async (data: SignupFormValues) => {
//   if (!otpSent) {
//     // If OTP is not sent, send the OTP
//     await handleSendOTP(data.email);
//   } else {
//     // Convert OTP input to a number before verifying
//     const otpNumber = Number(otp);
//     if (isNaN(otpNumber)) {
//       toast.error('Invalid OTP. Please enter a valid number.');
//       return;
//     }
//     await handleVerifyOTP(data.email, otpNumber);
//   }
// };

// // Send OTP
// const handleSendOTP = async (email: string) => {
//   try {
//     setLoading(true);
//     const response = await axios.post('http://localhost:3000/api/send-otp', { email });
//     if (response.data.success) {
//       setOTPSent(true);
//       toast.success('OTP sent to your email!');
//     } else {
//       // Show error message and prompt to log in
//       toast.error(
//         <div>
//           {response.data.message}{' '}
//           <Link to="/login" className="font-semibold text-primary hover:text-primary/90">
//             Log in here.
//           </Link>
//         </div>
//       );
//     }
//   } catch (error) {
//     toast.error('Failed to send OTP. Please try again.');
//   } finally {
//     setLoading(false);
//   }
// };
// // Verify OTP and Sign Up
// const handleVerifyOTP = async (email: string, otp: number) => {
//   try {
//     setLoading(true);
//     const response = await axios.post('http://localhost:3000/api/verify-otp', { email, otp });
//     if (response.data.success) {
//       toast.success('OTP verified!');
//       // Proceed with signup
//       const formData = watch(); // Get all form values
//       await signup(formData.email, formData.password, formData.username, formData.referralCode);
//       navigate('/'); // Redirect to homepage after successful verification
//     } else {
//       toast.error(response.data.message);
//     }
//   } catch (error) {
//     toast.error('Failed to verify OTP. Please try again.');
//   } finally {
//     setLoading(false);
//   }
// };
//   return (
//     <div className="min-h-screen flex flex-col">
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
//                 Sign in
//               </Link>
//             </p>
//           </div>

//           <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
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
//                 />
//                 <button
//                   type="button"
//                   className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
//                   onClick={() => setShowPassword(!showPassword)}
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
//                 />
//               </div>
//               {errors.confirmPassword && (
//                 <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
//               )}
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="referralCode" className="flex items-center gap-1">
//                 <Gift className="h-4 w-4" />
//                 Referral Code (Optional)
//               </Label>
//               <Input
//                 id="referralCode"
//                 type="text"
//                 placeholder="Enter referral code"
//                 {...register('referralCode')}
//               />
//               <p className="text-xs text-muted-foreground">
//                 Get 10 Hero Coins when you sign up with a referral code!
//               </p>
//             </div>

//             {!otpSent ? (
//               <Button
//                 type="submit"
//                 className="w-full"
//                 disabled={loading}
//               >
//                 {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
//                 Send OTP
//               </Button>
//             ) : (
//               <>
//                 <div className="space-y-2">
//                   <Label htmlFor="otp" className="flex items-center gap-1">
//                     <Key className="h-4 w-4" />
//                     Enter OTP
//                   </Label>
//                   <Input
//                     id="otp"
//                     type="text"
//                     value={otp}
//                     onChange={(e) => setOTP(e.target.value)}
//                   />
//                 </div>

//                 <Button
//                   type="submit"
//                   className="w-full"
//                   disabled={loading}
//                 >
//                   {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
//                   Verify OTP
//                 </Button>
//               </>
//             )}
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Signup;




import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2, Mail, Key, User, EyeIcon, EyeOffIcon, Gift } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Navbar from '@/components/layout/Navbar';
import axios from 'axios';
import { getAuth, fetchSignInMethodsForEmail } from "firebase/auth";


// Zod schema for form validation
const signupSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  referralCode: z.string().optional(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type SignupFormValues = z.infer<typeof signupSchema>;

const Signup = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [otpSent, setOTPSent] = useState(false);
  const [otp, setOTP] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    mode: 'onBlur',
    defaultValues: {
      referralCode: '',
    }
  });

  // Handle form submission
  const onSubmit = async (data: SignupFormValues) => {
    if (!otpSent) {
      // If OTP is not sent, send the OTP
      await handleSendOTP(data.email);
    } else {
      // Convert OTP input to a number before verifying
      const otpNumber = Number(otp);
      if (isNaN(otpNumber)) {
        toast.error('Invalid OTP. Please enter a valid number.');
        return;
      }
      await handleVerifyOTP(data.email, otpNumber);
    }
  };

  // Send OTP


// Send OTP only if the email is not registered
const handleSendOTP = async (email: string) => {
  try {
    setLoading(true);
    const auth = getAuth();

    // Step 1: Check if email is already registered
    const signInMethods = await fetchSignInMethodsForEmail(auth, email);

    if (signInMethods.length > 0) {
      // Email is already registered, ask user to log in instead of sending OTP
      toast.error(
        <div>
          This email is already registered.{" "}
          <Link to="/login" className="font-semibold text-primary hover:text-primary/90">
            Log in here.
          </Link>
        </div>
      );
      setLoading(false);
      return; // Exit function, do not send OTP
    }

    // Step 2: Email is NOT registered, proceed to send OTP
    const response = await axios.post("http://localhost:3000/api/send-otp", { email });

    if (response.data.success) {
      setOTPSent(true);
      toast.success("OTP sent to your email!");
    } else {
      toast.error(response.data.message || "Failed to send OTP. Please try again.");
    }
  } catch (error) {
    console.error("Error checking email:", error);
    toast.error("An error occurred while checking email. Please try again.");
  } finally {
    setLoading(false);
  }
};

  // Verify OTP and Sign Up
  const handleVerifyOTP = async (email: string, otp: number) => {
    try {
      setLoading(true);
      const response = await axios.post('http://localhost:3000/api/verify-otp', { email, otp });
      if (response.data.success) {
        toast.success('OTP verified!');
        // Proceed with signup
        const formData = watch(); // Get all form values
        await signup(formData.email, formData.password, formData.username, formData.referralCode);
        navigate('/'); // Redirect to homepage after successful verification
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error('Failed to verify OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex min-h-screen flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="glass-card sm:mx-auto sm:w-full sm:max-w-md p-8 rounded-xl">
          <div className="mb-10 flex flex-col items-center">
            <Link to="/" className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
              Hero Coin
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
              <Label htmlFor="referralCode" className="flex items-center gap-1">
                <Gift className="h-4 w-4" />
                Referral Code (Optional)
              </Label>
              <Input
                id="referralCode"
                type="text"
                placeholder="Enter referral code"
                {...register('referralCode')}
              />
              <p className="text-xs text-muted-foreground">
                Get 10 Hero Coins when you sign up with a referral code!
              </p>
            </div>

            {!otpSent ? (
              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Send OTP
              </Button>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="otp" className="flex items-center gap-1">
                    <Key className="h-4 w-4" />
                    Enter OTP
                  </Label>
                  <Input
                    id="otp"
                    type="text"
                    value={otp}
                    onChange={(e) => setOTP(e.target.value)}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading}
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Verify OTP
                </Button>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;