// src/pages/VerifyEmail.tsx
import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getAuth, applyActionCode, signInWithEmailAndPassword } from 'firebase/auth';
import { toast } from 'sonner';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Container from '@/components/ui/Container';
import { Button } from '@/components/ui/button';

const VerifyEmail = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const oobCode = params.get('oobCode');
        const mode = params.get('mode');
        
        if (mode !== 'verifyEmail' || !oobCode) {
          throw new Error('Invalid verification link');
        }

        // Apply the verification code
        await applyActionCode(auth, oobCode);
        
        // If user is not logged in, redirect to login
        if (!auth.currentUser) {
          toast.success('Email verified! Please log in.');
          navigate('/login');
          return;
        }

        // Refresh the user's token
        await auth.currentUser.getIdToken(true);
        toast.success('Email verified successfully!');
        navigate('/mining');
      } catch (error) {
        console.error('Verification error:', error);
        toast.error('Failed to verify email. The link may have expired.');
        navigate('/login');
      }
    };

    verifyEmail();
  }, [params, auth, navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Container>
          <div className="max-w-md w-full bg-card p-8 rounded-lg shadow-sm border border-border text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Verifying Email</h2>
            <p>Please wait while we verify your email...</p>
          </div>
        </Container>
      </main>
    </div>
  );
};

export default VerifyEmail;