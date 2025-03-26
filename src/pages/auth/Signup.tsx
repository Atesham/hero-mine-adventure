// import React, { useEffect, useRef, useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
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
//   const navigate = useNavigate();
//   const { signup, loginWithGoogle, isGoogleAuthAvailable } = useAuth();

//   const [loading, setLoading] = useState(false);
//   const [otpSent, setOTPSent] = useState(false);
//   const [googleLoading, setGoogleLoading] = useState(false);
//   const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
//   const [showPassword, setShowPassword] = useState(false);
//   const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

//   const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<SignupFormValues>({
//     resolver: zodResolver(signupSchema),
//     mode: 'onBlur',
//     defaultValues: {
//       referralCode: '',
//     }
//   });
//   const [otp, setOtp] = useState('');

// // Combine OTP digits into single string
// useEffect(() => {
//   setOtp(otpDigits.join(''));
// }, [otpDigits]);

//   const handleOtpDigitChange = (index: number, value: string) => {
//     if (/^\d*$/.test(value) && value.length <= 1) {
//       const newOtpDigits = [...otpDigits];
//       newOtpDigits[index] = value;
//       setOtpDigits(newOtpDigits);

//       // Auto-focus to next input if a digit was entered
//       if (value && index < 5) {
//         otpInputRefs.current[index + 1]?.focus();
//       }
//     }
//   };

//   const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
//       // Move focus to previous input on backspace
//       otpInputRefs.current[index - 1]?.focus();
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
//     if (!otpSent) {
//       await handleSendOTP(data.email);
//     } else {
//       const otpNumber = Number(otp); // Use the separate otp state
//       if (isNaN(otpNumber)) {
//         toast.error('Invalid OTP. Please enter a valid number.');
//         return;
//       }
//       await handleVerifyOTP(data.email, otpNumber);
//     }
//   };
//   // In your handleSendOTP function
// const handleSendOTP = async (email: string) => {
//   try {
//     setLoading(true);
//     // const response = await axios.post("http://localhost:3000/api/send-otp", { email });
//    const response = await axios.post("https://hero-mine-adventure.vercel.app/api/send-otp", { email });
    
//       if (response.data.success) {
//       setOTPSent(true);
//       toast.success("OTP sent to your email!");
//     } else {
//       toast.error(response.data.message || "Failed to send OTP. Please try again.");
//     }
//   } catch (error: any) {
//     if (error.response) {
//       if (error.response.status === 400) {
//         toast.warning("Email is already registered. Please log in.");
//       } else {
//       }
//     } else {
//       console.error("Error sending OTP:", error);
//       setError("An error occurred while sending OTP. Please try again.");
//     }
//   } finally {
//     setLoading(false);
//   }
// };

// const handleResendOTP = async (email: string) => {
//   try {
//     setLoading(true);
//     setOtpDigits(['', '', '', '', '', '']); // Clear existing OTP digits
//     // const response = await axios.post("http://localhost:3000/api/send-otp", { email });
//     const response = await axios.post("https://hero-mine-adventure.vercel.app/api/send-otp", { email });

//     if (response.data.success) {
//       toast.success("New OTP sent to your email!");
//       otpInputRefs.current[0]?.focus(); // Focus on first OTP input
//     } else {
//       toast.error(response.data.message || "Failed to resend OTP. Please try again.");
//     }
//   } catch (error: any) {
//     if (error.response) {
//       toast.error(error.response.data.message || "An error occurred while resending OTP.");
//     } else {
//       toast.error("An error occurred while resending OTP. Please try again.");
//     }
//   } finally {
//     setLoading(false);
//   }
// };

//   const handleVerifyOTP = async (email: string, otp: number) => {
//     try {
//       setLoading(true);
//       // const response = await axios.post('http://localhost:3000/api/verify-otp', { email, otp });
//       const response = await axios.post("https://hero-mine-adventure.vercel.app/api/send-otp", { email,otp });

//       if (response.data.success) {
//         toast.success('OTP verified!');
//         const formData = watch();
//         await signup(formData.email, formData.password, formData.username, formData.referralCode);
//         navigate('/');
//       } else {
//         toast.error(response.data.message);
//       }
//     } catch (error) {
//       toast.error('Failed to verify OTP. Please try again.');
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
//               <>
//                 <Button
//                   type="submit"
//                   className="w-full"
//                   disabled={loading}
//                 >
//                   {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
//                   Send OTP
//                 </Button>

