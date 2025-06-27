
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Shield, Activity, Clock } from 'lucide-react';
import { TransactionData } from '@/pages/Index';

interface AlertItem {
  id: string;
  type: 'critical' | 'warning' | 'info';
  message: string;
  timestamp: Date;
  storeId?: string;
}

interface RealTimeMonitorProps {
  data: TransactionData[];
}

export const RealTimeMonitor: React.FC<RealTimeMonitorProps> = ({ data }) => {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(true);

  useEffect(() => {
    if (!isMonitoring) return;

    const interval = setInterval(() => {
      // Simulate real-time alerts based on data patterns
      const criticalTransactions = data.filter(t => t.riskLevel === 'High');
      
      if (criticalTransactions.length > 0) {
        const randomTransaction = criticalTransactions[Math.floor(Math.random() * criticalTransactions.length)];
        
        const newAlert: AlertItem = {
          id: `alert-${Date.now()}`,
          type: Math.random() > 0.7 ? 'critical' : 'warning',
          message: `Suspicious activity detected at ${randomTransaction.StoreLocation?.name || randomTransaction.StoreID}`,
          timestamp: new Date(),
          storeId: randomTransaction.StoreID
        };

        setAlerts(prev => [newAlert, ...prev.slice(0, 9)]);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [data, isMonitoring]);

  const criticalAlerts = alerts.filter(a => a.type === 'critical').length;
  const warningAlerts = alerts.filter(a => a.type === 'warning').length;

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Activity className="h-5 w-5" />
            <span>Real-Time Monitor</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isMonitoring ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
            <span className="text-sm text-slate-400">{isMonitoring ? 'Live' : 'Paused'}</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-red-400">{criticalAlerts}</div>
            <div className="text-sm text-slate-400">Critical</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-400">{warningAlerts}</div>
            <div className="text-sm text-slate-400">Warnings</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">{data.length}</div>
            <div className="text-sm text-slate-400">Monitored</div>
          </div>
        </div>

        <div className="space-y-2 max-h-60 overflow-y-auto">
          {alerts.map((alert) => (
            <Alert key={alert.id} className={`border-l-4 ${
              alert.type === 'critical' ? 'border-l-red-500 bg-red-900/20' :
              alert.type === 'warning' ? 'border-l-orange-500 bg-orange-900/20' :
              'border-l-blue-500 bg-blue-900/20'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {alert.type === 'critical' ? (
                    <AlertTriangle className="h-4 w-4 text-red-400" />
                  ) : (
                    <Shield className="h-4 w-4 text-orange-400" />
                  )}
                  <AlertDescription className="text-slate-300 text-sm">
                    {alert.message}
                  </AlertDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={alert.type === 'critical' ? 'destructive' : 'secondary'} className="text-xs">
                    {alert.type}
                  </Badge>
                  <div className="flex items-center text-xs text-slate-500">
                    <Clock className="h-3 w-3 mr-1" />
                    {alert.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            </Alert>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
