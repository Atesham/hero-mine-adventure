
import React from 'react';
import Hero from '@/components/home/Hero';
import Features from '@/components/home/Features';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, PlayCircle, ShieldCheck, Users } from 'lucide-react';
import Container from '@/components/ui/Container';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        <Hero />
        <Features />
        
        {/* How it works section */}
        <section className="py-20">
          <Container>
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                How Hero Coin Mining Works
              </h2>
              <p className="text-xl text-muted-foreground">
                A simplified mining process made accessible for everyone
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <PlayCircle className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Watch Ads</h3>
                <p className="text-muted-foreground">
                  Simply watch two short ads every 12 hours to start mining Hero Coins.
                </p>
              </div>
              
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Invite Friends</h3>
                <p className="text-muted-foreground">
                  Refer friends and earn bonus coins whenever they complete mining.
                </p>
              </div>
              
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShieldCheck className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Secure Transactions</h3>
                <p className="text-muted-foreground">
                  Send and receive Hero Coins with ease through our secure platform.
                </p>
              </div>
            </div>
            
            <div className="text-center mt-12">
              <Button asChild size="lg" className="rounded-full">
                <Link to="/mining">
                  Start Mining Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </Container>
        </section>
        
        {/* CTA section */}
        <section className="py-16 bg-primary/5">
          <Container>
            <div className="glass-card rounded-3xl p-8 md:p-12 lg:p-16 text-center max-w-4xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold mb-6">
                Join Thousands of Hero Coin Miners Today
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Start your mining journey and earn your first coins in just minutes. No technical knowledge required.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button asChild size="lg" className="rounded-full">
                  <Link to="/mining">
                    Start Mining
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="rounded-full">
                  <Link to="/wallet">
                    Explore Wallet
                  </Link>
                </Button>
              </div>
            </div>
          </Container>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
