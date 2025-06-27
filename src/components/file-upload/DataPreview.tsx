
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Loader2 } from 'lucide-react';
import { ProcessingProgress } from './ProcessingProgress';

interface DataPreviewProps {
  data: any[];
  validationErrors: string[];
  isProcessing: boolean;
  progress: number;
  onProcess: () => void;
}

export const DataPreview: React.FC<DataPreviewProps> = ({ 
  data, 
  validationErrors, 
  isProcessing, 
  progress, 
  onProcess 
}) => {
  if (data.length === 0 || validationErrors.length > 0) return null;

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center space-x-2">
          <CheckCircle className="h-5 w-5 text-green-400" />
          <span>Data Preview</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-600">
                {Object.keys(data[0] || {}).map((key) => (
                  <th key={key} className="text-left py-2 px-3 text-slate-300 font-medium">
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr key={index} className="border-b border-slate-700">
                  {Object.values(row).map((value: any, i) => (
                    <td key={i} className="py-2 px-3 text-slate-400">
                      {String(value)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-6 flex justify-between items-center">
          <p className="text-slate-400 text-sm">
            Showing first 5 rows • Ready to process {data.length}+ transactions
          </p>
          <Button
            onClick={onProcess}
            disabled={isProcessing}
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-medium px-6 py-2"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              'Analyze for Fraud'
            )}
          </Button>
        </div>

        {isProcessing && <ProcessingProgress progress={progress} />}
      </CardContent>
    </Card>
  );
};
