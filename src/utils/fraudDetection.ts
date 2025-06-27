
import { TransactionData, FraudInsight } from '@/pages/Index';

export const detectFraud = async (data: TransactionData[]): Promise<{
  processedData: TransactionData[];
  insights: FraudInsight[];
}> => {
  console.log('Starting fraud detection analysis...');
  
  // Simulate AI processing delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  const processedData = data.map(transaction => {
    let fraudScore = 0;
    let fraudType = '';
    
    // Anomaly detection rules
    
    // 1. Unusual amount patterns
    if (transaction.Amount > 1000) {
      fraudScore += 0.3;
      fraudType += 'High Amount, ';
    }
    
    if (transaction.Amount < 1) {
      fraudScore += 0.4;
      fraudType += 'Suspicious Low Amount, ';
    }

    // 2. Payment type analysis
    if (transaction.PaymentType === 'Cash' && transaction.Amount > 500) {
      fraudScore += 0.2;
      fraudType += 'Large Cash Transaction, ';
    }

    // 3. Time-based patterns (mock)
    const hour = new Date(transaction.Timestamp).getHours();
    if (hour < 6 || hour > 22) {
      fraudScore += 0.25;
      fraudType += 'Off-Hours Activity, ';
    }

    // 4. Store-based risk (mock)
    if (transaction.StoreID.includes('ST001') || transaction.StoreID.includes('ST003')) {
      fraudScore += 0.2;
      fraudType += 'High-Risk Store, ';
    }

    // 5. Product-based risk (mock)
    if (transaction.ProductID.includes('GIFT') || transaction.ProductID.includes('RETURN')) {
      fraudScore += 0.3;
      fraudType += 'High-Risk Product, ';
    }

    // Random variation to simulate AI uncertainty
    fraudScore += (Math.random() - 0.5) * 0.2;
    fraudScore = Math.max(0, Math.min(1, fraudScore));

    // Determine risk level
    let riskLevel: 'Low' | 'Medium' | 'High';
    if (fraudScore > 0.7) riskLevel = 'High';
    else if (fraudScore > 0.4) riskLevel = 'Medium';
    else riskLevel = 'Low';

    return {
      ...transaction,
      fraudScore,
      riskLevel,
      fraudType: fraudType.slice(0, -2) || 'Normal'
    };
  });

  // Generate AI insights
  const insights = generateInsights(processedData);
  
  console.log('Fraud detection completed:', {
    totalTransactions: processedData.length,
    highRisk: processedData.filter(t => t.riskLevel === 'High').length,
    insights: insights.length
  });

  return { processedData, insights };
};

const generateInsights = (data: TransactionData[]): FraudInsight[] => {
  const insights: FraudInsight[] = [];
  
  // Store analysis
  const storeStats = data.reduce((acc, t) => {
    const store = t.StoreID;
    if (!acc[store]) acc[store] = { total: 0, fraud: 0 };
    acc[store].total++;
    if (t.riskLevel === 'High') acc[store].fraud++;
    return acc;
  }, {} as any);

  const highFraudStores = Object.entries(storeStats)
    .filter(([_, stats]: any) => stats.fraud / stats.total > 0.3)
    .map(([store]) => store);

  if (highFraudStores.length > 0) {
    insights.push({
      type: 'High-Risk Store Alert',
      description: `${highFraudStores.length} stores show elevated fraud rates above 30%. Stores ${highFraudStores.slice(0, 3).join(', ')} require immediate attention.`,
      impact: 'Potential revenue loss and compliance risk',
      recommendation: 'Implement enhanced monitoring and staff training for flagged locations',
      priority: 'High'
    });
  }

  // Payment type analysis
  const paymentStats = data.reduce((acc, t) => {
    if (!acc[t.PaymentType]) acc[t.PaymentType] = { total: 0, fraud: 0 };
    acc[t.PaymentType].total++;
    if (t.riskLevel === 'High') acc[t.PaymentType].fraud++;
    return acc;
  }, {} as any);

  const riskiestPayment = Object.entries(paymentStats)
    .sort(([,a]: any, [,b]: any) => (b.fraud/b.total) - (a.fraud/a.total))[0];

  if (riskiestPayment) {
    const [paymentType, stats]: any = riskiestPayment;
    const fraudRate = ((stats.fraud / stats.total) * 100).toFixed(1);
    
    insights.push({
      type: 'Payment Method Risk Pattern',
      description: `${paymentType} transactions show a ${fraudRate}% fraud rate, significantly above baseline.`,
      impact: 'Systematic payment fraud vulnerability',
      recommendation: 'Review and strengthen payment verification processes for this method',
      priority: 'Medium'
    });
  }

  // Time-based patterns
  const timeStats = data.reduce((acc, t) => {
    const hour = new Date(t.Timestamp).getHours();
    const timeSlot = hour < 12 ? 'Morning' : hour < 18 ? 'Afternoon' : 'Evening';
    if (!acc[timeSlot]) acc[timeSlot] = { total: 0, fraud: 0 };
    acc[timeSlot].total++;
    if (t.riskLevel === 'High') acc[timeSlot].fraud++;
    return acc;
  }, {} as any);

  const peakFraudTime = Object.entries(timeStats)
    .sort(([,a]: any, [,b]: any) => (b.fraud/b.total) - (a.fraud/a.total))[0];

  if (peakFraudTime) {
    const [timeSlot, stats]: any = peakFraudTime;
    insights.push({
      type: 'Temporal Fraud Pattern',
      description: `${timeSlot} hours show the highest concentration of suspicious activities with ${stats.fraud} fraud cases.`,
      impact: 'Time-specific vulnerability window',
      recommendation: 'Increase security measures and monitoring during peak fraud hours',
      priority: 'Medium'
    });
  }

  // Overall risk assessment
  const overallFraudRate = (data.filter(t => t.riskLevel === 'High').length / data.length) * 100;
  
  if (overallFraudRate > 5) {
    insights.push({
      type: 'Elevated Fraud Risk Environment',
      description: `Current fraud detection rate of ${overallFraudRate.toFixed(1)}% exceeds industry benchmark of 3-5%.`,
      impact: 'Significant financial and reputational risk',
      recommendation: 'Implement comprehensive fraud prevention strategy across all channels',
      priority: 'High'
    });
  }

  return insights;
};
