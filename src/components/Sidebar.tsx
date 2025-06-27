
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  BarChart3, 
  FileText, 
  Shield, 
  TrendingUp,
  Brain,
  Activity,
  MessageCircle
} from 'lucide-react';

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
  hasData: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView, hasData }) => {
  const menuItems = [
    {
      id: 'upload',
      label: 'Data Upload',
      icon: Upload,
      description: 'Upload CSV files for analysis',
      available: true
    },
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: BarChart3,
      description: 'Overview and key metrics',
      available: hasData
    },
    {
      id: 'analytics',
      label: 'Advanced Analytics',
      icon: TrendingUp,
      description: 'Charts and data visualization',
      available: hasData,
      isNew: true
    },
    {
      id: 'predictions',
      label: 'Predictive AI',
      icon: Brain,
      description: 'Forecasting and predictions',
      available: hasData,
      isNew: true
    },
    {
      id: 'reports',
      label: 'Export Reports',
      icon: FileText,
      description: 'Generate PDF and CSV reports',
      available: hasData
    }
  ];

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-slate-900 border-r border-slate-700 p-4">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Risk Radar</h2>
            <p className="text-xs text-slate-400">AI Fraud Detection</p>
          </div>
        </div>
      </div>

      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          const isDisabled = !item.available;

          return (
            <Card
              key={item.id}
              className={`p-3 cursor-pointer transition-all duration-200 border-0 ${
                isActive
                  ? 'bg-gradient-to-r from-orange-500/20 to-red-500/20 border-orange-500/50'
                  : isDisabled
                  ? 'bg-slate-800/50 opacity-50 cursor-not-allowed'
                  : 'bg-slate-800 hover:bg-slate-700'
              }`}
              onClick={() => !isDisabled && setActiveView(item.id)}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  isActive 
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white' 
                    : 'bg-slate-700 text-slate-400'
                }`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className={`font-medium ${
                      isActive ? 'text-white' : isDisabled ? 'text-slate-500' : 'text-slate-300'
                    }`}>
                      {item.label}
                    </span>
                    {item.isNew && (
                      <Badge variant="secondary" className="text-xs bg-orange-500 text-white">
                        New
                      </Badge>
                    )}
                  </div>
                  <p className={`text-xs ${
                    isActive ? 'text-orange-200' : isDisabled ? 'text-slate-600' : 'text-slate-500'
                  }`}>
                    {item.description}
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </nav>

      {hasData && (
        <div className="mt-8 p-4 bg-slate-800 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Activity className="h-4 w-4 text-green-400" />
            <span className="text-sm font-medium text-white">System Status</span>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">AI Models</span>
              <span className="text-green-400">Active</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Real-time Monitor</span>
              <span className="text-green-400">Running</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Data Processing</span>
              <span className="text-blue-400">Ready</span>
            </div>
          </div>
        </div>
      )}

      <div className="absolute bottom-4 left-4 right-4">
        <div className="text-center text-xs text-slate-500">
          <p>Retail Risk Radar v2.0</p>
          <p>AI-Powered Detection</p>
        </div>
      </div>
    </div>
  );
};
