
import React from 'react';
import { TransactionData } from '@/pages/Index';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Shield, AlertTriangle, DollarSign, TrendingUp } from 'lucide-react';

interface FraudSummaryProps {
  data: TransactionData[];
}

export const FraudSummary: React.FC<FraudSummaryProps> = ({ data }) => {
  const totalTransactions = data.length;
  const highRisk = data.filter(t => t.riskLevel === 'High').length;
  const mediumRisk = data.filter(t => t.riskLevel === 'Medium').length;
  const lowRisk = data.filter(t => t.riskLevel === 'Low').length;
  const totalFraudAmount = data
    .filter(t => t.riskLevel === 'High')
    .reduce((sum, t) => sum + t.Amount, 0);

  const fraudRate = ((highRisk / totalTransactions) * 100).toFixed(1);

  // Chart data
  const riskData = [
    { name: 'Low Risk', value: lowRisk, color: '#10b981' },
    { name: 'Medium Risk', value: mediumRisk, color: '#f59e0b' },
    { name: 'High Risk', value: highRisk, color: '#ef4444' }
  ];

  const paymentTypeData = data.reduce((acc, t) => {
    if (!acc[t.PaymentType]) acc[t.PaymentType] = { type: t.PaymentType, total: 0, fraud: 0 };
    acc[t.PaymentType].total++;
    if (t.riskLevel === 'High') acc[t.PaymentType].fraud++;
    return acc;
  }, {} as any);

  const paymentChart = Object.values(paymentTypeData);

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-blue-600 to-blue-700 border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total Transactions</p>
                <p className="text-3xl font-bold text-white">{totalTransactions.toLocaleString()}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-red-600 to-red-700 border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm font-medium">High Risk Fraud</p>
                <p className="text-3xl font-bold text-white">{highRisk}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-600 to-orange-700 border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium">Fraud Rate</p>
                <p className="text-3xl font-bold text-white">{fraudRate}%</p>
              </div>
              <Shield className="h-8 w-8 text-orange-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-600 to-green-700 border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Fraud Amount</p>
                <p className="text-3xl font-bold text-white">${totalFraudAmount.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Risk Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={riskData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {riskData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Fraud by Payment Type</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={paymentChart}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="type" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="total" fill="#3b82f6" name="Total" />
                <Bar dataKey="fraud" fill="#ef4444" name="Fraud" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
