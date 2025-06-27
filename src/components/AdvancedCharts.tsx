
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ScatterChart,
  Scatter,
  Cell
} from 'recharts';
import { TransactionData } from '@/pages/Index';
import { TrendingUp, Target, BarChart } from 'lucide-react';

interface AdvancedChartsProps {
  data: TransactionData[];
}

export const AdvancedCharts: React.FC<AdvancedChartsProps> = ({ data }) => {
  // Time series data for fraud trends
  const timeSeriesData = React.useMemo(() => {
    const grouped = data.reduce((acc, transaction) => {
      const date = new Date(transaction.Timestamp).toDateString();
      if (!acc[date]) {
        acc[date] = { date, total: 0, fraud: 0, amount: 0 };
      }
      acc[date].total++;
      acc[date].amount += transaction.Amount;
      if (transaction.riskLevel === 'High') {
        acc[date].fraud++;
      }
      return acc;
    }, {} as any);

    return Object.values(grouped).slice(-7); // Last 7 days
  }, [data]);

  // Radar chart data for risk factors
  const riskFactorData = React.useMemo(() => {
    const paymentTypes = data.reduce((acc, t) => {
      if (!acc[t.PaymentType]) acc[t.PaymentType] = { total: 0, fraud: 0 };
      acc[t.PaymentType].total++;
      if (t.riskLevel === 'High') acc[t.PaymentType].fraud++;
      return acc;
    }, {} as any);

    return Object.entries(paymentTypes).map(([type, stats]: any) => ({
      factor: type,
      risk: ((stats.fraud / stats.total) * 100).toFixed(1),
      fullMark: 100
    }));
  }, [data]);

  // Scatter plot data for amount vs fraud score
  const scatterData = React.useMemo(() => {
    return data.map(transaction => ({
      amount: transaction.Amount,
      fraudScore: (transaction.fraudScore || 0) * 100,
      riskLevel: transaction.riskLevel
    }));
  }, [data]);

  const getScatterColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'High': return '#ef4444';
      case 'Medium': return '#f59e0b';
      default: return '#10b981';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {/* Time Series Fraud Trends */}
      <Card className="bg-slate-800 border-slate-700 xl:col-span-2">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Fraud Trends Over Time</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={timeSeriesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="total" 
                stackId="1"
                stroke="#3b82f6" 
                fill="#3b82f6" 
                fillOpacity={0.3}
                name="Total Transactions"
              />
              <Area 
                type="monotone" 
                dataKey="fraud" 
                stackId="2"
                stroke="#ef4444" 
                fill="#ef4444" 
                fillOpacity={0.6}
                name="Fraud Cases"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Risk Factor Radar */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Target className="h-5 w-5" />
            <span>Risk Factors</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={riskFactorData}>
              <PolarGrid stroke="#374151" />
              <PolarAngleAxis dataKey="factor" tick={{ fill: '#9ca3af', fontSize: 12 }} />
              <PolarRadiusAxis 
                angle={30} 
                domain={[0, 'dataMax']} 
                tick={{ fill: '#9ca3af', fontSize: 10 }}
              />
              <Radar
                name="Risk %"
                dataKey="risk"
                stroke="#f59e0b"
                fill="#f59e0b"
                fillOpacity={0.3}
                strokeWidth={2}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px'
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Amount vs Fraud Score Scatter */}
      <Card className="bg-slate-800 border-slate-700 xl:col-span-3">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <BarChart className="h-5 w-5" />
            <span>Transaction Amount vs Fraud Score</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart data={scatterData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                type="number" 
                dataKey="amount" 
                name="Amount" 
                stroke="#9ca3af"
                tickFormatter={(value) => `$${value}`}
              />
              <YAxis 
                type="number" 
                dataKey="fraudScore" 
                name="Fraud Score" 
                stroke="#9ca3af"
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip 
                cursor={{ strokeDasharray: '3 3' }}
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px'
                }}
                formatter={(value: any, name: string) => [
                  name === 'amount' ? `$${value}` : `${value}%`,
                  name === 'amount' ? 'Amount' : 'Fraud Score'
                ]}
              />
              <Scatter dataKey="fraudScore" fill="#8884d8">
                {scatterData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getScatterColor(entry.riskLevel)} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
          
          <div className="mt-4 flex items-center justify-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-slate-400">Low Risk</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-orange-500"></div>
              <span className="text-slate-400">Medium Risk</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-slate-400">High Risk</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
