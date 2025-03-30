
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Coins, Send, QrCode, ArrowDownLeft, ArrowUpRight, Clock } from 'lucide-react';
import QRCodeComponent from '../shared/QRCode';

interface TransactionItem {
  id: string;
  type: 'incoming' | 'outgoing' | 'mining';
  amount: number;
  timestamp: number;
  sender?: string;
  recipient?: string;
}

const WalletCard = () => {
  const [balance, setBalance] = useState(0);
  const [walletAddress, setWalletAddress] = useState('');
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    // Generate a random wallet address
    const generateWalletAddress = () => {
      const timestampPart = Date.now().toString(36).slice(-6); // 6 chars
  
  const randomPart = window.crypto.getRandomValues(new Uint8Array(10))
    .reduce((acc, byte) => acc + (byte % 36).toString(36), ''); // 10 chars
  
  return (timestampPart + randomPart)
    .replace(/[^a-z0-9]/g, '') // Sanitize
    .slice(0, 16) // Exactly 16 chars
    .padEnd(16, '0'); // Pad if needed (shouldn't occur)

    };
    
    // Get stored wallet data or create new one
    const storedWalletAddress = localStorage.getItem('walletAddress');
    const storedBalance = localStorage.getItem('walletBalance');
    const storedTransactions = localStorage.getItem('walletTransactions');
    
    if (storedWalletAddress) {
      setWalletAddress(storedWalletAddress);
    } else {
      const newAddress = generateWalletAddress();
      setWalletAddress(newAddress);
      localStorage.setItem('walletAddress', newAddress);
    }
    
    if (storedBalance) {
      setBalance(parseFloat(storedBalance));
    } else {
      // New users get 10 coins
      setBalance(10);
      localStorage.setItem('walletBalance', '10');
    }
    
    if (storedTransactions) {
      setTransactions(JSON.parse(storedTransactions));
    } else {
      // Create first transaction for new users
      const initialTransaction: TransactionItem = {
        id: 'welcome-bonus',
        type: 'incoming',
        amount: 10,
        timestamp: Date.now(),
        sender: 'HeroCoin Team',
      };
      
      setTransactions([initialTransaction]);
      localStorage.setItem('walletTransactions', JSON.stringify([initialTransaction]));
    }
  }, []);

  const formatWalletAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };
  
  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(walletAddress);
    // Show toast notification
  };

  const formatTransactionType = (type: string) => {
    switch (type) {
      case 'incoming':
        return 'Received';
      case 'outgoing':
        return 'Sent';
      case 'mining':
        return 'Mined';
      default:
        return type;
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'incoming':
        return <ArrowDownLeft className="w-4 h-4 text-green-500" />;
      case 'outgoing':
        return <ArrowUpRight className="w-4 h-4 text-red-500" />;
      case 'mining':
        return <Coins className="w-4 h-4 text-primary" />;
      default:
        return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="glass-card rounded-3xl p-8 shadow-lg">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Coins className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold">Hero Coin Wallet</h2>
          <p className="text-muted-foreground mt-2">
            Manage your Hero Coins
          </p>
        </div>
        
        <div className="space-y-6">
          {/* Balance card */}
          <div className="bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl p-6 text-center">
            <div className="text-sm font-medium text-muted-foreground mb-2">
              Current Balance
            </div>
            <div className="flex items-center justify-center">
              <Coins className="w-6 h-6 mr-2 text-primary" />
              <span className="text-3xl font-bold">{balance.toLocaleString()}</span>
            </div>
          </div>
          
          {/* Wallet address */}
          <div className="bg-secondary/50 rounded-xl p-4">
            <div className="text-sm font-medium text-muted-foreground mb-2">
              Wallet Address
            </div>
            <div className="flex items-center justify-between">
              <code className="text-sm font-mono">{formatWalletAddress(walletAddress)}</code>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8 rounded-lg"
                  onClick={copyToClipboard}
                >
                  Copy
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8 rounded-lg"
                  onClick={() => setShowQR(!showQR)}
                >
                  <QrCode className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* QR Code */}
            {showQR && (
              <div className="mt-4 flex justify-center animate-fade-in">
                <QRCodeComponent value={walletAddress} size={180} />
              </div>
            )}
          </div>
          
          {/* Action buttons */}
          <div className="flex space-x-4">
            <Button className="flex-1 rounded-xl py-6" variant="default">
              <Send className="mr-2 h-4 w-4" />
              Send
            </Button>
            <Button className="flex-1 rounded-xl py-6" variant="outline">
              <QrCode className="mr-2 h-4 w-4" />
              Receive
            </Button>
          </div>
          
          {/* Transactions */}
          <div className="pt-4">
            <Tabs defaultValue="all">
              <TabsList className="w-full mb-4">
                <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
                <TabsTrigger value="incoming" className="flex-1">Received</TabsTrigger>
                <TabsTrigger value="outgoing" className="flex-1">Sent</TabsTrigger>
                <TabsTrigger value="mining" className="flex-1">Mined</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all">
                <div className="space-y-3">
                  {transactions.length > 0 ? (
                    transactions.map((tx) => (
                      <div key={tx.id} className="bg-secondary/30 rounded-xl p-4 flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center mr-3">
                            {getTransactionIcon(tx.type)}
                          </div>
                          <div>
                            <div className="font-medium">{formatTransactionType(tx.type)}</div>
                            <div className="text-xs text-muted-foreground">{formatTimestamp(tx.timestamp)}</div>
                          </div>
                        </div>
                        <div className={cn(
                          "font-medium",
                          tx.type === 'incoming' || tx.type === 'mining' ? 'text-green-600' : 'text-red-600'
                        )}>
                          {tx.type === 'incoming' || tx.type === 'mining' ? '+' : '-'}{tx.amount}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-muted-foreground">
                      <p>No transactions yet</p>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="incoming">
                <div className="space-y-3">
                  {transactions.filter(tx => tx.type === 'incoming').length > 0 ? (
                    transactions
                      .filter(tx => tx.type === 'incoming')
                      .map((tx) => (
                        <div key={tx.id} className="bg-secondary/30 rounded-xl p-4 flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center mr-3">
                              <ArrowDownLeft className="w-4 h-4 text-green-500" />
                            </div>
                            <div>
                              <div className="font-medium">Received</div>
                              <div className="text-xs text-muted-foreground">{formatTimestamp(tx.timestamp)}</div>
                            </div>
                          </div>
                          <div className="font-medium text-green-600">
                            +{tx.amount}
                          </div>
                        </div>
                      ))
                  ) : (
                    <div className="text-center py-6 text-muted-foreground">
                      <p>No incoming transactions yet</p>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="outgoing">
                <div className="space-y-3">
                  {transactions.filter(tx => tx.type === 'outgoing').length > 0 ? (
                    transactions
                      .filter(tx => tx.type === 'outgoing')
                      .map((tx) => (
                        <div key={tx.id} className="bg-secondary/30 rounded-xl p-4 flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center mr-3">
                              <ArrowUpRight className="w-4 h-4 text-red-500" />
                            </div>
                            <div>
                              <div className="font-medium">Sent</div>
                              <div className="text-xs text-muted-foreground">{formatTimestamp(tx.timestamp)}</div>
                            </div>
                          </div>
                          <div className="font-medium text-red-600">
                            -{tx.amount}
                          </div>
                        </div>
                      ))
                  ) : (
                    <div className="text-center py-6 text-muted-foreground">
                      <p>No outgoing transactions yet</p>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="mining">
                <div className="space-y-3">
                  {transactions.filter(tx => tx.type === 'mining').length > 0 ? (
                    transactions
                      .filter(tx => tx.type === 'mining')
                      .map((tx) => (
                        <div key={tx.id} className="bg-secondary/30 rounded-xl p-4 flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center mr-3">
                              <Coins className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                              <div className="font-medium">Mined</div>
                              <div className="text-xs text-muted-foreground">{formatTimestamp(tx.timestamp)}</div>
                            </div>
                          </div>
                          <div className="font-medium text-green-600">
                            +{tx.amount}
                          </div>
                        </div>
                      ))
                  ) : (
                    <div className="text-center py-6 text-muted-foreground">
                      <p>No mining rewards yet</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletCard;
