import React, { useState } from 'react';
import { 
  createUserWithEmailAndPassword,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Container from '@/components/ui/Container';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, AlertTriangle } from 'lucide-react';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [googleAuthError, setGoogleAuthError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const signupWithEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!displayName) {
      setError('Display name is required.');
      setLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update profile with display name
      if (userCredential.user) {
        await updateProfile(userCredential.user, { displayName });
        
        // Create user document in Firestore
        const userRef = doc(db, 'users', userCredential.user.uid);
        await setDoc(userRef, {
          uid: userCredential.user.uid,
          displayName,
          email,
          coins: 0,
          totalMined: 0,
          createdAt: serverTimestamp(),
        });
        
        toast.success('Account created successfully!');
        navigate('/mining');
      }
    } catch (err: any) {
      console.error('Signup error:', err);
      if (err.code === 'auth/email-already-in-use') {
        setError('This email is already in use. Please try a different one.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password is too weak. Please use at least 6 characters.');
      } else {
        setError(err.message || 'Failed to create account');
      }
    } finally {
      setLoading(false);
    }
  };

  const signupWithGoogle = async () => {
    setGoogleAuthError(null);
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      if (result.user) {
        // Create user document in Firestore if it doesn't exist
        const userRef = doc(db, 'users', result.user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          await setDoc(userRef, {
            uid: result.user.uid,
            displayName: result.user.displayName || result.user.email?.split('@')[0],
            email: result.user.email,
            coins: 0,
            totalMined: 0,
            createdAt: serverTimestamp(),
          });
        }
        
        toast.success('Signed up successfully with Google!');
        navigate('/mining');
      }
    } catch (err: any) {
      console.error('Google signup error:', err);
      if (err.code === 'auth/unauthorized-domain') {
        setGoogleAuthError('Google signup is not available in this environment. Please use email/password signup instead.');
      } else {
        setGoogleAuthError(err.message || 'Failed to sign up with Google');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-32 pb-16">
        <Container>
          <div className="max-w-md mx-auto glass-card rounded-xl p-8">
            <h1 className="text-2xl font-bold mb-6 text-center">Create an Account</h1>
            
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {googleAuthError && (
              <Alert className="mb-4 border-yellow-500 bg-yellow-500/10">
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                <AlertTitle className="text-yellow-500">Google Signup Unavailable</AlertTitle>
                <AlertDescription>{googleAuthError}</AlertDescription>
              </Alert>
            )}
            
            <form onSubmit={signupWithEmail} className="space-y-4">
              <div>
                <Label htmlFor="displayName">Display Name</Label>
                <Input
                  type="text"
                  id="displayName"
                  placeholder="Enter your display name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  type="email"
                  id="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  type="password"
                  id="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>
            
            <div className="text-center mt-4">
              <Button type="button" variant="outline" className="w-full" onClick={signupWithGoogle} disabled={loading}>
                {loading ? 'Signing up with Google...' : 'Signup with Google'}
              </Button>
            </div>
            
            <p className="text-sm text-muted-foreground mt-4 text-center">
              Already have an account? <a href="/login" className="text-primary">Login</a>
            </p>
          </div>
        </Container>
      </main>
      
      <Footer />
    </div>
  );
};

export default Signup;
