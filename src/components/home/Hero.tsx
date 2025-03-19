
import React, { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, Coins } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const Hero = () => {
  const isMobile = useIsMobile();
  const coinRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!coinRef.current || isMobile) return;
      
      const { clientX, clientY } = e;
      const rect = coinRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const moveX = (clientX - centerX) / 30;
      const moveY = (clientY - centerY) / 30;
      
      coinRef.current.style.transform = `perspective(1000px) rotateY(${moveX}deg) rotateX(${-moveY}deg)`;
    };

    document.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isMobile]);

  return (
    <section className="relative overflow-hidden pt-32 pb-16 md:pt-40 md:pb-24">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/20" />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="md:pr-8 space-y-6 animate-slide-up">
            <div className="inline-flex items-center rounded-full px-3 py-1 text-sm bg-primary/10 text-primary mb-2">
              <span className="animate-pulse-soft mr-1">●</span> Revolutionary Digital Mining
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-balance">
              Mine Hero Coins<br /> 
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                The New Digital Currency
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-lg">
              Start earning Hero Coins by watching ads and engaging with content. A seamless mining experience with real rewards.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button asChild size="lg" className="rounded-full">
                <Link to="/mining">
                  Start Mining
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              
              <Button asChild variant="outline" size="lg" className="rounded-full">
                <Link to="/about">
                  Learn More
                </Link>
              </Button>
            </div>
          </div>
          
          <div className="flex justify-center">
            <div 
              ref={coinRef}
              className="relative w-64 h-64 md:w-80 md:h-80 transition-all duration-200 animate-float"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/80 to-primary rounded-full blur-3xl opacity-20" />
              <div className="relative bg-gradient-to-br from-primary/90 to-primary/70 rounded-full w-full h-full flex items-center justify-center shadow-lg">
                <Coins className="w-24 h-24 md:w-32 md:h-32 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
