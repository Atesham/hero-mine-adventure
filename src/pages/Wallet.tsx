
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Container from '@/components/ui/Container';
import { Wallet as WalletIcon, History, ArrowDownUp, QrCode, Info, Loader2, RefreshCw } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import QRCodeComponent from '@/components/shared/QRCode';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { getUserWalletData, Transaction } from '@/services/transactionService';
import SendCoinsDialog from '@/components/wallet/SendCoinsDialog';

const Wallet = () => {
  const { user } = useAuth();
  const [balance, setBalance] = useState<number>(0);
  const [miningRewards, setMiningRewards] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [walletAddress, setWalletAddress] = useState<string>('');

  const fetchWalletData = async () => {
    if (!user) return;

    try {
      setError(null);
      setLoading(true);
      
      const walletData = await getUserWalletData(user.uid);
      
      setBalance(walletData.balance);
      setMiningRewards(walletData.totalMined);
      setTransactions(walletData.transactions);
      setWalletAddress(walletData.walletAddress);
    } catch (error: any) {
      console.error('Error fetching wallet data:', error);
      setError('Could not load your wallet data. Please try again later.');
      toast.error('Error loading wallet', {
        description: 'Could not load your wallet data. Please try again later.'
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchWalletData();
  }, [user]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchWalletData();
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      if (diffInHours === 0) {
        return 'Just now';
      } else if (diffInHours === 1) {
        return '1 hour ago';
      } else {
        return `${diffInHours} hours ago`;
      }
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    }
  };

  const copyAddressToClipboard = () => {
    navigator.clipboard.writeText(walletAddress);
    toast.success('Address Copied', {
      description: 'Your wallet address has been copied to clipboard',
    });
  };

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
          
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="ml-2 text-lg">Loading your wallet...</p>
            </div>
          ) : error ? (
            <Alert variant="destructive" className="max-w-2xl mx-auto mb-8">
              <AlertTitle>Error loading wallet</AlertTitle>
              <AlertDescription>
                {error}
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  onClick={handleRefresh}
                >
                  Try Again
                </Button>
              </AlertDescription>
            </Alert>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <div className="glass-card rounded-xl p-6 text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <WalletIcon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Total Balance</h3>
                  <p className="text-3xl font-bold">{balance} Hero Coins</p>
                </div>
                
                <div className="glass-card rounded-xl p-6 text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <History className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Mining Rewards</h3>
                  <p className="text-3xl font-bold">{miningRewards} Hero Coins</p>
                </div>
                
                <div className="glass-card rounded-xl p-6 text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ArrowDownUp className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Transactions</h3>
                  <p className="text-3xl font-bold">{transactions.length}</p>
                </div>
              </div>
              
              <div className="glass-card rounded-xl p-6 mb-8">
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                  <h3 className="text-xl font-bold">Your Wallet</h3>
                  <div className="flex space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="flex items-center">
                          <QrCode className="w-4 h-4 mr-2" />
                          QR Code
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Your Hero Coins Wallet</DialogTitle>
                          <DialogDescription>
                            Other users can scan this QR code to send you Hero Coins
                          </DialogDescription>
                        </DialogHeader>
                        <div className="flex flex-col items-center justify-center p-4">
                          <QRCodeComponent value={walletAddress} size={250} />
                          <p className="text-sm text-muted-foreground mt-4">Scan this QR to send Hero Coins to this wallet</p>
                          <div className="mt-4 bg-secondary/50 p-3 rounded-lg w-full text-center">
                            <p className="text-sm font-mono break-all">{walletAddress}</p>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    
                    <Button variant="outline" size="sm" onClick={copyAddressToClipboard}>
                      <QrCode className="w-4 h-4 mr-2" />
                      Copy Address
                    </Button>
                    
                    <SendCoinsDialog 
                      userId={user.uid} 
                      balance={balance}
                      onSuccess={fetchWalletData}
                    />
                  </div>
                </div>
                
                <div className="bg-secondary/30 p-3 rounded-lg flex items-center mb-6">
                  <Info className="w-5 h-5 text-primary mr-2 flex-shrink-0" />
                  <p className="text-sm">Your unique wallet address is <span className="font-mono font-medium">{walletAddress}</span></p>
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold">Recent Transactions</h4>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleRefresh}
                    disabled={refreshing}
                  >
                    {refreshing ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Refreshing...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Refresh
                      </>
                    )}
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {transactions.length > 0 ? (
                    transactions.map((transaction) => (
                      <div key={transaction.id} className="flex justify-between items-center p-4 bg-secondary/50 rounded-lg">
                        <div>
                          <p className="font-medium">{transaction.description}</p>
                          {transaction.counterpartyName && (
                            <p className="text-xs text-muted-foreground">
                              {transaction.type === 'sent' ? 'To: ' : 'From: '} 
                              {transaction.counterpartyName}
                            </p>
                          )}
                          <p className="text-sm text-muted-foreground">{formatDate(transaction.timestamp)}</p>
                        </div>
                        <p className={`font-bold ${transaction.type === 'reward' || transaction.type === 'received' ? 'text-green-500' : 'text-red-500'}`}>
                          {transaction.type === 'sent' ? '-' : '+'}{transaction.amount} Hero Coins
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No transactions yet</p>
                      <p className="text-sm">Start mining to earn your first Hero Coins!</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </Container>
      </main>
      
      <Footer />
    </div>
  );
};

export default Wallet;