//                 <div className="relative">
//                   <div className="absolute inset-0 flex items-center">
//                     <div className="w-full border-t border-border"></div>
//                   </div>
//                   <div className="relative flex justify-center text-sm">
//                     <span className="px-2 bg-card text-muted-foreground">Or sign up with</span>
//                   </div>
//                 </div>

//                 <Button
//                   type="button"
//                   variant="outline"
//                   className="w-full"
//                   onClick={handleGoogleSignup}
//                   disabled={googleLoading}
//                 >
//                   {googleLoading ? (
//                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                   ) : (
//                     <svg className="mr-2 h-4 w-4" viewBox="0 0 48 48" aria-hidden="true">
//                       <path
//                         fill="#FFC107"
//                         d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
//                       />
//                       <path
//                         fill="#FF3D00"
//                         d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
//                       />
//                       <path
//                         fill="#4CAF50"
//                         d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
//                       />
//                       <path
//                         fill="#1976D2"
//                         d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
//                       />
//                     </svg>
//                   )}
//                   Sign up with Google
//                 </Button>
//               </>
//             ) : (
//               <>
//                 <div className="space-y-2">
//                   <Label htmlFor="otp" className="flex items-center gap-1">
//                     Enter OTP
//                   </Label>
//                   <div className="flex gap-2 justify-center">
//                     {[0, 1, 2, 3, 4, 5].map((index) => (
//                       <Input
//                         key={index}
//                         ref={(el) => (otpInputRefs.current[index] = el)}
//                         type="text"
//                         inputMode="numeric"
//                         maxLength={1}
//                         value={otpDigits[index]}
//                         onChange={(e) => handleOtpDigitChange(index, e.target.value)}
//                         onKeyDown={(e) => handleOtpKeyDown(index, e)}
//                         className="w-12 h-12 text-center text-lg font-mono"
//                         autoFocus={index === 0}
//                       />
//                     ))}
//                   </div>
//                 </div>
//                 <div className="flex gap-2">
//                 <Button
//       type="button"
//       variant="outline"
//       className="w-1/2"
//       onClick={async () => {
//         const email = watch('email');
//         await handleResendOTP(email);
//       }}
//       disabled={loading}
//     >
//       Resend OTP
//     </Button>  
// </div>
// <Button
//       type="submit"
//       className="w-1/2"
//       disabled={loading || otpDigits.some(d => !d)}
//     >
//       {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
//       Verify OTP
//     </Button>
//               </>
//             )}
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Signup;

// function setError(arg0: string) {
//   throw new Error('Function not implemented.');
// }




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
  const navigate = useNavigate();
  const { signup, loginWithGoogle, isGoogleAuthAvailable } = useAuth();

  const [loading, setLoading] = useState(false);
  const [otpSent, setOTPSent] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const [otp, setOTP] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    mode: 'onBlur',
    defaultValues: {
      referralCode: '',
    }
  });
  const handleGoogleSignup = async () => {
    try {
      setGoogleLoading(true);
      await loginWithGoogle();
      navigate('/');
    } catch (error: any) {
      // Error is already handled in the AuthContext
    } finally {
      setGoogleLoading(false);
    }
  };
  
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
  const handleSendOTP = async (email: string) => {
    try {
      setLoading(true);
      const response = await axios.post("http://localhost:3000/api/send-otp", { email });
      if (response.data.success) {
        setOTPSent(true);
        toast.success("OTP sent to your email!");
      } else {
        toast.error(response.data.message || "Failed to send OTP. Please try again.");
      }
    } catch (error) {
      if (error.response) {
        // Handle 400 Bad Request response
        if (error.response.status === 400) {
          toast.error(
            <div>
              {error.response.data.message}{" "}
              <a href="/login" className="font-semibold text-primary hover:text-primary/90">
                Log in here.
              </a>
            </div>
          );
        } else {
          toast.error("An error occurred while sending OTP. Please try again.");
        }
      } else {
        console.error("Error sending OTP:", error);
        toast.error("An error occurred while sending OTP. Please try again.");
      }
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