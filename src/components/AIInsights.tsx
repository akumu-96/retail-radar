import React, { useState } from 'react';
import { TransactionData, FraudInsight } from '@/pages/Index';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, MessageSquare, TrendingUp, AlertTriangle, Send } from 'lucide-react';

interface AIInsightsProps {
  insights: FraudInsight[];
  data: TransactionData[];
}

interface StoreStats {
  total: number;
  fraud: number;
}

interface PaymentStats {
  total: number;
  fraud: number;
}

export const AIInsights: React.FC<AIInsightsProps> = ({ insights, data }) => {
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{question: string, answer: string}>>([]);

  const handleChatSubmit = () => {
    if (!chatInput.trim()) return;

    // Mock AI responses based on input patterns
    let answer = "Based on the current fraud analysis data, I can provide insights on transaction patterns and risk factors.";
    
    const input = chatInput.toLowerCase();
    if (input.includes('store') || input.includes('location')) {
      const storeStats = data.reduce((acc, t) => {
        const store = t.StoreID;
        if (!acc[store]) acc[store] = { total: 0, fraud: 0 };
        acc[store].total++;
        if (t.riskLevel === 'High') acc[store].fraud++;
        return acc;
      }, {} as Record<string, StoreStats>);

      const highestFraudStore = Object.entries(storeStats).reduce((max, [store, stats]) => {
        const fraudRate = stats.fraud / stats.total;
        const maxRate = max[1].fraud / max[1].total;
        return fraudRate > maxRate ? [store, stats] : max;
      });

      answer = `Store ${highestFraudStore[0]} has the highest fraud rate with ${highestFraudStore[1].fraud} suspicious transactions out of ${highestFraudStore[1].total} total transactions.`;
    } else if (input.includes('payment') || input.includes('method')) {
      const paymentStats = data.reduce((acc, t) => {
        if (!acc[t.PaymentType]) acc[t.PaymentType] = { total: 0, fraud: 0 };
        acc[t.PaymentType].total++;
        if (t.riskLevel === 'High') acc[t.PaymentType].fraud++;
        return acc;
      }, {} as Record<string, PaymentStats>);

      const riskiestPayment = Object.entries(paymentStats).reduce((max, [payment, stats]) => {
        const fraudRate = stats.fraud / stats.total;
        const maxRate = max[1].fraud / max[1].total;
        return fraudRate > maxRate ? [payment, stats] : max;
      });

      answer = `${riskiestPayment[0]} transactions show the highest fraud rate with ${((riskiestPayment[1].fraud / riskiestPayment[1].total) * 100).toFixed(1)}% of transactions flagged as high risk.`;
    } else if (input.includes('time') || input.includes('hour')) {
      answer = "Peak fraud activity typically occurs during off-hours (before 6 AM or after 10 PM) when fewer staff are present to monitor transactions.";
    }

    setChatHistory(prev => [...prev, { question: chatInput, answer }]);
    setChatInput('');
  };

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center space-x-2">
          <Brain className="h-5 w-5" />
          <span>AI Insights & Assistant</span>
        </CardTitle>
        <p className="text-slate-400">
          Machine learning analysis and interactive fraud detection assistant
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* AI Insights */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
            <TrendingUp className="h-4 w-4" />
            <span>Key Insights</span>
          </h3>
          
          {insights.length === 0 ? (
            <div className="p-4 bg-slate-700 rounded-lg">
              <p className="text-slate-400">Upload transaction data to generate AI insights</p>
            </div>
          ) : (
            <div className="space-y-3">
              {insights.slice(0, 3).map((insight, index) => (
                <div key={index} className="p-4 bg-slate-700 rounded-lg border-l-4 border-orange-500">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className={`h-5 w-5 mt-0.5 ${
                      insight.priority === 'High' ? 'text-red-400' : 
                      insight.priority === 'Medium' ? 'text-orange-400' : 'text-green-400'
                    }`} />
                    <div className="flex-1">
                      <h4 className="font-semibold text-white mb-1">{insight.type}</h4>
                      <p className="text-sm text-slate-300 mb-2">{insight.description}</p>
                      <div className="text-xs text-slate-400">
                        <span className="font-medium">Impact:</span> {insight.impact}
                      </div>
                      <div className="text-xs text-slate-400 mt-1">
                        <span className="font-medium">Recommendation:</span> {insight.recommendation}
                      </div>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs font-medium ${
                      insight.priority === 'High' ? 'bg-red-500/20 text-red-300' :
                      insight.priority === 'Medium' ? 'bg-orange-500/20 text-orange-300' :
                      'bg-green-500/20 text-green-300'
                    }`}>
                      {insight.priority}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* AI Chat Assistant */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
            <MessageSquare className="h-4 w-4" />
            <span>Ask the AI Assistant</span>
          </h3>

          {/* Chat History */}
          <div className="max-h-64 overflow-y-auto space-y-3">
            {chatHistory.length === 0 ? (
              <div className="p-4 bg-slate-700 rounded-lg">
                <p className="text-slate-400 text-sm">
                  Ask questions like "Which store has the most fraud?" or "What payment method is riskiest?"
                </p>
              </div>
            ) : (
              chatHistory.map((chat, index) => (
                <div key={index} className="space-y-2">
                  <div className="bg-blue-600/20 p-3 rounded-lg border border-blue-500/30">
                    <p className="text-white text-sm">{chat.question}</p>
                  </div>
                  <div className="bg-slate-700 p-3 rounded-lg">
                    <p className="text-slate-300 text-sm">{chat.answer}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Chat Input */}
          <div className="flex space-x-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleChatSubmit()}
              placeholder="Ask about fraud patterns, stores, or payment methods..."
              className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
              disabled={data.length === 0}
            />
            <Button
              onClick={handleChatSubmit}
              disabled={!chatInput.trim() || data.length === 0}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
