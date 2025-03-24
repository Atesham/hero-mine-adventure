
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LogOut, Mail, User, Shield } from 'lucide-react';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
        <Navbar />
        <main className="flex-1 py-10 mt-16">
          <div className="container px-4 mx-auto">
            <div className="text-center py-20">
              <h3 className="text-2xl font-semibold">Please log in to view your profile</h3>
              <Button onClick={() => navigate('/login')} className="mt-4">
                Go to Login
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const authMethod = user.providerData[0]?.providerId === 'password' 
    ? 'Email and Password' 
    : user.providerData[0]?.providerId === 'google.com'
      ? 'Google Account'
      : 'Unknown';

  const userInitials = (user.displayName || user.email?.split('@')[0] || 'User')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      <Navbar />
      <main className="flex-1 py-10 mt-16">
        <div className="container px-4 mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Your Profile</h1>
            <p className="text-muted-foreground">
              Manage your account information
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <Card>
                <CardHeader className="flex flex-col items-center space-y-4 pb-6">
                  <Avatar className="h-24 w-24">
                    {user.photoURL ? (
                      <AvatarImage src={user.photoURL} alt={user.displayName || ''} />
                    ) : (
                      <AvatarFallback className="text-xl">{userInitials}</AvatarFallback>
                    )}
                  </Avatar>
                  <div className="text-center">
                    <h2 className="text-xl font-semibold">{user.displayName || user.email?.split('@')[0]}</h2>
                    <p className="text-sm text-muted-foreground">Member since {user.metadata.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : 'Unknown'}</p>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button 
                    variant="destructive" 
                    className="w-full" 
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </CardContent>
              </Card>
            </div>
            
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                  <CardDescription>Your personal account details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-1">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <User className="h-4 w-4 mr-2" />
                      Display Name
                    </div>
                    <p className="text-lg font-medium">{user.displayName || 'Not set'}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Mail className="h-4 w-4 mr-2" />
                      Email Address
                    </div>
                    <p className="text-lg font-medium">{user.email}</p>
                    <div className="inline-flex items-center px-2.5 py-0.5 mt-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {user.emailVerified ? 'Verified' : 'Not Verified'}
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Shield className="h-4 w-4 mr-2" />
                      Authentication Method
                    </div>
                    <p className="text-lg font-medium">{authMethod}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;