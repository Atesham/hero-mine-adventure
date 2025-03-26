import React from 'react';
import { Clock } from 'lucide-react';

interface CooldownTimerProps {
  timeRemaining: number;
  formatTime: (time: number) => string;
}

const CooldownTimer: React.FC<CooldownTimerProps> = ({ 
  timeRemaining, 
  formatTime 
}) => {
  return (
    <div className="bg-secondary/50 rounded-xl p-4">
      <div className="flex items-center mb-2">
        <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
        <span className="text-sm font-medium">Next mining available in:</span>
      </div>
      <div className="text-2xl font-mono text-center font-bold">
        {formatTime(timeRemaining)}
      </div>
    </div>
  );
};

export default CooldownTimer;