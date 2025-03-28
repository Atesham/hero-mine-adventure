// src/pages/VerifyEmail.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getAuth, applyActionCode } from 'firebase/auth';
import { toast } from 'sonner';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Container from '@/components/ui/Container';
import { Button } from '@/components/ui/button';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const auth = getAuth();
        const oobCode = searchParams.get('oobCode');
        
        if (!oobCode) {
          throw new Error('Invalid verification link');
        }

        await applyActionCode(auth, oobCode);
        
        // Update email verification status
        const user = auth.currentUser;
        if (user) {
          await user.getIdToken(true); // Refresh token
        }
        
        setStatus('success');
        toast.success('Email verified successfully!');
        setTimeout(() => navigate('/mining'), 2000);
      } catch (err: any) {
        setStatus('error');
        setError(err.message || 'Failed to verify email');
        toast.error('Email verification failed');
      }
    };

    verifyEmail();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md w-full bg-card p-8 rounded-lg shadow-sm border border-border text-center"
          >
            {status === 'loading' && (
              <>
                <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">Verifying Email</h2>
                <p>Please wait while we verify your email address...</p>
              </>
            )}
            
            {status === 'success' && (
              <>
                <div className="inline-flex items-center justify-center rounded-full bg-green-100 p-4 mb-6">
                  <CheckCircle className="h-12 w-12 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold mb-4">Email Verified!</h2>
                <p>You will be redirected shortly...</p>
              </>
            )}
            
            {status === 'error' && (
              <>
                <div className="inline-flex items-center justify-center rounded-full bg-red-100 p-4 mb-6">
                  <XCircle className="h-12 w-12 text-red-600" />
                </div>
                <h2 className="text-2xl font-bold mb-4">Verification Failed</h2>
                <p className="text-destructive mb-4">{error}</p>
                <Button onClick={() => navigate('/signup')}>
                    
                  Return to Sign Up
                </Button>
              </>
            )}
          </motion.div>
        </Container>
      </main>
    </div>
  );
};

export default VerifyEmail;