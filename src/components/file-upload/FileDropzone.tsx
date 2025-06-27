
import React from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText } from 'lucide-react';

interface FileDropzoneProps {
  onDrop: (acceptedFiles: File[]) => void;
  uploadedFile: File | null;
}

export const FileDropzone: React.FC<FileDropzoneProps> = ({ onDrop, uploadedFile }) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.csv']
    },
    maxFiles: 1
  });

  return (
    <>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200 ${
          isDragActive
            ? 'border-orange-500 bg-orange-500/10'
            : 'border-slate-600 hover:border-slate-500 hover:bg-slate-700/50'
        }`}
      >
        <input {...getInputProps()} />
        <div className="space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
            <Upload className="h-8 w-8 text-white" />
          </div>
          <div>
            <p className="text-lg font-medium text-white">
              {isDragActive ? 'Drop your CSV file here' : 'Drag & drop your CSV file here'}
            </p>
            <p className="text-slate-400 mt-1">
              or click to browse files
            </p>
          </div>
          <div className="text-xs text-slate-500">
            Expected columns: transactionId, storeId, employeeId, storeLocation, productId, productCategory, paymentType, amount, refundRequested, customerId, timestamp, latitude, longitude
          </div>
        </div>
      </div>

      {uploadedFile && (
        <div className="mt-4 p-4 bg-slate-700 rounded-lg">
          <div className="flex items-center space-x-2 text-green-400 mb-2">
            <FileText className="h-4 w-4" />
            <span className="font-medium">{uploadedFile.name}</span>
          </div>
          <p className="text-sm text-slate-300">
            Size: {(uploadedFile.size / 1024).toFixed(1)} KB
          </p>
        </div>
      )}
    </>
  );
};
