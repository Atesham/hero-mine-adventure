
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import MiningCard from '@/components/mining/MiningCard';
import Container from '@/components/ui/Container';
import { Coins } from 'lucide-react';

const Mining = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-32 pb-16">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center rounded-full px-3 py-1 text-sm bg-primary/10 text-primary mb-4">
              <span className="animate-pulse-soft mr-1">●</span> Mining Rewards
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Mine Hero Coins
            </h1>
            <p className="text-lg text-muted-foreground">
              Watch ads every 12 hours to earn Hero Coins that are automatically added to your wallet.
            </p>
          </div>
          
          <MiningCard />
          
          <div className="mt-16 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-8">
              Mining FAQ
            </h2>
            
            <div className="space-y-6">
              <div className="glass-card rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-2 flex items-center">
                  <Coins className="w-5 h-5 mr-2 text-primary" />
                  How does mining work?
                </h3>
                <p className="text-muted-foreground">
                  Mining is a simple process where you watch two short ads every 12 hours. After completing both ads, you'll receive Hero Coins directly in your wallet.
                </p>
              </div>
              
              <div className="glass-card rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-2 flex items-center">
                  <Coins className="w-5 h-5 mr-2 text-primary" />
                  How many coins can I earn?
                </h3>
                <p className="text-muted-foreground">
                  You can earn between 5-15 Hero Coins per mining session. The exact amount varies randomly with each mining session.
                </p>
              </div>
              
              <div className="glass-card rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-2 flex items-center">
                  <Coins className="w-5 h-5 mr-2 text-primary" />
                  Why is there a 12-hour cooldown?
                </h3>
                <p className="text-muted-foreground">
                  The cooldown period ensures a balanced mining economy. It prevents excessive mining while giving everyone fair opportunities to earn coins.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </main>
      
      <Footer />
    </div>
  );
};

export default Mining;


