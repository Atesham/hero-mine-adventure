import React from 'react';
import { Button } from '@/components/ui/button';
import { PlayCircle, Clock, Loader2 } from 'lucide-react';

interface MiningControlsProps {
  isMining: boolean;
  timeRemaining: number | null;
  startMining: () => void;
}

const MiningControls: React.FC<MiningControlsProps> = ({
  isMining,
  timeRemaining,
  startMining
}) => {
  return (
    <Button 
      className="w-full rounded-xl py-6 text-lg font-medium"
      disabled={isMining || timeRemaining !== null}
      onClick={startMining}
    >
      {isMining ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Mining...
        </>
      ) : timeRemaining !== null ? (
        <>
          <Clock className="mr-2 h-5 w-5" />
          Cooling Down
        </>
      ) : (
        <>
          <PlayCircle className="mr-2 h-5 w-5" />
          Start Mining
        </>
      )}
    </Button>
  );
};

export default MiningControls;