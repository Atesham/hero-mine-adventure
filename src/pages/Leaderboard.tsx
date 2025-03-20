
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Container from '@/components/ui/Container';
import { Trophy, Medal, Award, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { getTopMiners } from '@/services/transactionService';
import { toast } from 'sonner';

interface Miner {
  id: string;
  name: string;
  coins: number;
  level: string;
  rank: number;
}

const Leaderboard = () => {
  const [topMiners, setTopMiners] = useState<Miner[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLeaderboard = async () => {
    try {
      setError(null);
      setLoading(true);
      
      const miners = await getTopMiners(10);
      setTopMiners(miners);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      setError('Could not load leaderboard data. Please try again later.');
      toast.error('Error loading leaderboard', {
        description: 'Could not load the leaderboard data. Please try again later.'
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchLeaderboard();
  };

  const getLevelIcon = (position: number) => {
    if (position === 0) return <Trophy className="h-6 w-6 text-yellow-500" />;
    if (position === 1) return <Medal className="h-6 w-6 text-gray-400" />;
    if (position === 2) return <Award className="h-6 w-6 text-amber-700" />;
    return null;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-32 pb-16">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center rounded-full px-3 py-1 text-sm bg-primary/10 text-primary mb-4">
              <span className="animate-pulse-soft mr-1">●</span> Global Rankings
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Hero Coin Leaderboard
            </h1>
            <p className="text-lg text-muted-foreground">
              Discover the top miners in the Hero Coin community
            </p>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="ml-2 text-lg">Loading leaderboard...</p>
            </div>
          ) : error ? (
            <Alert variant="destructive" className="max-w-2xl mx-auto mb-8">
              <AlertTitle>Error loading leaderboard</AlertTitle>
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
            <div className="glass-card rounded-xl p-6 overflow-hidden">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Top Miners</h3>
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
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-secondary/50">
                      <th className="text-left py-4 px-4">Rank</th>
                      <th className="text-left py-4 px-4">Miner</th>
                      <th className="text-left py-4 px-4">Level</th>
                      <th className="text-right py-4 px-4">Total Coins</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topMiners.length > 0 ? (
                      topMiners.map((miner, index) => (
                        <tr key={miner.id} className="border-b border-secondary/20 hover:bg-secondary/20 transition-colors">
                          <td className="py-4 px-4 flex items-center">
                            <span className="font-bold mr-2">#{index + 1}</span>
                            {index < 3 && getLevelIcon(index)}
                          </td>
                          <td className="py-4 px-4 font-medium">{miner.name}</td>
                          <td className="py-4 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              miner.level === "Diamond" ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300" :
                              miner.level === "Platinum" ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300" :
                              miner.level === "Gold" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300" :
                              miner.level === "Silver" ? "bg-gray-100 text-gray-800 dark:bg-gray-800/50 dark:text-gray-300" :
                              "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
                            }`}>
                              {miner.level}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-right font-bold">{miner.coins.toLocaleString()} HC</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="py-8 text-center text-muted-foreground">
                          No miners found. Be the first to start mining Hero Coins!
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </Container>
      </main>
      
      <Footer />
    </div>
  );
};

export default Leaderboard;
