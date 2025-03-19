
import React from 'react';
import { Coins, Send, Users, Trophy, Shield, QrCode } from 'lucide-react';

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const Feature: React.FC<FeatureProps> = ({ icon, title, description }) => {
  return (
    <div className="group p-6 rounded-2xl bg-card hover:bg-primary/5 transition-all duration-300 border border-border hover:border-primary/20">
      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-5 group-hover:bg-primary/20 transition-colors duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

const Features = () => {
  const features = [
    {
      icon: <Coins className="h-6 w-6" />,
      title: "Mine Hero Coins",
      description: "Earn Hero Coins every 12 hours by watching short ads. Simple, rewarding, and automatic."
    },
    {
      icon: <Send className="h-6 w-6" />,
      title: "Send & Receive",
      description: "Seamlessly transfer Hero Coins to other users with just a wallet address or QR code."
    },
    {
      icon: <QrCode className="h-6 w-6" />,
      title: "QR Code System",
      description: "Generate unique QR codes for your wallet to receive Hero Coins quickly and securely."
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Referral Program",
      description: "Invite friends and earn bonus Hero Coins when they join and start mining."
    },
    {
      icon: <Trophy className="h-6 w-6" />,
      title: "Leaderboard",
      description: "Compete with other miners and earn recognition and rewards for your mining activity."
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Secure Transactions",
      description: "All transactions are secured with advanced encryption and blockchain technology."
    },
  ];

  return (
    <section className="py-20 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Powerful Features for Digital Miners
          </h2>
          <p className="text-xl text-muted-foreground">
            Discover the innovative tools that make Hero Coin mining efficient, rewarding, and secure.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Feature
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
