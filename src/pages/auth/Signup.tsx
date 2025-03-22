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