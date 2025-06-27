
import React, { useCallback, useState } from 'react';
import Papa from 'papaparse';
import { TransactionData, FraudInsight } from '@/pages/Index';
import { detectFraud } from '@/utils/fraudDetection';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload } from 'lucide-react';
import { SampleDataDownloader } from './file-upload/SampleDataDownloader';
import { FileDropzone } from './file-upload/FileDropzone';
import { ValidationErrors } from './file-upload/ValidationErrors';
import { DataPreview } from './file-upload/DataPreview';
import { validateData } from './file-upload/dataValidation';

interface FileUploadProps {
  onDataProcessed: (data: TransactionData[], insights: FraudInsight[]) => void;
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ 
  onDataProcessed, 
  isProcessing, 
  setIsProcessing 
}) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [progress, setProgress] = useState(0);

  const filterEmptyRows = (data: any[]) => {
    return data.filter(row => {
      return Object.values(row).some(value => 
        value !== null && value !== undefined && String(value).trim() !== ''
      );
    });
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setUploadedFile(file);
      
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          const data = results.data as any[];
          const filteredData = filterEmptyRows(data);
          const errors = validateData(filteredData);
          setValidationErrors(errors);
          setPreviewData(filteredData.slice(0, 5)); // Show first 5 rows
        },
        error: (error) => {
          setValidationErrors([`Parse error: ${error.message}`]);
        }
      });
    }
  }, []);

  const processData = async () => {
    if (!uploadedFile) return;

    setIsProcessing(true);
    setProgress(0);

    Papa.parse(uploadedFile, {
      header: true,
      complete: async (results) => {
        try {
          setProgress(25);
          const rawData = results.data as any[];
          const filteredData = filterEmptyRows(rawData);
          
          setProgress(50);
          // Normalize field names and add mock store locations for visualization
          const dataWithLocations: TransactionData[] = filteredData.map((row, index) => ({
            TransactionID: row.transactionId || row.TransactionID,
            StoreID: row.storeId || row.StoreID,
            ProductID: row.productId || row.ProductID,
            PaymentType: row.paymentType || row.PaymentType || 'Credit Card',
            Amount: Number(row.amount || row.Amount),
            Timestamp: row.timestamp || row.Timestamp,
            StoreLocation: {
              lat: Number(row.latitude) || (40.7128 + (Math.random() - 0.5) * 10),
              lng: Number(row.longitude) || (-74.0060 + (Math.random() - 0.5) * 10),
              name: row.storeLocation || `Store ${row.storeId || row.StoreID}`
            }
          }));

          setProgress(75);
          const { processedData, insights } = await detectFraud(dataWithLocations);
          
          setProgress(100);
          setTimeout(() => {
            onDataProcessed(processedData, insights);
            setIsProcessing(false);
            setProgress(0);
          }, 500);
        } catch (error) {
          console.error('Processing error:', error);
          setIsProcessing(false);
          setProgress(0);
        }
      }
    });
  };

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Upload className="h-5 w-5" />
            <span>Upload Transaction Data</span>
          </CardTitle>
          <div className="flex justify-between items-center">
            <p className="text-slate-400">
              Upload your retail transaction data in CSV format for fraud analysis
            </p>
            <SampleDataDownloader />
          </div>
        </CardHeader>
        <CardContent>
          <FileDropzone onDrop={onDrop} uploadedFile={uploadedFile} />
        </CardContent>
      </Card>

      <ValidationErrors errors={validationErrors} />

      <DataPreview
        data={previewData}
        validationErrors={validationErrors}
        isProcessing={isProcessing}
        progress={progress}
        onProcess={processData}
      />
    </div>
  );
};
