
import React from 'react';
import { cn } from '@/lib/utils';

interface AnimatedIconProps {
  children: React.ReactNode;
  className?: string;
  animation?: 'pulse' | 'spin' | 'float' | 'bounce';
}

const AnimatedIcon: React.FC<AnimatedIconProps> = ({ 
  children, 
  className,
  animation = 'pulse'
}) => {
  return (
    <div 
      className={cn(
        'flex items-center justify-center',
        {
          'animate-pulse-soft': animation === 'pulse',
          'animate-spin-slow': animation === 'spin',
          'animate-float': animation === 'float',
          'animate-bounce': animation === 'bounce',
        },
        className
      )}
    >
      {children}
    </div>
  );
};

export default AnimatedIcon;
