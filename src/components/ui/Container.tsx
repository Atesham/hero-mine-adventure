
import React from 'react';
import { cn } from '@/lib/utils';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

const Container: React.FC<ContainerProps> = ({ children, className, id }) => {
  return (
    <div
      id={id}
      className={cn(
        'w-full px-4 md:px-6 mx-auto max-w-7xl',
        className
      )}
    >
      {children}
    </div>
  );
};

export default Container;
