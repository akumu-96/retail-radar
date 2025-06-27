
import React from 'react';
import { Progress } from '@/components/ui/progress';

interface ProcessingProgressProps {
  progress: number;
}

export const ProcessingProgress: React.FC<ProcessingProgressProps> = ({ progress }) => {
  const getProgressMessage = () => {
    if (progress < 25) return 'Parsing data...';
    if (progress < 50) return 'Validating transactions...';
    if (progress < 75) return 'Running AI fraud detection...';
    return 'Generating insights...';
  };

  return (
    <div className="mt-4 space-y-2">
      <Progress value={progress} className="w-full" />
      <p className="text-sm text-slate-400 text-center">
        {getProgressMessage()}
      </p>
    </div>
  );
};
