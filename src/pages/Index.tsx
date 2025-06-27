
import React, { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { FileUpload } from '@/components/FileUpload';
import { FraudHeatmap } from '@/components/FraudHeatmap';
import { AIInsights } from '@/components/AIInsights';
import { FraudSummary } from '@/components/FraudSummary';
import { ExportReports } from '@/components/ExportReports';
import { RealTimeMonitor } from '@/components/RealTimeMonitor';
import { AdvancedCharts } from '@/components/AdvancedCharts';
import { AIChat } from '@/components/AIChat';
import { PredictiveAnalytics } from '@/components/PredictiveAnalytics';

export interface TransactionData {
  TransactionID: string;
  StoreID: string;
  ProductID: string;
  PaymentType: string;
  Amount: number;
  Timestamp: string;
  StoreLocation?: {
    lat: number;
    lng: number;
    name: string;
  };
  fraudScore?: number;
  riskLevel?: 'Low' | 'Medium' | 'High';
  fraudType?: string;
}

export interface FraudInsight {
  type: string;
  description: string;
  impact: string;
  recommendation: string;
  priority: 'Low' | 'Medium' | 'High';
}

const Index = () => {
  const [activeView, setActiveView] = useState('upload');
  const [transactionData, setTransactionData] = useState<TransactionData[]>([]);
  const [fraudInsights, setFraudInsights] = useState<FraudInsight[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDataProcessed = (data: TransactionData[], insights: FraudInsight[]) => {
    setTransactionData(data);
    setFraudInsights(insights);
    setActiveView('dashboard');
  };

  const renderActiveView = () => {
    switch (activeView) {
      case 'upload':
        return (
          <FileUpload 
            onDataProcessed={handleDataProcessed}
            isProcessing={isProcessing}
            setIsProcessing={setIsProcessing}
          />
        );
      case 'dashboard':
        return (
          <div className="space-y-6">
            <FraudSummary data={transactionData} />
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2">
                <FraudHeatmap data={transactionData} />
              </div>
              <div>
                <RealTimeMonitor data={transactionData} />
              </div>
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <AIInsights insights={fraudInsights} data={transactionData} />
              <AIChat data={transactionData} insights={fraudInsights} />
            </div>
          </div>
        );
      case 'analytics':
        return (
          <div className="space-y-6">
            <AdvancedCharts data={transactionData} />
          </div>
        );
      case 'predictions':
        return (
          <div className="space-y-6">
            <PredictiveAnalytics data={transactionData} />
          </div>
        );
      case 'reports':
        return <ExportReports data={transactionData} insights={fraudInsights} />;
      default:
        return <FileUpload onDataProcessed={handleDataProcessed} isProcessing={isProcessing} setIsProcessing={setIsProcessing} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Sidebar activeView={activeView} setActiveView={setActiveView} hasData={transactionData.length > 0} />
      
      <main className="flex-1 p-6 ml-64">
        <div className="max-w-7xl mx-auto">
          <header className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">
                  Retail Risk Radar
                </h1>
                <p className="text-slate-300 text-lg">
                  AI-Powered Fraud Detection & Analytics Platform
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg text-white font-semibold shadow-lg">
                  {transactionData.length > 0 ? `${transactionData.length} Transactions Loaded` : 'Ready to Analyze'}
                </div>
              </div>
            </div>
          </header>

          {renderActiveView()}
        </div>
      </main>
    </div>
  );
};

export default Index;
