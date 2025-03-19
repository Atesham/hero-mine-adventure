
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Container from '@/components/ui/Container';
import { Wallet as WalletIcon, History, ArrowDownUp } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const Wallet = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-32 pb-16">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center rounded-full px-3 py-1 text-sm bg-primary/10 text-primary mb-4">
              <span className="animate-pulse-soft mr-1">●</span> Your Hero Coins
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Wallet Dashboard
            </h1>
            <p className="text-lg text-muted-foreground">
              Manage your Hero Coins and view your transaction history
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="glass-card rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <WalletIcon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Total Balance</h3>
              <p className="text-3xl font-bold">250 HC</p>
            </div>
            
            <div className="glass-card rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <History className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Mining Rewards</h3>
              <p className="text-3xl font-bold">175 HC</p>
            </div>
            
            <div className="glass-card rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <ArrowDownUp className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Transactions</h3>
              <p className="text-3xl font-bold">12</p>
            </div>
          </div>
          
          <div className="glass-card rounded-xl p-6 mb-8">
            <h3 className="text-xl font-bold mb-4">Recent Transactions</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-secondary/50 rounded-lg">
                <div>
                  <p className="font-medium">Mining Reward</p>
                  <p className="text-sm text-muted-foreground">Yesterday at 8:30 PM</p>
                </div>
                <p className="text-green-500 font-bold">+15 HC</p>
              </div>
              
              <div className="flex justify-between items-center p-4 bg-secondary/50 rounded-lg">
                <div>
                  <p className="font-medium">Mining Reward</p>
                  <p className="text-sm text-muted-foreground">2 days ago at 10:15 AM</p>
                </div>
                <p className="text-green-500 font-bold">+8 HC</p>
              </div>
              
              <div className="flex justify-between items-center p-4 bg-secondary/50 rounded-lg">
                <div>
                  <p className="font-medium">Sent to User123</p>
                  <p className="text-sm text-muted-foreground">3 days ago at 3:45 PM</p>
                </div>
                <p className="text-red-500 font-bold">-20 HC</p>
              </div>
            </div>
          </div>
        </Container>
      </main>
      
      <Footer />
    </div>
  );
};

export default Wallet;
