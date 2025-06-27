
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

interface ValidationErrorsProps {
  errors: string[];
}

export const ValidationErrors: React.FC<ValidationErrorsProps> = ({ errors }) => {
  if (errors.length === 0) return null;

  return (
    <Card className="bg-red-900/20 border-red-500/50">
      <CardHeader>
        <CardTitle className="text-red-400 flex items-center space-x-2">
          <AlertCircle className="h-5 w-5" />
          <span>Validation Errors</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-1 text-sm text-red-300">
          {errors.map((error, index) => (
            <li key={index}>• {error}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};
