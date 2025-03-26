import React from 'react';
import { Progress } from '@/components/ui/progress';

interface MiningProgressProps {
  progress: number;
}

const MiningProgress: React.FC<MiningProgressProps> = ({ progress }) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm">
        <span>Mining progress</span>
        <span>{progress}%</span>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
};

export default MiningProgress;