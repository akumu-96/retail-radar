
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

export const SampleDataDownloader: React.FC = () => {
  const downloadSampleCsv = () => {
    const headers = [
      'transactionId',
      'storeId',
      'employeeId',
      'storeLocation',
      'productId',
      'productCategory',
      'paymentType',
      'amount',
      'refundRequested',
      'customerId',
      'timestamp',
      'latitude',
      'longitude'
    ];

    const sampleData = [
      ['TXN001', 'ST001', 'EMP001', 'New York Store', 'PRD001', 'Electronics', 'Credit Card', '299.99', 'false', 'CUST001', '2024-06-07T10:30:00Z', '40.7128', '-74.0060'],
      ['TXN002', 'ST002', 'EMP002', 'Los Angeles Store', 'PRD002', 'Clothing', 'Cash', '89.50', 'false', 'CUST002', '2024-06-07T11:15:00Z', '34.0522', '-118.2437'],
      ['TXN003', 'ST001', 'EMP003', 'New York Store', 'PRD003', 'Home & Garden', 'Debit Card', '150.75', 'true', 'CUST003', '2024-06-07T12:00:00Z', '40.7128', '-74.0060'],
      ['TXN004', 'ST003', 'EMP004', 'Chicago Store', 'PRD004', 'Books', 'Credit Card', '45.99', 'false', 'CUST004', '2024-06-07T13:30:00Z', '41.8781', '-87.6298'],
      ['TXN005', 'ST002', 'EMP005', 'Los Angeles Store', 'PRD005', 'Electronics', 'Mobile Payment', '799.99', 'false', 'CUST005', '2024-06-07T14:45:00Z', '34.0522', '-118.2437']
    ];

    const csvContent = [
      headers.join(','),
      ...sampleData.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample_transaction_data.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Button
      onClick={downloadSampleCsv}
      variant="outline"
      size="sm"
      className="border-slate-600 text-slate-300 hover:bg-slate-700"
    >
      <Download className="h-4 w-4 mr-2" />
      Download Sample CSV
    </Button>
  );
};
