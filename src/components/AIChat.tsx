
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Send, Bot, User } from 'lucide-react';
import { TransactionData, FraudInsight } from '@/pages/Index';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface AIChatProps {
  data: TransactionData[];
  insights: FraudInsight[];
}

export const AIChat: React.FC<AIChatProps> = ({ data, insights }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Hello! I\'m your AI fraud detection assistant. Ask me about fraud patterns, specific transactions, or get recommendations for improving security.',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');

  const generateAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Calculate statistics for responses
    const totalTransactions = data.length;
    const highRiskCount = data.filter(t => t.riskLevel === 'High').length;
    const fraudRate = ((highRiskCount / totalTransactions) * 100).toFixed(1);
    
    if (lowerMessage.includes('fraud rate') || lowerMessage.includes('statistics')) {
      return `Based on the current data analysis:
      
• Total transactions analyzed: ${totalTransactions.toLocaleString()}
• High-risk transactions: ${highRiskCount}
• Overall fraud rate: ${fraudRate}%
• Most vulnerable payment type: ${getMostVulnerablePaymentType()}
• Highest risk store: ${getHighestRiskStore()}

This fraud rate is ${parseFloat(fraudRate) > 5 ? 'above' : 'within'} industry benchmarks.`;
    }
    
    if (lowerMessage.includes('recommendation') || lowerMessage.includes('improve')) {
      return `Here are my top recommendations to improve fraud detection:

1. **Enhanced Monitoring**: Focus on ${getHighestRiskStore()} which shows elevated fraud patterns
2. **Payment Security**: Implement additional verification for ${getMostVulnerablePaymentType()} transactions
3. **Time-based Controls**: Add restrictions during off-hours when fraud rates are higher
4. **Employee Training**: Provide additional training for high-risk locations
5. **Real-time Alerts**: Enable immediate notifications for transactions above $500

Would you like me to elaborate on any of these recommendations?`;
    }
    
    if (lowerMessage.includes('pattern') || lowerMessage.includes('trend')) {
      return `I've identified several key fraud patterns:

🔍 **Geographic Patterns**: ${insights.find(i => i.type.includes('Store'))?.description || 'No significant geographic clustering detected'}

📊 **Payment Patterns**: ${insights.find(i => i.type.includes('Payment'))?.description || 'Payment method analysis shows normal distribution'}

⏰ **Time Patterns**: ${insights.find(i => i.type.includes('Temporal'))?.description || 'Fraud activity is distributed throughout the day'}

These patterns suggest implementing targeted prevention strategies.`;
    }
    
    if (lowerMessage.includes('store') || lowerMessage.includes('location')) {
      const storeStats = getStoreStatistics();
      return `Store-by-store analysis reveals:

${storeStats.map(store => 
  `• ${store.id}: ${store.fraudCount} fraud cases (${store.fraudRate}% rate)`
).join('\n')}

Stores with fraud rates above 30% require immediate attention and enhanced security measures.`;
    }
    
    // Default response
    return `I can help you with fraud analysis in several ways:

• Ask about **fraud statistics** for current data overview
• Request **recommendations** for improving security
• Inquire about **patterns and trends** in the data
• Get **store-specific** analysis and insights
• Learn about **payment method** vulnerabilities

What would you like to know more about?`;
  };

  const getMostVulnerablePaymentType = () => {
    const paymentStats = data.reduce((acc, t) => {
      if (!acc[t.PaymentType]) acc[t.PaymentType] = { total: 0, fraud: 0 };
      acc[t.PaymentType].total++;
      if (t.riskLevel === 'High') acc[t.PaymentType].fraud++;
      return acc;
    }, {} as any);

    const vulnerablePayment = Object.entries(paymentStats)
      .sort(([,a]: any, [,b]: any) => (b.fraud/b.total) - (a.fraud/a.total))[0];
    
    return vulnerablePayment ? vulnerablePayment[0] : 'Credit Card';
  };

  const getHighestRiskStore = () => {
    const storeStats = data.reduce((acc, t) => {
      if (!acc[t.StoreID]) acc[t.StoreID] = { total: 0, fraud: 0 };
      acc[t.StoreID].total++;
      if (t.riskLevel === 'High') acc[t.StoreID].fraud++;
      return acc;
    }, {} as any);

    const riskiestStore = Object.entries(storeStats)
      .sort(([,a]: any, [,b]: any) => (b.fraud/b.total) - (a.fraud/a.total))[0];
    
    return riskiestStore ? riskiestStore[0] : 'ST001';
  };

  const getStoreStatistics = () => {
    const storeStats = data.reduce((acc, t) => {
      if (!acc[t.StoreID]) acc[t.StoreID] = { total: 0, fraud: 0 };
      acc[t.StoreID].total++;
      if (t.riskLevel === 'High') acc[t.StoreID].fraud++;
      return acc;
    }, {} as any);

    return Object.entries(storeStats).map(([id, stats]: any) => ({
      id,
      fraudCount: stats.fraud,
      fraudRate: ((stats.fraud / stats.total) * 100).toFixed(1)
    })).slice(0, 5);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    // Simulate AI thinking delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: generateAIResponse(inputValue),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);

    setInputValue('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <Card className="bg-slate-800 border-slate-700 h-96">
      <CardHeader>
        <CardTitle className="text-white flex items-center space-x-2">
          <MessageCircle className="h-5 w-5" />
          <span>AI Assistant</span>
          <Badge variant="secondary" className="ml-auto">
            Beta
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col h-80">
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start space-x-3 ${
                  message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  message.type === 'user' 
                    ? 'bg-blue-600' 
                    : 'bg-gradient-to-r from-orange-500 to-red-500'
                }`}>
                  {message.type === 'user' ? (
                    <User className="h-4 w-4 text-white" />
                  ) : (
                    <Bot className="h-4 w-4 text-white" />
                  )}
                </div>
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-700 text-slate-200'
                  }`}
                >
                  <pre className="whitespace-pre-wrap text-sm font-sans">
                    {message.content}
                  </pre>
                  <div className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        
        <div className="flex items-center space-x-2 mt-4">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about fraud patterns, statistics, or recommendations..."
            className="flex-1 bg-slate-700 border-slate-600 text-white placeholder-slate-400"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim()}
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
