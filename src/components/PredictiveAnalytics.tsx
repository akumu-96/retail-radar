
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { TransactionData } from '@/pages/Index';
import { TrendingUp, AlertTriangle, Target, Calendar } from 'lucide-react';

interface PredictiveAnalyticsProps {
  data: TransactionData[];
}

export const PredictiveAnalytics: React.FC<PredictiveAnalyticsProps> = ({ data }) => {
  // Generate predictive fraud forecast
  const fraudForecast = React.useMemo(() => {
    const currentFraudRate = (data.filter(t => t.riskLevel === 'High').length / data.length) * 100;
    const trend = Math.random() > 0.5 ? 1 : -1; // Simulate trend direction
    
    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date();
      day.setDate(day.getDate() + i + 1);
      
      const predictedRate = Math.max(0, currentFraudRate + (trend * i * 0.5) + (Math.random() * 2 - 1));
      const confidence = Math.max(60, 95 - (i * 5)); // Confidence decreases over time
      
      return {
        date: day.toLocaleDateString(),
        fraudRate: parseFloat(predictedRate.toFixed(1)),
        confidence: Math.round(confidence),
        transactions: Math.round(100 + Math.random() * 50)
      };
    });
  }, [data]);

  // Risk score predictions for stores
  const storeRiskPredictions = React.useMemo(() => {
    const storeStats = data.reduce((acc, t) => {
      if (!acc[t.StoreID]) acc[t.StoreID] = { total: 0, fraud: 0 };
      acc[t.StoreID].total++;
      if (t.riskLevel === 'High') acc[t.StoreID].fraud++;
      return acc;
    }, {} as any);

    return Object.entries(storeStats).map(([storeId, stats]: any) => {
      const currentRate = (stats.fraud / stats.total) * 100;
      const predictedRate = Math.max(0, currentRate + (Math.random() * 10 - 5));
      const riskLevel = predictedRate > 20 ? 'High' : predictedRate > 10 ? 'Medium' : 'Low';
      
      return {
        storeId,
        currentRate: parseFloat(currentRate.toFixed(1)),
        predictedRate: parseFloat(predictedRate.toFixed(1)),
        riskLevel,
        confidence: Math.round(75 + Math.random() * 20)
      };
    }).slice(0, 6);
  }, [data]);

  // Early warning indicators
  const earlyWarnings = React.useMemo(() => {
    const warnings = [];
    
    // Check for stores with increasing fraud trends
    storeRiskPredictions.forEach(store => {
      if (store.predictedRate > store.currentRate * 1.5) {
        warnings.push({
          type: 'Store Risk Increase',
          message: `${store.storeId} predicted fraud rate increase to ${store.predictedRate}%`,
          severity: store.riskLevel,
          confidence: store.confidence
        });
      }
    });

    // Check overall fraud trend
    const avgPredicted = fraudForecast.reduce((sum, day) => sum + day.fraudRate, 0) / fraudForecast.length;
    const currentRate = (data.filter(t => t.riskLevel === 'High').length / data.length) * 100;
    
    if (avgPredicted > currentRate * 1.2) {
      warnings.push({
        type: 'System-wide Alert',
        message: `Predicted fraud rate increase to ${avgPredicted.toFixed(1)}% over next week`,
        severity: 'High',
        confidence: 85
      });
    }

    return warnings;
  }, [fraudForecast, storeRiskPredictions, data]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'High': return 'text-red-400 bg-red-900/20';
      case 'Medium': return 'text-orange-400 bg-orange-900/20';
      default: return 'text-green-400 bg-green-900/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Early Warning System */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5" />
            <span>Early Warning System</span>
            <Badge variant="outline" className="ml-auto">
              AI Powered
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {earlyWarnings.length > 0 ? (
            <div className="space-y-3">
              {earlyWarnings.map((warning, index) => (
                <div key={index} className={`p-4 rounded-lg border-l-4 ${getSeverityColor(warning.severity)}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">{warning.type}</h4>
                      <p className="text-sm text-slate-300 mt-1">{warning.message}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant={warning.severity === 'High' ? 'destructive' : 'secondary'}>
                        {warning.severity}
                      </Badge>
                      <p className="text-xs text-slate-500 mt-1">{warning.confidence}% confidence</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-400">
              <Target className="h-8 w-8 mx-auto mb-2" />
              <p>No immediate warnings detected</p>
              <p className="text-sm">All systems operating within normal parameters</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fraud Rate Forecast */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>7-Day Fraud Forecast</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={fraudForecast}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                  formatter={(value: any, name: string) => [
                    name === 'fraudRate' ? `${value}%` : value,
                    name === 'fraudRate' ? 'Fraud Rate' : 'Confidence'
                  ]}
                />
                <Line 
                  type="monotone" 
                  dataKey="fraudRate" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
                  name="fraudRate"
                />
                <Line 
                  type="monotone" 
                  dataKey="confidence" 
                  stroke="#3b82f6" 
                  strokeWidth={1}
                  strokeDasharray="5 5"
                  dot={{ fill: '#3b82f6', strokeWidth: 1, r: 2 }}
                  name="confidence"
                />
              </LineChart>
            </ResponsiveContainer>
            <div className="mt-4 flex items-center justify-between text-sm">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-1 bg-red-500"></div>
                  <span className="text-slate-400">Fraud Rate</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-1 bg-blue-500 border-dashed"></div>
                  <span className="text-slate-400">Confidence</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Store Risk Predictions */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Target className="h-5 w-5" />
              <span>Store Risk Predictions</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {storeRiskPredictions.map((store) => (
                <div key={store.storeId} className="p-4 bg-slate-700 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-white">{store.storeId}</span>
                    <Badge variant={store.riskLevel === 'High' ? 'destructive' : 
                                  store.riskLevel === 'Medium' ? 'secondary' : 'outline'}>
                      {store.riskLevel} Risk
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-slate-400">Current Rate</p>
                      <p className="text-white font-semibold">{store.currentRate}%</p>
                    </div>
                    <div>
                      <p className="text-slate-400">Predicted Rate</p>
                      <p className={`font-semibold ${
                        store.predictedRate > store.currentRate ? 'text-red-400' : 'text-green-400'
                      }`}>
                        {store.predictedRate}%
                      </p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                      <span>Prediction Confidence</span>
                      <span>{store.confidence}%</span>
                    </div>
                    <Progress value={store.confidence} className="h-2" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
