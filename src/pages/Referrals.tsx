
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { toast } from 'sonner';
import { getUserReferrals, getReferralStats } from '@/services/referralService';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users, Award, RefreshCw, Download, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

const ReferralsPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [referrals, setReferrals] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, totalRewards: 0 });
  const [searchTerm, setSearchTerm] = useState('');
  
  const fetchReferrals = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const userReferrals = await getUserReferrals(user.uid);
      const referralStats = await getReferralStats(user.uid);
      
      setReferrals(userReferrals);
      setStats(referralStats);
    } catch (error) {
      console.error('Error fetching referrals:', error);
      toast.error('Could not load referrals');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  useEffect(() => {
    fetchReferrals();
  }, [user]);
  
  const handleRefresh = () => {
    setRefreshing(true);
    fetchReferrals();
  };
  
  const filteredReferrals = referrals.filter(ref => 
    ref.referredName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const exportToCsv = () => {
    if (!referrals.length) return;
    
    const headers = ['Name', 'Date', 'Status', 'Reward'];
    const csvData = referrals.map(ref => [
      ref.referredName,
      new Date(ref.timestamp).toLocaleDateString(),
      ref.status,
      `${ref.rewardAmount || 25} coins`
    ]);
    
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `referrals-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      <Navbar />
      <main className="flex-1 py-10">
        <div className="container px-4 mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Your Referrals</h1>
            <p className="text-muted-foreground">
              Track all your referrals and rewards in one place
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="glass-card rounded-xl p-6 flex items-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Referrals</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
            
            <div className="glass-card rounded-xl p-6 flex items-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                <Award className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Rewards Earned</p>
                <p className="text-2xl font-bold">{stats.totalRewards} coins</p>
              </div>
            </div>
            
            <div className="glass-card rounded-xl p-6 flex items-center justify-between">
              <div className="flex space-x-2">
                <Button onClick={handleRefresh} variant="outline" size="sm" disabled={refreshing}>
                  {refreshing ? (
                    <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <RefreshCw className="h-4 w-4 mr-2" />
                  )}
                  Refresh
                </Button>
                
                <Button onClick={exportToCsv} variant="outline" size="sm" disabled={!referrals.length}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </div>
          
          <div className="glass-card rounded-xl overflow-hidden">
            <div className="p-4 border-b">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h2 className="text-xl font-semibold">Referral History</h2>
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>
            
            {loading ? (
              <div className="flex justify-center items-center p-12">
                <RefreshCw className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2">Loading referrals...</span>
              </div>
            ) : (
              <div className="overflow-x-auto">
                {filteredReferrals.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Reward</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredReferrals.map((referral) => (
                        <TableRow key={referral.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                                <Users className="w-4 h-4 text-primary" />
                              </div>
                              {referral.referredName}
                            </div>
                          </TableCell>
                          <TableCell>
                            {new Date(referral.timestamp).toLocaleDateString()} at{' '}
                            {new Date(referral.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              referral.status === 'completed' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {referral.status === 'completed' ? 'Completed' : 'Pending'}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className="font-semibold text-primary">
                              +{referral.rewardAmount || 25} coins
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-12">
                    <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">
                      {searchTerm ? 'No matching referrals found' : 'No referrals yet'}
                    </h3>
                    <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                      {searchTerm 
                        ? 'Try a different search term or clear the search field' 
                        : 'Invite your friends to join Hero Coin and start earning bonus coins!'}
                    </p>
                    {searchTerm && (
                      <Button variant="outline" onClick={() => setSearchTerm('')}>
                        Clear Search
                      </Button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ReferralsPage;
