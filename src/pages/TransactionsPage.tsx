import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Transaction, getUserWalletData } from '@/services/transactionService';
import { ArrowLeft, Filter, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useIsMobile } from '@/hooks/use-mobile';

const TransactionsPage = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'sent' | 'received' | 'reward'>('all');
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({ 
    start: '', 
    end: '' 
  });
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useIsMobile();

  useEffect(() => {
    const loadTransactions = async () => {
      if (user) {
        try {
          setIsLoading(true);
          const data = await getUserWalletData(user.uid);
          setTransactions(data.transactions);
          setFilteredTransactions(data.transactions);
        } catch (error) {
          console.error('Error loading transactions:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    loadTransactions();
  }, [user]);

  useEffect(() => {
    applyFilters();
  }, [searchQuery, selectedType, dateRange, transactions]);

  const applyFilters = () => {
    let filtered = [...transactions];

    // Type filter
    if (selectedType !== 'all') {
      filtered = filtered.filter(t => t.type === selectedType);
    }

    // Date filter - only apply if both dates have values
    if (dateRange.start && dateRange.end) {
      const startDate = new Date(dateRange.start);
      const endDate = new Date(dateRange.end);
      
      // Set end date to end of day
      endDate.setHours(23, 59, 59, 999);

      filtered = filtered.filter(t => {
        const transactionDate = new Date(t.timestamp);
        return transactionDate >= startDate && transactionDate <= endDate;
      });
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(t =>
        t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.counterpartyName?.toLowerCase().includes(searchQuery.toLowerCase())) ||
        t.amount.toString().includes(searchQuery)
      );
    }

    setFilteredTransactions(filtered);
  };

  const handleDateChange = (type: 'start' | 'end', value: string) => {
    setDateRange(prev => ({
      ...prev,
      [type]: value
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-background"
    >
      <div className="max-w-4xl mx-auto p-4 md:p-6">
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <Link to="/wallet" className="flex items-center text-primary">
            <ArrowLeft className="h-5 w-5 mr-2" />
            <span className="hidden md:inline">Back to Wallet</span>
          </Link>
          <h1 className="text-xl md:text-2xl font-bold">Transaction History</h1>
        </div>

        {/* Filters Section - Stacked on mobile, row on desktop */}
        <div className="flex flex-col gap-3 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search transactions..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex flex-col md:flex-row gap-3">
            <select
              className="rounded-md border p-2 bg-background flex-1"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as any)}
              disabled={isLoading}
            >
              <option value="all">All Transactions</option>
              <option value="sent">Sent</option>
              <option value="received">Received</option>
              <option value="reward">Rewards</option>
            </select>

            <div className="flex items-center gap-2 flex-1">
              <Input
                type="date"
                className="flex-1 min-w-0"
                value={dateRange.start}
                onChange={(e) => handleDateChange('start', e.target.value)}
                disabled={isLoading}
              />
              <span className="text-sm">to</span>
              <Input
                type="date"
                className="flex-1 min-w-0"
                value={dateRange.end}
                onChange={(e) => handleDateChange('end', e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>
        </div>

        {/* Transactions List */}
        <motion.div 
          className="space-y-4"
          initial={{ y: 20 }}
          animate={{ y: 0 }}
        >
          {isLoading ? (
            // Skeleton loading state
            [...Array(5)].map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="glass-card rounded-xl p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[200px]" />
                      <Skeleton className="h-3 w-[150px]" />
                      <Skeleton className="h-3 w-[100px]" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[80px] ml-auto" />
                    <Skeleton className="h-3 w-[60px] ml-auto" />
                  </div>
                </div>
              </motion.div>
            ))
          ) : filteredTransactions.length > 0 ? (
            // Actual transactions
            filteredTransactions.map((transaction, index) => (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="glass-card rounded-xl p-4 hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-full flex-shrink-0 ${
                      transaction.type === 'sent' ? 'bg-red-100' :
                      transaction.type === 'received' ? 'bg-green-100' :
                      'bg-primary/10'
                    }`}>
                      {transaction.type === 'sent' ? '➚' : 
                       transaction.type === 'received' ? '➘' : '★'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">{transaction.description}</h3>
                      <p className="text-sm text-muted-foreground">
                        {new Date(transaction.timestamp).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </p>
                      {transaction.counterpartyName && (
                        <p className="text-sm mt-1 truncate">
                          {transaction.type === 'sent' ? 'To: ' : 'From: '}
                          <span className="font-medium">
                            {transaction.counterpartyName}
                          </span>
                        </p>
                      )}
                    </div>
                  </div>
                  <div className={`text-right md:text-left ${
                    transaction.type === 'sent' ? 'text-red-500' :
                    transaction.type === 'received' ? 'text-green-500' :
                    'text-primary'
                  }`}>
                    <span className="block text-lg font-bold whitespace-nowrap">
                      {transaction.type === 'sent' ? '-' : '+'}
                      HC {transaction.amount.toFixed(0)}
                    </span>
                    <span className="text-sm capitalize">{transaction.type}</span>
                  </div>
                </div>
                
                {transaction.counterpartyAddress && (
                  <div className="mt-2 text-sm text-muted-foreground truncate">
                    Wallet: {transaction.counterpartyAddress}
                  </div>
                )}
              </motion.div>
            ))
          ) : (
            // Empty state
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <p className="text-muted-foreground">No transactions found</p>
              {transactions.length === 0 ? (
                <p className="text-sm mt-2">Your transaction history is empty</p>
              ) : (
                <p className="text-sm mt-2">Try adjusting your filters</p>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default TransactionsPage;