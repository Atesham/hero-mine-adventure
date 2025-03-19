
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Container from '@/components/ui/Container';
import { Trophy, Medal, Award } from 'lucide-react';

const Leaderboard = () => {
  const topMiners = [
    { id: 1, name: "CryptoKing", coins: 12500, level: "Diamond" },
    { id: 2, name: "MiningMaster", coins: 9750, level: "Platinum" },
    { id: 3, name: "CoinCollector", coins: 8900, level: "Gold" },
    { id: 4, name: "BlockchainBaron", coins: 7600, level: "Silver" },
    { id: 5, name: "DigitalMiner", coins: 6400, level: "Silver" },
    { id: 6, name: "HashHunter", coins: 5900, level: "Bronze" },
    { id: 7, name: "BitBaron", coins: 4800, level: "Bronze" },
    { id: 8, name: "CryptoQueen", coins: 4200, level: "Bronze" },
    { id: 9, name: "TokenTitan", coins: 3900, level: "Bronze" },
    { id: 10, name: "MiningMaven", coins: 3500, level: "Bronze" },
  ];

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
          
          <div className="glass-card rounded-xl p-6 overflow-hidden">
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
                  {topMiners.map((miner, index) => (
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
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Container>
      </main>
      
      <Footer />
    </div>
  );
};

export default Leaderboard;
